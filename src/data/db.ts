import mysql from 'mysql2/promise';

// Create a connection pool for MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', // Replace with your MySQL host
  user: process.env.DB_USER || 'root', // Replace with your MySQL username
  password: process.env.DB_PASSWORD || '#InsideOut6', // Replace with your MySQL password
  database: process.env.DB_NAME || 'timecapsuledbs', // Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
