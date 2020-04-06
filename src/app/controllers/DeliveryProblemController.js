import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async index(req, res) {
    const { deliveryId } = req.params;

    let deliveryProblems = [];

    if (deliveryId) {
      deliveryProblems = await DeliveryProblem.findOne({
        where: { delivery_id: deliveryId },
      });
      return res.json(deliveryProblems);
    }

    deliveryProblems = await DeliveryProblem.findAll();
    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const { description } = req.body;
    const { deliveryId } = req.params;

    const { id, delivery_id } = await DeliveryProblem.create({
      description,
      delivery_id: Number(deliveryId),
    });

    return res.json({ id, description, delivery_id });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancelation',
      context: {
        to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
        product: delivery.product,
        recipient: delivery.recipient.name,
        deliveryman: delivery.deliveryman.name,
      },
    });

    return res.send();
  }
}

export default new DeliveryProblemController();
