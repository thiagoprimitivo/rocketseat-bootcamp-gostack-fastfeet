import File from '../models/File';
import Delivery from '../models/Delivery';

class FinalizeDeliveryController {
  async update(req, res) {
    const { id } = req.params;

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    if (!file) {
      return res.status(400).json({ error: 'The file could not be sent' });
    }

    /**
     * Checks if delivery exists
     */

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.json(delivery);
  }
}

export default new FinalizeDeliveryController();
