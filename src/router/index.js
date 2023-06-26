import swaggerUiExpress from 'swagger-ui-express';
import swaggerSpecs from '../config/swagger.config.js';
import productsController from "../products/controller.products.js";
import cartsController from "../carts/controller.carts.js";
import usersController from "../users/controller.users.js";
import authController from "../auth/controller.auth.js";
import viewsController from '../views/controller.views.js';

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/users', usersController);
    app.use('/api/auth', authController);
    app.use('/', viewsController);
    app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));
};

export default router;