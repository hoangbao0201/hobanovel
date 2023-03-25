import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host: process.env.DB_MYSQL_HOST as string,
    port: process.env.DB_MYSQL_PORT as number | undefined,
    user: process.env.DB_MYSQL_USER as string,
    password: process.env.DB_MYSQL_PASSWORD as string,
    database: process.env.DB_MYSQL_DATABASE as string,
    connectionLimit: 100
});

export default pool
