const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  

// Function to execute MySQL queries
const executeQuery = async (query, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};

// Define Category model
const Category = {
  // Function to create a new category
  create: async (name, image) => {
    const query = 'INSERT INTO categories (name, image) VALUES (?, ?)';
    await executeQuery(query, [name, image]);
  },

  // Function to find all categories
  findAll: async () => {
    const query = 'SELECT * FROM categories';
    const categories = await executeQuery(query);
    return categories;
  },

  // Other functions as needed
};

module.exports = Category;
