const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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

router.post('/signin', async (req, res) => {
    let infoSubmitObj = '';
    let infoErrorsObj = [];

    try {
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            infoErrorsObj.push({ message: 'Please fill in all fields' });
            return res.render('signin', { title: 'Sign In', infoSubmitObj, infoErrorsObj });
        }

        // Check if user exists
        const user = await User.findByEmail(email);

        if (!user) {
            infoErrorsObj.push({ message: 'User does not exist' });
            return res.render('signin', { title: 'Sign In', infoSubmitObj, infoErrorsObj });
        }

        // Check password
        const isMatch = await User.comparePassword(password, user.hash_password);

        if (!isMatch) {
            infoErrorsObj.push({ message: 'Incorrect password' });
            return res.render('signin', { title: 'Sign In', infoSubmitObj, infoErrorsObj });
        }

        // Sign in the user...
        // For example, you might create a session or generate a JWT, depending on your setup

        infoSubmitObj = 'Sign in successful';
        res.redirect('/'); // Redirect to home page or wherever you want
    } catch (error) {
        infoErrorsObj.push({ message: error.message });
        res.render('signin', { title: 'Sign In', infoSubmitObj, infoErrorsObj });
    }
});

module.exports = { router, User };