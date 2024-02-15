const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const handleRenderError = (res, error) => {
  console.error('Rendering error:', error);
  res.status(500).send({ message: 'An unexpected error occurred' });
};

const executeQuery = async (query, params = []) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('USE ' + process.env.DB_NAME);
    const [rows] = await connection.execute(query, params);
    connection.release();
    return rows;
  } catch (error) {
    throw error;
  }
};

const User = {
  create: async (name, email, password, description) => {
    const hashPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, hash_password, description) VALUES (?, ?, ?, ?)';
    await executeQuery(query, [name, email, hashPassword, description]);
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const users = await executeQuery(query, [email]);
    return users[0];
  },

  comparePassword: async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
  },

  findById: async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const users = await executeQuery(query, [id]);
    return users[0];
  },
};

module.exports = User;
