import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.DB_MYSQL_HOST as string,
    port: process.env.DB_MYSQL_PORT as number | undefined,
    user: process.env.DB_MYSQL_USER as string,
    password: process.env.DB_MYSQL_PASSWORD as string,
    database: process.env.DB_MYSQL_DATABASE as string,
    connectionLimit: 100,
});

export default pool;

async function testConnection() {
    try {
        // Kiểm tra kết nối
        const connection = await pool.getConnection();
        console.log("Kết nối thành công!");
        connection.release();
    } catch (error) {
        console.error("Kết nối thất bại:", error);
    } finally {
        pool.end();
    }
}

testConnection();

// Kết nối đến SQL Workbench

// import sql from 'mssql/msnodesqlv8'

// const connectDB = async () => {
//     return await sql.connect('Server=169.254.116.42:1433;Database=hoangbaob1')
// }

// const config = {
//     server: '169.254.116.42',
//     database: 'hoangbaob1',
//     user: 'your_username',
//     password: 'baodeptrai199',
//     driver: "msnodesqlv8",
//     options: {
//         encrypt: false
//     }
// };

// const connection = new sql.ConnectionPool(config);

// async function connectAndQuery() {
//     try {
//         await connection.connect();
//         console.log('Connected to SQL Server');

//         const result = await connection.query('SELECT * FROM KHACHHANG');
//         console.log('Query result:', result.recordset);
//     } catch (error) {
//         console.log('Error:', error);
//     } finally {
//         await connection.close();
//         console.log('Disconnected from SQL Server');
//     }
// }

// connectAndQuery();
