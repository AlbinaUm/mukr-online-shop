import express from 'express';
import mysqlDb from '../mysqlDb';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order';

const ordersRouter = express.Router();

ordersRouter.post('/', auth, validate(createOrderSchema), async (req, res, next) => {
    const { address, city, products } = req.body;
    const reqUser = req as any;

    try {
        const connection = await mysqlDb.getConnection();

        const [orderResult] = await connection.query<ResultSetHeader>(
            `INSERT INTO \`order\` (customer_id, status, address, city)
             VALUES (?, 'NEW', ?, ?)`,
            [reqUser.user.id, address, city]
        );

        const orderId = orderResult.insertId;

        const productIds = products.map((item: any) => item.product_id);
        const [productRows] = await connection.query<RowDataPacket[]>(
            'SELECT id, price FROM product WHERE id IN (?)',
            [productIds]
        );

        const priceMap: Record<number, number> = {};
        productRows.forEach(p => {
            priceMap[p.id] = p.price;
        });

        const values = products.map((item: any) => [
            orderId,
            item.product_id,
            priceMap[item.product_id] ?? 0,
            item.count
        ]);

        await connection.query(
            'INSERT INTO order_product (order_id, product_id, price, count) VALUES ?',
            [values]
        );

        res.status(201).json({ message: 'Заказ оформлен', orderId });
    } catch (e) {
        next(e);
    }
});

ordersRouter.get('/', auth, async (req, res, next) => {
    const reqUser = req as any;

    try {
        const connection = await mysqlDb.getConnection();

        const [orders] = await connection.query<RowDataPacket[]>(
            reqUser.user.role === 'admin'
                ? `SELECT * FROM 'order'`
    : `SELECT * FROM 'order' WHERE customer_id = ?`,
            reqUser.user.role === 'admin' ? [] : [reqUser.user.id]
    );

        const [items] = await connection.query<RowDataPacket[]>(
            `SELECT op.order_id, op.product_id, p.title, op.price, op.count
             FROM order_product op
             JOIN product p ON p.id = op.product_id`
        );

        const result = orders.map(order => {
            const orderItems = items.filter(i => i.order_id === order.id);
            return {
                ...order,
                products: orderItems.map(i => ({
                    product_id: i.product_id,
                    title: i.title,
                    price: i.price,
                    count: i.count,
                }))
            };
        });

        res.json(result);
    } catch (e) {
        next(e);
    }
});

ordersRouter.patch('/:id', auth, validate(updateOrderStatusSchema), async (req, res, next) => {
    const reqUser = req as any;
    const orderId = req.params.id;
    const { status } = req.body;

    if (reqUser.user.role !== 'admin') {
        res.status(403).json({ error: 'Доступ запрещён' });
        return;
    }

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query<ResultSetHeader>(
            `UPDATE 'order' SET status = ?, completed_at = IF(? = 'DELIVERED', NOW(), completed_at) WHERE id = ?`,
            [status, status, orderId]
    );

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Заказ не найден' });
            return;
        }

        res.json({ message: 'Статус заказа обновлён' });
    } catch (e) {
        next(e);
    }
});

export default ordersRouter;