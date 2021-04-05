const Pool = require('pg').Pool
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl:{ rejectUnauthorized: false }
});

// ** Accounts & Authentication ** //

const createUser = (req, res) => {
  console.log('inside createUser')
  let { first_name, last_name, email, password } = req.body;

  let errors = [];

  console.log({
    first_name,
    last_name,
    email,
    password
  });

  pool.query(`INSERT INTO users 
              (first_name, last_name, email, password, role_id, date_created, last_login) 
              VALUES ($1, $2, $3, $4, 1, current_timestamp, current_timestamp)
              RETURNING user_id, first_name, password, role_id`, 
              [first_name, last_name, email, password], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    res.status(201).json(results.rows)
    //res.status(201).json({message: `successfully registered ${results.rows}`})
    
  })
}

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
    pool.query(`SELECT users.user_id, users.first_name, users.last_name, users.email, users.password, 
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
    getAllUsers, 
    createUser
  }


