const { pool } = require('workerpool');
const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.msg)
    })
};

//create a new user
const createUser = () => {
  const query = `INSERT INTO users (first_name, last_name, email, password)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`;
  const values = [first_name, last_name, email, password];
  return pool
  .query(query, values)
  .then((res) => res.rows[0])
  .catch((err) => {
    console.log(err.message)
  });
};

module.exports = { getUsers, createUser };
