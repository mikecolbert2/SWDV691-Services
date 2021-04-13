const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
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
//user login
const login = async (req, res) => {
  const email = req.body.email;
  user = [];
  user = await new Promise((resolve, reject) => {
    pool.query(
      `SELECT users.user_id, users.first_name, users.last_name, users.email, users.password,
      roles.role_name, users.date_created, users.last_login
      FROM users
      INNER JOIN roles ON users.role_id = roles.role_id
      WHERE users.email = $1 `,
      [email],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        //res.send(results.row[0]);
        return resolve(results.rows[0]);
      }
    );
  });

  if (!user) {
    return res.status(400).send("User not found.");
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Password is incorrect.");
  }
  // need to incorporate this with the token - or at least not with the (user)
  if (user) {
    const token = jwt.sign(
      { _id: user.user_id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400, //24 hours
      }
    );
    console.log("success");
    res.cookie("SESSIONID", token, { httpOnly: true, secure: true });
    res.status(200).json(user);
  }
};

// NEED A LOGOUT

// CONNECT TO ANGULAR

// delete a user
const deleteUser = (req, res) => {
  console.log("inside delete user");
  const user_id = req.params.id;
  let errors = [];
  console.log("deleting user: " + user_id);

  pool.query(
    `DELETE FROM users WHERE users.user_id = $1::uuid`,
    [user_id],
    (err, results) => {
      if (err) {
        throw err;
      }
      //console.log(results.rows);
      res.status(201).json({ message: `successfully deleted user` });
    }
  );
};

// create a new user
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
          //res.status(201).json(results.rows);
          res
            .status(201)
            .json({ message: `successfully registered ${results.rows}` });
        }
      );
    });
  });
};

// update a user
const updateUser = (req, res) => {
  const user_id = req.params.id;
  let { first_name, last_name, email, password, password2 } = req.body;
  console.log(user_id);
  console.log({ first_name, last_name, email, password, password2 });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashed_pwd) => {
      if (err) throw err;

      pool.query(
        `UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4 WHERE user_id = $5 RETURNING *`,
        [first_name, last_name, email, hashed_pwd, user_id],
        (err, results) => {
          if (err) {
            throw err;
          }
          console.log(results.rows);

          return res.status(201).json({ message: `successfully updated user` });
        }
      );
    });
  });
};

// ** Admin ** //

// return a list of all users
const getAllUsers = (req, res) => {
  pool.query(
    `SELECT users.user_id, users.first_name, users.last_name, users.email, users.password, 
                roles.role_name, users.date_created, users.last_login 
                FROM users 
                INNER JOIN roles ON users.role_id = roles.role_id
                ORDER BY users.last_name ASC, users.first_name ASC;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

// return one user
const getUser = (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  pool.query(
    `SELECT users.user_id, users.first_name, users.last_name, users.email, users.password, 
                roles.role_name, users.date_created, users.last_login 
                FROM users
                INNER JOIN roles ON users.role_id = roles.role_id
                WHERE users.user_id = $1::uuid`,
    [user_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  //  getAllItems,
  getAllUsers,
  createUser,
  deleteUser,
  getUser,
  updateUser,
  login,
};
