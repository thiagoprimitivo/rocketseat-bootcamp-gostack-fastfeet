import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import OrderController from './app/controllers/OrderController';
import RemoveOrderController from './app/controllers/RemoveOrderController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Rota para criação da sessão de usuário
 */
routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:deliverymanId/deliveries', OrderController.index);
routes.put('/removedelivery/:id', RemoveOrderController.update);

/**
 * Middleware responsável por verificar se o usuário está logado no sistema
 */
routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);

export default routes;
