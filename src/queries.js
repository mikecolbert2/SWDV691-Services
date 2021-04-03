const Pool = require('pg').Pool
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl:{ rejectUnauthorized: false }
});


const getAllItems = (request, response) => {
    pool.query('SELECT * FROM items ORDER BY item_name ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  module.exports = {
    getAllItems
  }


