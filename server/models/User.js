const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

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

// Define User model
const User = {
  // Function to create a new user
  create: async (name, email, password, description) => {
    const hash_password = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, hash_password, description) VALUES (?, ?, ?, ?)';
    await executeQuery(query, [name, email, hash_password, description]);
  },

  // Function to find a user by email
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const users = await executeQuery(query, [email]);
    return users[0]; // Assuming email is unique, return the first (and only) result
  },

  // Other functions as needed
};

module.exports = User;
