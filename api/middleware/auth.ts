// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import mysqlDb from '../mysqlDb';
import { RowDataPacket } from 'mysql2';

export interface RequestWithUser extends Request {
    user?: {
        id: number;
        role: string;
    };
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ error: 'Нет токена' });
        return;
    }

    try {
        const connection = await mysqlDb.getConnection();
        const [users] = await connection.query<RowDataPacket[]>(
            'SELECT id, role FROM user WHERE token = ?',
            [token]
        );

        if (users.length === 0) {
            res.status(401).json({ error: 'Неверный токен' });
            return;
        }

        (req as RequestWithUser).user = {
            id: users[0].id,
            role: users[0].role,
        };

        next();
    } catch (e) {
        next(e);
    }
};
