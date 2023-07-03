import appConfig from "../config/app.config.js";
import MongoConnection from "../../db/mongo.db.js";
import __dirname from "../utils/dirname.utils.js";

const { environment } = appConfig;

export let productsDAO;
export let cartsDAO;
export let usersDAO;
export let ticketsDAO;
export let chatDAO;

switch (environment) {
    case 'local':
        const { default: ProductFiles } = await import("./fileSystem/productManager.fs.js");
        const productsPath = __dirname + '/files/products.json';
        productsDAO = new ProductFiles(productsPath);

        const { default: CartFiles } = await import("./fileSystem/cartManager.fs.js");
        const cartsPath = __dirname + '/files/carts.json';
        cartsDAO = new CartFiles(cartsPath);

        const { default: UserFiles } = await import("./fileSystem/userManager.fs.js");
        const usersPath = __dirname + '/files/users.json';
        usersDAO = new UserFiles(usersPath);

        const { default: TicketFiles } = await import("./fileSystem/ticketManager.fs.js");
        const ticketsPath = __dirname + '/files/tickets.json';
        ticketsDAO = new TicketFiles(ticketsPath);

        const { default: ChatFiles } = await import("./fileSystem/chatManager.fs.js");
        const chatPath = __dirname + '/files/chat.json';
        chatDAO = new ChatFiles(chatPath);

        console.log('Persistence in File System');
        break;
    case 'development':
        MongoConnection.getInstance();

        const { default: ProductMongo } = await import("./mongoDB/persistence/productManager.mongo.js");
        productsDAO = new ProductMongo();

        const { default: CartMongo } = await import("./mongoDB/persistence/cartManager.mongo.js");
        cartsDAO = new CartMongo();

        const { default: UserMongo } = await import("./mongoDB/persistence/userManager.mongo.js");
        usersDAO = new UserMongo();

        const { default: TicketMongo } = await import('./mongoDB/persistence/ticketManager.mongo.js');
        ticketsDAO = new TicketMongo();

        const { default: ChatMongo } = await import('./mongoDB/persistence/chatManager.mongo.js');
        chatDAO = new ChatMongo();

        console.log('Persistence in MongoDB');
        break;
};