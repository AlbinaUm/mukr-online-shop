import express from "express";
import mysqlDb from "../mysqlDb";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { validate } from "../middleware/validate";
import { createWarehouseSchema, updateWarehouseSchema, updateWarehouseProductsSchema } from "../schemas/warehouse";

const warehousesRouter = express.Router();


warehousesRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();

        const [warehouses] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM warehouse'
        );

        const [stocks] = await connection.query<RowDataPacket[]>(
            `SELECT pw.warehouse_id, p.id as product_id, p.title, pw.count
             FROM product_warehouse pw
                      JOIN product p ON pw.product_id = p.id`
        );

        const result = warehouses.map(warehouse => {
            const productMap: Record<number, { id: number, title: string, count: number }> = {};

            stocks
                .filter(stock => stock.warehouse_id === warehouse.id)
                .forEach(stock => {
                    if (!productMap[stock.product_id]) {
                        productMap[stock.product_id] = {
                            id: stock.product_id,
                            title: stock.title,
                            count: stock.count,
                        };
                    } else {
                        productMap[stock.product_id].count += stock.count;
                    }
                });

            const products = Object.values(productMap);

            return {
                ...warehouse,
                products,
            };
        });

        res.json(result);
    } catch (e) {
        next(e);
    }
});

warehousesRouter.post('/', validate(createWarehouseSchema), async (req, res, next) => {
    const { title, description, is_active } = req.body;

    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO warehouse (title, description, is_active) VALUES (?, ?, ?)',
            [title, description ?? null, is_active ?? 1]
        );

        res.status(201).json({ message: 'Склад создан', warehouseId: result.insertId });
    } catch (e) {
        next(e);
    }
});

warehousesRouter.patch('/:id', validate(updateWarehouseSchema), async (req, res, next) => {
    const warehouseId = req.params.id;
    const { title, description, is_active } = req.body;

    try {
        const connection = await mysqlDb.getConnection();

        const [existing] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM warehouse WHERE id = ?',
            [warehouseId]
        );

        if (existing.length === 0) {
            res.status(404).json({ error: 'Склад не найден' });
            return;
        }

        const current = existing[0];

        await connection.query(
            'UPDATE warehouse SET title = ?, description = ?, is_active = ? WHERE id = ?',
            [
                title ?? current.title,
                description ?? current.description,
                is_active ?? current.is_active,
                warehouseId
            ]
        );

        res.json({ message: 'Склад обновлён' });
    } catch (e) {
        next(e);
    }
});


warehousesRouter.patch('/:id/products', validate(updateWarehouseProductsSchema), async (req, res, next) => {
    const warehouseId = req.params.id;
    const { products } = req.body;

    try {
        const connection = await mysqlDb.getConnection();

        for (const { product_id, count } of products) {
            await connection.query(
                `INSERT INTO product_warehouse (product_id, warehouse_id, count)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE count = ?`,
                [product_id, warehouseId, count, count]
            );
        }

        res.json({ message: 'Остатки на складе обновлены' });
    } catch (e) {
        next(e);
    }
});

export default warehousesRouter;
