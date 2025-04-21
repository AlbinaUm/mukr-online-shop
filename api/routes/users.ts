// src/routes/users.ts
import express from 'express';
import mysqlDb from '../mysqlDb';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { validate } from '../middleware/validate';
import { registerUserSchema, loginUserSchema } from '../schemas/user';
import {auth} from "../middleware/auth";
import permit from "../middleware/permit";

const usersRouter = express.Router();

// POST /users/register
usersRouter.post('/register', validate(registerUserSchema), async (req, res, next) => {
    const { email, first_name, last_name, phone_number, password } = req.body;
    const token = uuidv4();

    try {
        const connection = await mysqlDb.getConnection();

        const [existing] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM user WHERE phone_number = ? OR email = ?',
            [phone_number, email]
        );

        if (existing.length > 0) {
            res.status(409).json({ error: 'Пользователь уже существует' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query<ResultSetHeader>(
            'INSERT INTO user (email, first_name, last_name, phone_number, token, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [email, first_name, last_name, phone_number, token, 'user', hashedPassword]
        );

        res.status(201).json({ message: 'Пользователь зарегистрирован', token });
    } catch (e) {
        next(e);
    }
});

// POST /users/login
usersRouter.post('/login', validate(loginUserSchema), async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const connection = await mysqlDb.getConnection();

        const [users] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM user WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(401).json({ error: 'Неверный email или пароль' });
            return;
        }

        const token = uuidv4();

        await connection.query(
            'UPDATE user SET token = ? WHERE id = ?',
            [token, user.id]
        );

        res.json({ message: 'Успешный вход', token });
    } catch (e) {
        next(e);
    }
});

usersRouter.post('/logout', auth, async (req, res, next) => {
    const token = req.headers.authorization;

    try {
        const connection = await mysqlDb.getConnection();
        await connection.query('UPDATE user SET token = NULL WHERE token = ?', [token]);

        res.json({ message: 'Выход выполнен' });
    } catch (e) {
        next(e);
    }
});

// GET /users (admin only)
usersRouter.get('/', auth, permit('admin'), async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();

        const [users] = await connection.query<RowDataPacket[]>(
            'SELECT id, email, first_name, last_name, phone_number, role FROM user'
        );

        res.json(users);
    } catch (e) {
        next(e);
    }
});

export default usersRouter;
