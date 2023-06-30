const { pool } = require('workerpool');
const db = require('../connection');

const getTasks = () => {
  return db
  .query(`SELECT tasks.*, categories.category_name FROM tasks JOIN categories ON tasks.category_id = categories.id WHERE user_id =1;`)
  .then(data => {
    console.log(data.rows);
    return data.rows;
  })
  .catch((err) => {
    console.log(err.message);
  })
};

const addTask = (tasks) => {
  const newTask = [
    tasks.category_id,
    tasks.user_id,
    tasks.task_name,
    tasks.task_description,
    tasks.date_created,
    tasks.date_completed
  ];

  return db
    .query(`INSERT INTO tasks(category_id, user_id, task_name, task_description, date_created, date_completed)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;`, newTask)
    .then(data => {
      console.log(data.rows[0]);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createTask = function(tasks) {
  return $(`
  <div class="taskbox">
  <div class="box-1"> Categories
    <span>"${tasks.category_id}"</span>
  </div>

  <div class="box-2"> Descriptions
    <span>"${tasks.task_name}"</span>
  </div>

  <div class="box-3"> Icons
    <span> ${tasks.category_id}</span>
  </div>`);
};

const updateTask = function(body, id) {
  return db
    .query(`UPDATE tasks SET category = $1 WHERE id = $2 RETURNING *;`, [body.category, id])
    .then(data => {
      console.log(data.rows[0]);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};


module.exports = { addTask, createTask, getTasks, updateTask };
