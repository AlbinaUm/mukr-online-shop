import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";


const app = express();

app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.static('public'));


const run = async () => {
    await mongoose.connect(config.db);

    app.listen(config.port, () => {
        console.log(`Server started on port http://localhost:${config.port}`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch(err => console.log(err));