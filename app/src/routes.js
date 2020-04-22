import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './app/middlewares/auth';

import sessionStoreRequest from './app/middlewares/requests/sessionStoreRequest';
import userStoreRequest from './app/middlewares/requests/userStoreRequest';
import userUpdateRequest from './app/middlewares/requests/userUpdateRequest';
import authUpdateRequest from './app/middlewares/requests/authUpdateRequest';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  res.send('Ok');
})

routes.post('/sessions', sessionStoreRequest, SessionController.store);

routes.post('/users', userStoreRequest, UserController.store);
routes.use(authMiddleware);

routes.get('/auth', AuthController.index);
routes.put('/auth', authUpdateRequest, AuthController.update);

routes.get('/users', UserController.index);
routes.put('/users', userUpdateRequest, UserController.update);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
