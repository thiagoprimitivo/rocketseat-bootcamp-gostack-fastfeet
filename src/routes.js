import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

/**
 * Rota para criação da sessão de usuário
 */
routes.post('/sessions', SessionController.store);

/**
 * Middleware responsável por verificar se o usuário está logado no sistema
 */
routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

export default routes;
