const db = require('../connection');

//Get categories
const getCategories = () => {
  return db.query('SELECT * FROM categories;')
    .then(data => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.messsage)
    })
};




module.exports = { getCategories };
