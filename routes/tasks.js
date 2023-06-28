const express = require('express');
const router = express.Router();
const { addTask } = require('../db/queries/tasks');

router.get('/', (req, res) => {
  res.render('tasks');
});

router.get('/add', (req,res) => {
  res.render('add-task');
});

router.post('/', (req, res) => {
  const taskData = req.body;
  taskData.user_id = 1;
  const date = new Date().toJSON();
  taskData.date_created = date;
  console.log(taskData);
  addTask(taskData)
  .then((result) => {
    console.log(result);
  })
  .catch(err => console.log(err));

  //function to get all Tasks for user , .then ((result) => res.redirect('/', {result}), add .err after

})


module.exports = router;
