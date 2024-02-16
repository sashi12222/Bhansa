const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const initDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        hash_password VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        email VARCHAR(255),
        ingredients TEXT,
        category VARCHAR(255),
        image VARCHAR(255)
      )`
    );
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255)
      )`
    );

    


    await connection.query(`
      INSERT INTO categories (name, image) VALUES
        ('Thai', 'pad_thai_1.jpeg'),
        ('Italian', 'pizza_1.jpeg'),
        ('Indian', 'mutton_kurma_1.jpeg'),
        ('Mexican', 'mexican_shwarma_1.jpeg'),
        ('Thai', 'mango sticky rice_2.jpeg')
    `);

    // Insert Dummy Data for Recipes
    await connection.query(`
      INSERT INTO recipes (name, description, email, ingredients, category, image) VALUES
        ('Chilly Chicken', 'Chilli chicken is a popular Indo-chinese appetizer made by tossing fried chicken in spicy hot chilli sauce.', 'n.anchusree@gmail.com', 'Chicken, Ginger, Garlic, Lemon juice, Onion, Capsicum, Salt', 'Chineese', 'chilly_ckn_1.jpeg'),
        ('Mango Sticky Rice', 'Mango sticky rice is a traditional Southeast Asian and South Asian dessert made with glutinous rice, fresh mango and coconut milk, and eaten with a spoon or the hands.', 'aleena@gmail.com', 'Glutinous (sweet) rice, Coconut milk, Sugar, Sesame Seeds, Mango, Salt', 'Mexican', 'mango sticky rice_2.jpeg'),
        ('Mexican Shawarma', 'Shawarma is marinated with various seasonings and spices such as cumin, turmeric, and paprika. It is made by stacking thinly sliced meat, typically lamb, beef, or chicken, on a large rotating skewer or cone. It is also sometimes cooked with extra fat from the meat to give it a juicer taste.', 'anchu@gmail.com', 'Chicken, Shawarma bread, Cabbage, Carrots, Cucumber, Onion, Capsicum, Salt', 'Mexican', 'mexican_shwarma_3.jpeg'),
        ('Pizza', 'Pizza is a dish of Italian origin consisting of a usually round, flat base of leavened wheat-based dough topped with various ingredients', 'shreya@gmail.com', 'Chicken, Cheese, Olive, Onion, Capsicum, Yeast, Salt, Sugar, Oregano', 'Italian', 'pizza_3.jpeg')
    `);

    

    console.log('Inserted dummy data successfully');
    console.log('Table creation script executed successfully');
    connection.end();
  } catch (error) {
    console.error('Error executing table creation script:', error);
  }
};

initDB();
