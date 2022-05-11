import { Router } from 'express';
import fs from 'fs';
import path from 'path';

// swagger

import swaggerUi from 'swagger-ui-express';

const swaggerDoc = JSON.parse(
    fs.readFileSync(`${path.resolve()}/swagger.json`)
);

// controllers

import LoginController from './app/controllers/LoginController.js';
import UserController from './app/controllers/UserController.js';
import auth from './app/middlewares/auth.js';

const routes = new Router();

//routes

routes.get('/version', (req, res) => {
    res.json(process.env.APP_VERSION);
});

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

routes.post('/auth', LoginController.auth);

// routes before validation

routes.use(auth);

// routes after validation
routes.get('/users', UserController.index);
routes.get('/user/:id', UserController.show);
routes.post('/user', UserController.store);

export default routes;
