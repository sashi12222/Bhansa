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
// Create the recipes table
await connection.query(`
    CREATE TABLE IF NOT EXISTS recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        description TEXT
    )
`);

// Insert dummy data into the recipes table


// Insert dummy data into the recipe_details table
await connection.query(`
    INSERT INTO recipe (recipe_id, preparation_time, cooking_time, servings)
    VALUES (1, '30 minutes', '1 hour', 4),
           (2, '15 minutes', '45 minutes', 2)
`);


    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255)
      )`
    );
    // Create the category table if it doesn't exist
// Create the category table if it doesn't exist
await connection.query(`
  CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL
  )`
);

// Insert dummy data into the category table
await connection.query(`
  INSERT INTO category (description) VALUES
    ('Description for Category 1'),
    ('Description for Category 2'),
    ('Description for Category 3')
`);

// Insert dummy data into the category table

// await connection.query(`
//     CREATE TABLE IF NOT EXISTS category (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         image VARCHAR(255)
//     )`
// );

    


    await connection.query(`
      INSERT INTO categories (name, image) VALUES
        ('Thai', 'pad_thai_1.jpeg'),
        ('Italian', 'pizza_1.jpeg'),
        ('Indian', 'mutton_kurma_1.jpeg'),
        ('Mexican', 'mexican_shwarma_1.jpeg'),
        ('Thai', 'mango sticky rice_2.jpeg'),
        ('Nepali', 'mango sticky rice_2.jpeg')

    `);

// await connection.query(`
//     INSERT INTO category (name, image) VALUES
//     ('French', 'croissant_1.jpeg'),
//     ('Chinese', 'dimsum_1.jpeg'),
//     ('Japanese', 'sushi_1.jpeg'),
//     ('Greek', 'gyro_1.jpeg'),
//     ('American', 'burger_1.jpeg')
// `);

    // Insert Dummy Data for Recipes
    await connection.query(`
      INSERT INTO recipes (name, description, email, ingredients, category, image) VALUES
        ('Chilly Chicken', 'Chilli chicken is a popular Indo-chinese appetizer made by tossing fried chicken in spicy hot chilli sauce.', 'n.anchusree@gmail.com', 'Chicken, Ginger, Garlic, Lemon juice, Onion, Capsicum, Salt', 'Chineese', 'chilly_ckn_1.jpeg'),
        ('Mango Sticky Rice', 'Mango sticky rice is a traditional Southeast Asian and South Asian dessert made with glutinous rice, fresh mango and coconut milk, and eaten with a spoon or the hands.', 'aleena@gmail.com', 'Glutinous (sweet) rice, Coconut milk, Sugar, Sesame Seeds, Mango, Salt', 'Mexican', 'mango sticky rice_2.jpeg'),
        ('Mexican Shawarma', 'Shawarma is marinated with various seasonings and spices such as cumin, turmeric, and paprika. It is made by stacking thinly sliced meat, typically lamb, beef, or chicken, on a large rotating skewer or cone. It is also sometimes cooked with extra fat from the meat to give it a juicer taste.', 'anchu@gmail.com', 'Chicken, Shawarma bread, Cabbage, Carrots, Cucumber, Onion, Capsicum, Salt', 'Mexican', 'mexican_shwarma_3.jpeg'),
        ('Pizza', 'Pizza is a dish of Italian origin consisting of a usually round, flat base of leavened wheat-based dough topped with various ingredients', 'shreya@gmail.com', 'Chicken, Cheese, Olive, Onion, Capsicum, Yeast, Salt, Sugar, Oregano', 'Italian', 'pizza_3.jpeg')
    `);
    await connection.query(`
    INSERT INTO recipes (name, description, email, ingredients, category, image) VALUES
        ('Chilly Chicken', 'Chilli chicken is a popular Indo-chinese appetizer made by tossing fried chicken in spicy hot chilli sauce.', 'n.anchusree@gmail.com', 'Chicken, Ginger, Garlic, Lemon juice, Onion, Capsicum, Salt', 'Chinese', 'chilly_ckn_1.jpeg'),
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
