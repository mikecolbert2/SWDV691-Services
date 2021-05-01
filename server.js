// Set up
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");

const db = require("./db");
// const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(methodOverride());

// CORS configuration
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
// "http://localhost:4200"

// const allowedOrigins = ["*"];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: "DELETE, GET, POST, PUT",
//     credentials: true,
//   })
// );

//CORS configuration
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, DELETE, POST, PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// app.use(cookieParser(process.env.COOKIE_SECRET));

// root route
app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API server" });
});

// ** Users ** //
// login
app.post("/api/login", db.login);

// create new user
app.post("/api/user", db.createUser);

// delete existing user
app.delete("/api/user/:id", db.deleteUser);

// get one user
app.get("/api/user/:id", db.getUser);

// update user
app.put("/api/user/:id", db.updateUser);
//app.put("/api/user", db.updateUser);

// ** ADMIN ** //
// get all users
app.get("/api/admin/users", db.getAllUsers);

// ** TEST **
// Get all
// app.get("/api/items", db.getAllItems);

// ** TASKS ** //

// get all tasks
app.get("/api/tasks", db.getAllTasks);

// get all tasks belonging to a user
app.get("/api/user/tasks/:id", db.getTasksForUser);

// create new task
app.post("/api/user/task", db.createTask);

// delete existing task
app.delete("/api/user/task/:id", db.deleteTask);

// create & start new timer
app.post("/api/user/timer", db.startTimer);

// stop and update existing timer
app.put("/api/user/timer/:id", db.stopTimer);

// get task logs for user
app.get("/api/user/tasks-log/:id", db.getTaskLogsByUser);

// delete a single task log entry
app.delete("/api/user/tasks-log/:id", db.deleteTaskLogEntry);

// Start app and listen on port 8080
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
