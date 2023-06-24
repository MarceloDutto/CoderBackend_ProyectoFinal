import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../utils/dirname.utils.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de e-commerce coderBackend',
            description: 'Información sobre las características y funcionalidades de los recursos de la aplicación de e-commerce desarrollada en la clase de Programación Backend de Coderhouse.'
        }
    },
    apis: [`${__dirname}/documentation/**/*.yaml`]
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;