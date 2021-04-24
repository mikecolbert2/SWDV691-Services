const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");
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
  if (user) {
    console.log("successful login");
    // res.cookie("user_id", user.user_id, {
    //   httpOnly: true,
    //   secure: true, //https only, uncomment when in production
    //   signed: true,
    // });
    res.json({
      current_user: user,
      message: "logged in",
    });
  }
};

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
  let { user_id, first_name, last_name, email } = req.body;
  console.log(user_id);

  pool.query(
    `UPDATE users SET first_name = $1, last_name = $2, email = $3 WHERE user_id = $4::uuid RETURNING *`,
    [first_name, last_name, email, user_id],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows[0]);
      console.log("***********");

      return res.status(201).json(results.rows[0]);
    }
  );
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

// return a list of all tasks
const getAllTasks = (req, res) => {
  console.log("inside get all tasks");
  pool.query(
    `SELECT tasks.task_id, tasks.task_name, tasks.user_id, tasks.date_created
                FROM tasks;`,
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
  let errors = [];
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

// return your tasks
const getTasksForUser = (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  pool.query(
    `SELECT tasks.task_id, tasks.task_name, tasks.user_id, tasks.date_created
    FROM tasks WHERE tasks.user_id = $1::uuid;`,
    [user_id],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results.rows);
      res.status(200).json(results.rows);
    }
  );
};

// create a new task
const createTask = (req, res) => {
  let { task_name, user_id } = req.body;
  let errors = [];

  console.log({ task_name, user_id });
  pool.query(
    `INSERT INTO tasks (task_name, user_id, date_created) VALUES ($1, $2::uuid, current_timestamp) RETURNING *`,
    [task_name, user_id],
    (err, results) => {
      if (err) {
        throw err;
      }
      console.log(results.rows);
      res.status(201).json(results.rows[0]);
    }
  );
};

// delete a task
const deleteTask = (req, res) => {
  console.log("inside delete task");
  const task_id = req.params.id;
  let errors = [];
  console.log("deleting task: " + task_id);

  pool.query(
    `DELETE FROM tasks WHERE tasks.task_id = $1::uuid`,
    [task_id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(201).json({ message: `successfully deleted task` });
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
  createTask,
  getAllTasks,
  getTasksForUser,
  deleteTask,
};
