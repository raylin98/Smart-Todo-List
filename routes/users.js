/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

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

// POST ROUTE STRETCH FOR REGISTER = redirect to '/' with logged in information
    // after registration, users will be logged in and shown the main page with their username so e.g. '/username'

// POST ROUTE FOR LOGOUT = redirect users to '/' with cookies cleared
    // Cookies cleared, user logged out, redirected to main page = '/'

// STRECH: POST ROUTE FOR EDITING USER PROFILE
    // User will be able to go to = '/'

// ** POST ROUTE FOR ADDING TASKS TODO LIST
    // posting x tasks auto categorizes to specific task id

// ** GET ROUTES GET TASK INFORMATION ON '/userid'
   // after logging in, user will be able to view their tasks based on their associated id

// STRETCH GET ROUTES FOR VIEWING USER PROFILE
  // if user presses on a profile tab, they should see their information and an edit function beside



module.exports = router;
