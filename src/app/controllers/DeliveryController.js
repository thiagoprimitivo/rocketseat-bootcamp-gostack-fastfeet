import * as Yup from 'yup';

import { format } from 'date-fns';
import pt_BR from 'date-fns/locale/pt-BR';

import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

class DeliveryController {
  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'house_number',
            'address_complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.json({ deliveries });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { product, recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const delivery = await Delivery.create(req.body);

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda disponível para retirada',
      template: 'creation',
      context: {
        product,
        recipient: recipient.name,
        address: `${recipient.street} ${recipient.house_number}, ${recipient.address_complement}, ${recipient.city}-${recipient.state}, CEP.:${recipient.zip_code}`,
        deliveryman: deliveryman.name,
        date: format(delivery.created_at, "dd 'de' MMMM', às ' H:mm'h'", {
          locale: pt_BR,
        }),
      },
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const checkIsCanceled = await Delivery.findOne({
      where: { id: req.params.id, canceled_at: null },
    });

    if (!checkIsCanceled) {
      return res.status(400).json({ error: 'Delivery is canceled' });
    }

    const checkIsWithdrawn = await Delivery.findOne({
      where: { id: req.params.id, start_date: null },
    });

    if (!checkIsWithdrawn) {
      return res.status(400).json({ error: 'Order already withdrawn' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const deliveryUpdate = await delivery.update(req.body);

    return res.json(deliveryUpdate);
  }
}

export default new DeliveryController();
