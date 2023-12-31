// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

const cookieSession = require("cookie-session");

const PORT = process.env.PORT || 8080;
const app = express();
const router = express.Router()

app.set('view engine', 'ejs');
// Configure cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["secret-key"], // Replace "secret-key" with your own secret key or use an array of multiple keys for encryption
    maxAge: 24 * 60 * 60 * 1000, // Set the session expiration time (e.g., 24 hours)
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const usersRoutes = require('./routes/users');
const loginRoutes =require('./routes/login')
const taskRoutes = require('./routes/tasks');

//example user



// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/tasks', taskRoutes);

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.render('index');
});

// app.get('/users', (req, res) => {
//   res.render('users');
// });

// app.post('/users', (req, res)=> {
//  res.render('users');
// })

 app.get('/register', (req, res) => {
   res.render('user-register')
 })

// app.get('/edit', (req, res) => {
//   res.render('edit')
// })

// app.get('/add', (req, res) => {
//   res.render('add-task')
// })

// app.get('/tasks', (req,res) => {
//  res.render('tasks')
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
