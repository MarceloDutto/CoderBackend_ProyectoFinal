import appConfig from "../config/app.config.js";
import localLogger from "./local.logger.js";
import devLogger from "./dev.logger.js";

const { environment } = appConfig;
let logger;

switch (environment) {
    case 'local':
        console.log('Using local logger');
        logger = localLogger;
        break;
    case 'development':
        console.log('Using development logger');
        logger = devLogger;
        break;
};

export default logger;