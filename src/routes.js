import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

/**
 * Rota para criação da sessão de usuário
 */
routes.post('/sessions', SessionController.store);

/**
 * Middleware responsável por verificar se o usuário está logado no sistema
 */
routes.use(authMiddleware);

export default routes;
