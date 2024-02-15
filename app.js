const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');
const routes = require('./server/routes/recipeRoutes');
const fileUpload = require('express-fileupload');
const env = require('dotenv');
const { executeQuery, handleRenderError } = require('./db'); // Import executeQuery function and handleRenderError

const app = express();
const port = process.env.PORT || 4001;

env.config();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}));

app.use(function(req, res, next) {
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
