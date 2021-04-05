const Pool = require('pg').Pool
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl:{ rejectUnauthorized: false }
});

// ** Accounts & Authentication ** //


const getAllItems = (request, response) => {
    pool.query(`SELECT * FROM items ORDER BY item_name ASC`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }



  // ** Admin ** //

  const getAllUsers = (request, response) => {
    pool.query(`SELECT users.first_name, users.last_name, users.email, users.password, 
                roles.role_name, users.date_created, users.last_login 
                FROM users 
                INNER JOIN roles ON users.role_id = roles.role_id 
                ORDER BY users.last_name ASC, users.first_name ASC;`, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  module.exports = {
    getAllItems,
    getAllUsers
  }


