const { pool } = require('workerpool');
const db = require('../connection');

// const addTask = (tasks) => {
//   const newTask =[
//     tasks.id,
//     tasks.category_id,
//     tasks.user_id,
//     tasks.task_name,
//     tasks.date_created,
//     tasks.date_completed
//   ];

//   return db
//   .query(`INSERT INTO tasks(id, category_id, user_id, task_name, date_created, date_completed)
//   VALUES($1, $2, $3, $4, $5, $6)
//   RETURNING *;`, newTask)
//     .then(data => {
//       console.log(data);
//       return data.rows;
//   })
//   .catch((err)=> {
//     console.log(err.message)
//   });
// };

const addTask = (tasks) => {
  const newTask =[
    tasks.user_id,
    tasks.task_name,
    tasks.task_description,
    tasks.date_created,
    tasks.date_completed
  ];

  return db
  .query(`INSERT INTO tasks(user_id, task_name, task_description, date_created, date_completed)
  VALUES($1, $2, $3, $4, $5)
  RETURNING *;`, newTask)
    .then(data => {
      console.log(data.rows);
      return data.rows;
  })
  .catch((err)=> {
    console.log(err.message)
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



module.exports = {addTask, createTask}
