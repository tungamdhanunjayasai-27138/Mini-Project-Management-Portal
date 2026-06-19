const mysql = require("mysql2/promise");

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "project_management_portal",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    connection.release();
    console.log("MySQL connected");
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    process.exit(1);
  }
};

const query = async (sql, params = []) => {
  if (!pool) {
    throw new Error("Database connection has not been initialized");
  }

  return pool.execute(sql, params);
};

module.exports = connectDB;
module.exports.query = query;
