const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const env = require('dotenv');
const path = require('path');
const routes = require('./server/routes/recipeRoutes');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mysql = require('mysql2');
const port = process.env.PORT || 4001;
env.config();

// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');

  // Check if the database exists, if not create it
  db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    // Now that the database exists, establish connection to it
    connectToDatabase();
  });
});

// Function to establish connection to the database
function connectToDatabase() {
  const dbConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Attempt to connect to the database
  dbConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');

    // Create tables and insert dummy data
    createTablesAndInsertData(dbConnection);
  });
}

// Function to create tables and insert dummy data
function createTablesAndInsertData(dbConnection) {
  // Define your table creation queries
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS recipes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Execute table creation query
  dbConnection.query(createTableQuery, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      return;
    }
    console.log('Table created or already exists');

    // Insert dummy data
    const insertDummyDataQuery = `
      INSERT INTO recipes (title, description)
      VALUES
        ('Recipe 1', 'This is the first recipe.'),
        ('Recipe 2', 'This is the second recipe.'),
        ('Recipe 3', 'This is the third recipe.')
    `;

    // Execute dummy data insertion query
    dbConnection.query(insertDummyDataQuery, (err, result) => {
      if (err) {
        console.error('Error inserting dummy data:', err);
        return;
      }
      console.log('Dummy data inserted');

      // Set up Express server after creating tables and inserting data
      setUpServer();
    });
  });
}

// Function to set up Express server
function setUpServer() {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(expressLayouts);
  app.use(cookieParser('CookingBlogSecure'));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      resave: true,
    })
  );

  app.use(function (req, res, next) {
    res.locals.userId = req.session.userId;
    res.locals.userName = req.session.username;
    next();
  });

  app.use(flash());
  app.use(fileUpload());

  app.set('layout', './layouts/main');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use('/', routes);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Start by attempting to create the database
db.connect();
