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

module.exports = router;
