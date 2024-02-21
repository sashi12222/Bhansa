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
// Function to execute MySQL queries
const executeQuery = async (query, params = []) => {
  const connection = await pool.getConnection();
  try {
    console.log(`Executing query: ${query}`);
    console.log(`With parameters: ${params}`);
    const [rows, fields] = await connection.execute(query, params);
    console.log(`Query results: ${rows}`);
    return rows;
  } catch (error) {
    console.error(`Error executing query: ${error}`);
    throw error;
  } finally {
    connection.release();
  }
};

// Define Recipe model
const Recipe = {
  // Function to create a new recipe
  create: async (name, description, email, instructions, ingredients, category, image, userId) => {
    const query = 'INSERT INTO recipes (name, description, email, instructions, ingredients, category, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await executeQuery(query, [name, description, email, instructions, ingredients, category, image, userId]);
  },

  // Function to find a recipe by ID
  findById: async (id) => {
    const query = 'SELECT * FROM recipes WHERE id = ?';
    const recipe = await executeQuery(query, [id]);
    return recipe[0]; // Assuming ID is unique, return the first (and only) result
  },

  // Other functions as needed
};

module.exports = Recipe;
