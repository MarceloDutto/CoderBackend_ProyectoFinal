import productsController from "../products/controller.products.js";
import cartsController from "../carts/controller.carts.js";
import usersController from "../users/controller.users.js";
import authController from "../auth/controller.auth.js";

const router = (app) => {
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
    app.use('/api/users', usersController);
    app.use('/api/auth', authController)
};

export default router;