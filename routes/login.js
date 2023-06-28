const express = require('express');
const router = express.Router();
const db = require('../db/connection')

router.get('/', (req, res) => {
  req.session.user_id = 1;
  res.redirect('/tasks')
});
//default post login , user_id set to 1
router.post('/', (req, res) => {
  req.session.user_id = 1;
  res.redirect('/tasks');
})

/* router.post('/', (req, res) => {
  const { email, password } = req.body;
  // Check if the email and password match in the database
  db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An internal server error occurred.' });
      return;
    }

    // If there is no matching user, return an error
    if (results.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials. Please try again.' });
      return;
    }

    // Assuming the user is authenticated, retrieve their task information
    const userId = results.rows[0].id;

    db.query('SELECT * FROM tasks WHERE user_id = $1', [userId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
        return;
      }

      // Send the task information along with a success message
      res.status(200).json({
        message: 'Login successful.',
        tasks: results.rows,
      });
    });
  });
  res.redirect('/tasks');
  console.log('success');
}); */


module.exports = router;
