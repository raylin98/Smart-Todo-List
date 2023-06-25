/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { use } = require("bcrypt/promises");

function getUserByEmail(email) {
  return Object.values(users).find(user => user.email === email);
}

router.get('/', (req, res) => {
  res.render('users');
});

//default page is '/'
// if any button is pressed like tasks, user would be redirected to login page = '/login'
// user would be redirected to login page if any of the icons were to be pressed without being logged in. default to login page
// user can register on top right corner
// our demo will have user already having preloaded tasks with the ability to edit, add and delete tasks

// ** POST ROUTE FOR LOGIN = redirect to '/' with user information and tasks
// after login, user tasks information will be displayed
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is empty
  if (!email || !password) {
    res.status(400).send("Email and password fields cannot be empty");
    return;
  }

  // Check if email is already registered
  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    res.status(400).send("User doesn't exist");
    return;
  }

  // Use bcrypt to compare the submitted password with the hashed password
  const passwordMatch = bcrypt.compareSync(password, existingUser.password);

  if (!passwordMatch) {
    res.status(400).send("Invalid credentials");
    return;
  }

  // Set the 'user_id' in the session
  req.session.user_id = existingUser.id;

  const getUserTaskInformation = () => {
    const query = 'SELECT * FROM tasks WHERE user_id = $1;';
    const values = [req.session.user_id];

    return db.query(query, values)
      .then(data => {
        return data.rows;
      })
      .catch((err) => {
        console.log(err.message);
        throw err;
      });
  };

  getUserTaskInformation()
    .then(tasks => {
      res.redirect('/', { user: existingUser, tasks });
    })
    .catch(err => {
      res.render('error');
    });
});




// POST ROUTE STRETCH FOR REGISTER = redirect to '/' with logged in information
// after registration, users will be logged in and shown the main page with their username so e.g. '/username'

// POST ROUTE FOR LOGOUT = redirect users to '/' with cookies cleared
// Cookies cleared, user logged out, redirected to main page = '/'
router.post('/logout', (req, res) => {
  // Clear the user session or any relevant authentication-related cookies
  res.clearCookie('sessionID');

  // Redirect the user to the main page
  res.redirect('/');
});

// STRECH: POST ROUTE FOR EDITING USER PROFILE
// User will be able to go to = '/'

// ** POST ROUTE FOR ADDING TASKS TODO LIST
// posting x tasks auto categorizes to specific task id


// ** GET ROUTES GET TASK INFORMATION ON '/userid'
// after logging in, user will be able to view their tasks based on their associated id
router.get('/tasks', (req, res) => {
  const getUserId = () => {
    const query = 'SELECT * FROM tasks WHERE user_id = $1;';
    const values = [req.session.user_id];

    return db.query(query, values)
      .then(data => {
        return data.rows;
      })
      .catch((err) => {
        console.log(err.message);
        throw err;
      });
  };
  getUserId()
    .then(tasks => {
      res.json({ tasks });
    })
    .catch(err => {
      res.status(500).json({ error: 'An error occurred while retrieving tasks' });
    });
});


// STRETCH GET ROUTES FOR VIEWING USER PROFILE
// if user presses on a profile tab, they should see their information and an edit function beside



module.exports = router;
