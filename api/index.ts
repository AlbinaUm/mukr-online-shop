import express from "express";
import cors from "cors";
import config from "./config";
import mysqlDb from "./mysqlDb";
import {attach_mysql_db} from "./middleware/attach_mysql_db";
import categoriesRouter from "./routes/categories";
import productsRouter from "./routes/products";
import warehousesRouter from "./routes/warehouses";
import usersRouter from "./routes/users";
import ordersRouter from "./routes/orders";


const app = express();

app.use(attach_mysql_db);
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/warehouses', warehousesRouter);
app.use('/orders', ordersRouter);


const run = async () => {
    await mysqlDb.init();

    app.listen(config.port, () => {
        console.log(`Server started on port http://localhost:${config.port}`);
    });
};

run().catch(err => console.log(err));