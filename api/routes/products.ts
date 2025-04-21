// src/routes/products.ts
import express from "express";
import mysqlDb from "../mysqlDb";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { validate } from "../middleware/validate";
import { createProductSchema } from "../schemas/product";

const productsRouter = express.Router();


productsRouter.get('/', async (req, res, next) => {
    const categoryParam = req.query.category;

    try {
        const connection = await mysqlDb.getConnection();

        const categoryIds = categoryParam
            ? String(categoryParam).split(',').map(Number).filter(Boolean)
            : [];

        const query = `
      SELECT 
        p.id AS productId,
        p.title,
        p.description,
        p.price,
        p.visible,
        c.id AS categoryId,
        c.title AS categoryTitle
      FROM product p
      LEFT JOIN category_product cp ON p.id = cp.product_id
      LEFT JOIN category c ON cp.category_id = c.id
      ${categoryIds.length > 0 ? 'WHERE cp.category_id IN (?)' : ''}
    `;

        const [rows] = await connection.query<RowDataPacket[]>(query, categoryIds.length > 0 ? [categoryIds] : []);

        const productsMap: Record<number, any> = {};

        for (const row of rows) {
            if (!productsMap[row.productId]) {
                productsMap[row.productId] = {
                    id: row.productId,
                    title: row.title,
                    description: row.description,
                    price: row.price,
                    visible: row.visible,
                    categories: [],
                };
            }

            if (row.categoryId) {
                productsMap[row.productId].categories.push({
                    id: row.categoryId,
                    title: row.categoryTitle,
                });
            }
        }

        res.json(Object.values(productsMap));
    } catch (e) {
        next(e);
    }
});



productsRouter.post('/', validate(createProductSchema), async (req, res, next) => {
    const { title, description, price, visible, categoryIds } = req.body;

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO product (title, description, price, visible) VALUES (?, ?, ?, ?)',
            [title, description, price, visible ?? 1]
        );

        const productId = result.insertId;

        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            const values = categoryIds.map((catId: number) => [productId, catId]);

            await connection.query(
                'INSERT INTO category_product (product_id, category_id) VALUES ' +
                values.map(() => '(?, ?)').join(', '),
                values.flat()
            );
        }

        res.status(201).json({ message: 'Продукт создан', productId });
    } catch (e) {
        next(e);
    }
});


productsRouter.patch('/:id', validate(createProductSchema), async (req, res, next) => {
    const productId = req.params.id;
    const { title, description, price, visible, categoryIds } = req.body;

    try {
        const connection = await mysqlDb.getConnection();

        await connection.query(
            'UPDATE product SET title = ?, description = ?, price = ?, visible = ? WHERE id = ?',
            [title, description, price, visible, productId]
        );

        if (Array.isArray(categoryIds)) {
            await connection.query('DELETE FROM category_product WHERE product_id = ?', [productId]);
            if (categoryIds.length > 0) {
                const values = categoryIds.map((catId: number) => [productId, catId]);
                await connection.query('INSERT INTO category_product (product_id, category_id) VALUES ?', [values]);
            }
        }

        res.json({ message: 'Продукт обновлён' });
    } catch (e) {
        next(e);
    }
});

export default productsRouter;
