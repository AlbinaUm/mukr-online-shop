import mysql, { Pool, PoolConnection } from "mysql2/promise";

let pool: Pool;

const mysqlDb = {
    async init() {
        pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: process.env.MY_SQL_DB_PASSWORD,
            database: 'shop-online-mukr',
            waitForConnections: true,
            connectionLimit: 10, // можно изменить по нагрузке
            queueLimit: 0
        });
    },

    async getConnection(): Promise<PoolConnection> {
        if (!pool) {
            throw new Error("Pool has not been initialized. Call mysqlDb.init() first.");
        }
        return await pool.getConnection();
    }
};

export default mysqlDb;
