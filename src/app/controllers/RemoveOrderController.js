import { Op } from 'sequelize';
import { isWithinInterval, format, parseISO } from 'date-fns';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class RemoveOrderController {
  async update(req, res) {
    const { deliveryman_id } = req.body;

    /**
     * Checks if it is in the allowed time between 08:00 and 18:00
     */

    const startDate = format(new Date(), "yyyy-MM-dd'T08:00:00'xxx");
    const finalDate = format(new Date(), "yyyy-MM-dd'T18:00:00'xxx");

    const checkIsValidInterval = isWithinInterval(new Date(), {
      start: parseISO(startDate),
      end: parseISO(finalDate),
    });

    if (!checkIsValidInterval) {
      return res.status(400).json({
        error: 'Orders can only be picked up between 08:00 and 18:00',
      });
    }

    /**
     * Checks if delivery exists
     */

    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    /**
     * Checks if deliveryman exists
     */

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    /**
     * Checks numbers of withdrawn delivery (max of 05 per day)
     */

    const countNumberDeliveriesWithdrawn = await Delivery.count({
      where: {
        deliveryman_id,
        start_date: { [Op.ne]: null },
      },
    });

    if (countNumberDeliveriesWithdrawn >= 5) {
      return res
        .status(400)
        .json({ error: 'You can remove only 5 orders per day' });
    }

    await delivery.update({ start_date: new Date() });

    return res.json(delivery);
  }
}

export default new RemoveOrderController();
