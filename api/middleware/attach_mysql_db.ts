import { Request, Response, NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";
import mysqlDb from "../mysqlDb";

export const attach_mysql_db = async (req: Request, res: Response, next: NextFunction) => {
    const connection: PoolConnection = await mysqlDb.getConnection();

    (req as any).db = connection;

    res.on("finish", () => {
        connection.release();
    });

    next();
};
