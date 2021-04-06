const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const passport = require("passport");

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: { rejectUnauthorized: false },
});

// TODO: need to add validation for
// empty fields
// password too short
// password and password2 don't match
// email has already been registered

// ** Accounts & Authentication ** //

const createUser = (req, res) => {
  let { first_name, last_name, email, password, password2 } = req.body;
  let errors = [];

  console.log({ first_name, last_name, email, password, password2 });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashed_pwd) => {
      if (err) throw err;
      pool.query(
        `INSERT INTO users (first_name, last_name, email, password, role_id, date_created, last_login) VALUES ($1, $2, $3, $4, 1, current_timestamp, current_timestamp) RETURNING *`,
        [first_name, last_name, email, hashed_pwd],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);
          res.status(201).json(results.rows);
        }
      );
      //res.status(201).json(results.rows);
      //res.status(201).json({message: `successfully registered ${results.rows}`})
    });
  });
};

const getAllItems = (request, response) => {
  pool.query(`SELECT * FROM items ORDER BY item_name ASC`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// ** Admin ** //

const getAllUsers = (request, response) => {
  pool.query(
    `SELECT users.user_id, users.first_name, users.last_name, users.email, users.password, 
                roles.role_name, users.date_created, users.last_login 
                FROM users 
                INNER JOIN roles ON users.role_id = roles.role_id 
                CAST (users.user_id AS VARCHAR(100))
                ORDER BY users.last_name ASC, users.first_name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getAllItems,
  getAllUsers,
  createUser,
};
