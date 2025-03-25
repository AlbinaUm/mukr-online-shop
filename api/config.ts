import path from "path";
import {CorsOptions} from "cors";
import {configDotenv} from "dotenv";

const envFile = process.env['NODE_ENV'] ?
    `.${process.env['NODE_ENV']}.env` :
    '.env';

configDotenv({path: envFile});

const rootPath = __dirname;

const corsWhiteList = [
    'http://localhost:3000',
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || corsWhiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No allowed by CORS'));
        }
    },
    credentials: true,
};

const config = {
    port: process.env.PORT || 8000,
    rootPath,
    publicPath: path.join(rootPath, 'public'),
    corsOptions,
    db: process.env.MONGODB_URI || 'mongodb://localhost/mukr-shop-online',
};


export default config;