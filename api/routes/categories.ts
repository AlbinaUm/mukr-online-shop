import express from "express";
import mysqlDb from "../mysqlDb";
import {Category} from "../types";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {validate} from "../middleware/validate";
import {CategorySchema} from "../schemas/category";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM category');
        const categories = rows as Category[];
        res.send(categories);
    } catch (e) {
        next(e);
    }
});


categoriesRouter.post(
    '/',
    validate(CategorySchema),
    async (req, res, next) => {
        const { title, description } = req.body;

        try {
            const connection = await mysqlDb.getConnection();

            const [result] = await connection.query<ResultSetHeader>(
                'INSERT INTO category (title, description) VALUES (?, ?)',
                [title, description || null]
            );

            console.log(result);

            res.status(201).json({
                message: 'Категория создана',
                categoryId: result.insertId
            });
        } catch (e) {
            next(e);
        }
    }
);

categoriesRouter.patch(
    '/:id',
    validate(CategorySchema),
    async (req, res, next) => {
        const categoryId = req.params.id;
        const { title, description } = req.body;

        try {
            const connection = await mysqlDb.getConnection();

            const [result] = await connection.query<ResultSetHeader>(
                'UPDATE category SET title = ?, description = ? WHERE id = ?',
                [title || null, description || null, categoryId]
            );

            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Категория не найдена' });
                return;
            }

            res.json({ message: 'Категория обновлена' });
        } catch (e) {
            next(e);
        }
    }
);




export default categoriesRouter;