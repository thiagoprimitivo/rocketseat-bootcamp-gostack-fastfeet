import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class OrderController {
  async index(req, res) {
    let where;

    const { deliverymanId } = req.params;

    const { delivered } = req.query;

    const checkIsDelivered = Boolean(delivered);

    if (!delivered) {
      where = {
        deliveryman_id: deliverymanId,
        canceled_at: null,
        start_date: null,
        end_date: null,
      };
    } else if (checkIsDelivered) {
      where = {
        deliveryman_id: deliverymanId,
        end_date: { [Op.ne]: null },
      };
    }

    const deliveries = await Delivery.findAll({
      where,
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
}

export default new OrderController();
