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

// Function to handle rendering errors
const handleRenderError = (res, error) => {
  res.status(500).send({ message: error.message || "Error Occurred" });
};

// Homepage - Get categories and latest recipes
exports.homepage = async (req, res) => {
  try {
    let userId = req.session.userId;
    let userName = req.session.username;
    const limitNumber = 5;

    const categories = await executeQuery('SELECT * FROM categories LIMIT ?', [limitNumber]);
    const latest = await executeQuery('SELECT * FROM recipes ORDER BY id DESC LIMIT ?', [limitNumber]);

    // Fetch recipes for each category
    const categoriesQuery = ['Thai', 'Chinese', 'Mexican', 'Indian', 'Italian', 'American'];
    const food = {};
    for (const category of categoriesQuery) {
      const recipes = await executeQuery('SELECT * FROM recipes WHERE category = ? LIMIT ?', [category, limitNumber]);
      food[category.toLowerCase()] = recipes;
    }

    res.render('index', { title: 'Cooking Blog - Home', categories, food, userId, userName });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Explore categories
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await executeQuery('SELECT * FROM categories LIMIT ?', [limitNumber]);
    res.render('categories', { title: 'Cooking Blog - Categories', categories });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Explore recipes by category ID
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoriesId = await executeQuery('SELECT * FROM recipes WHERE category = ? LIMIT ?', [categoryId, limitNumber]);
    res.render('categories', { title: 'Cooking Blog - Category', categoriesId });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Explore recipes by ID
exports.exploreRecipes = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await executeQuery('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    res.render('recipe', { title: 'Cooking Blog - Recipe', recipe });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Search recipes
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const recipe = await executeQuery('SELECT * FROM recipes WHERE MATCH (name, description) AGAINST (? IN BOOLEAN MODE)', [searchTerm]);
    res.render('search', { title: 'Cooking Blog - Search', recipe });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Explore latest recipes
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipes = await executeQuery('SELECT * FROM recipes ORDER BY id DESC LIMIT ?', [limitNumber]);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipes });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Explore random recipes
exports.exploreRandom = async (req, res) => {
  try {
    const [count] = await executeQuery('SELECT COUNT(*) AS count FROM recipes');
    const random = Math.floor(Math.random() * count.count);
    const [recipe] = await executeQuery('SELECT * FROM recipes LIMIT ?, 1', [random]);
    res.render('explore-random', { title: 'Cooking Blog - Explore Random', recipe });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Submit recipe page
exports.submitRecipe = async (req, res) => {
  try {
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe' });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Submit recipe post
exports.submitRecipePost = async (req, res) => {
  try {
    // Handle file upload and recipe submission
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Signup post
exports.signupPost = async (req, res) => {
  try {
    // Handle user registration
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Signup page
exports.signUp = async (req, res) => {
  try {
    res.render('signup', { title: 'Cooking Blog - Sign Up' });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Signin page
exports.signIn = async (req, res) => {
  try {
    res.render('signin', { title: 'Cooking Blog - Sign In' });
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Signin post
exports.signinPost = async (req, res) => {
  try {
    // Handle user authentication
  } catch (error) {
    handleRenderError(res, error);
  }
};

// View all recipes
exports.allRecipes = async (req, res) => {
  try {
    // Fetch all recipes
  } catch (error) {
    handleRenderError(res, error);
  }
};

// User profile
exports.userProfile = async (req, res) => {
  try {
    // Fetch user profile information
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Update user profile
exports.Profile = async (req, res) => {
  try {
    // Update user profile
  } catch (error) {
    handleRenderError(res, error);
  }
};

// View recipe by ID
exports.viewRecipe = async (req, res) => {
  try {
    // Fetch recipe by ID
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Edit recipes
exports.editRecipes = async (req, res) => {
  try {
    // Edit recipes
  } catch (error) {
    handleRenderError(res, error);
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    // Delete recipe
  } catch (error) {
    handleRenderError(res, error);
  }
};
