// Set up
var express = require('express');
var app = express();
//var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
const db = require('./queries')

// Configuration
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/MyHabitStacker");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

//CORS configuration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connect to Postgres
// pool
//   .connect()
//   .then(() => console.log("Postgres connected ..."))
//   .catch((err) => console.log(err));

//   pool.query("SELECT * FROM items", (err, res) => {
//     if (err) {
//       console.log("pg returned an error");
//       throw error;
//     }
//     if (res) {
//       console.log("pg returned a result from the SQL query");
//     }
//   });


// Models
// var Item = mongoose.model('Item', {
//     item_id: Number,
//     item_name: String,
//     item_age: Number
// });

// var Log = mongoose.model('DailyLog', {
//     habit_name: String,
//     last_completed_date: Date
// });

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API server' })
  })


// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname + '/index.html'));
//   });


// ** HABITS ** //
// Get all 
app.get('/api/items', db.getAllItems)

// app.get('/api/items', function (req, res) {

    // items = [];
    
    // items = [
    //     {
    //         name: 'test',
    //         age: 50
    //     }, 
    //     {
    //         name: 'test2',
    //         age: 48
    //     } 
    // ];
    

    // pool.query('SELECT * FROM items', (err, result) => {
    //     if (err) {
    //       return console.error('Error executing query', err.stack)
    //     }
    //     items=result.rows;
    //     console.log(result.rows)
    //   })

    // console.log("get request ...");
    // res.json(items)

    // pg.connect(connectionString, function(err, client, done) {
    //     client.query('SELECT * FROM your_table', function(err, result) {
    //        done();
    //        if(err) return console.error(err);
    //        console.log(result.rows);
    //     });
    //  });


    // //use mongoose to get data from the database
    // Habit.find(function (err, habits) {
    //     // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    //     if (err) {
    //         res.send(err);
    //     }

    //     res.json(habits); // return all habits in JSON format
    // });
// });

// // Get one habit
// app.get('/api/habits/:id', function (req, res) {

//     console.log("List one specific habit ...");
    
//     //use mongoose to get a single habit from the database
//     Habit.find({ _id: req.params.id }, function (err, habits) {

//         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//         if (err) {
//             res.send(err);
//         }

//         res.json(habits); // return the habit in JSON format
//     });
// });

// // Create a new habit
// app.post('/api/habits', function (req, res) {

//     console.log("Creating a new habit ...");

//     Habit.create({
//         habit_name: req.body.name,
//         start_date: req.body.date,
//         done: false
//     }, function (err, habit) {
//         if (err) {
//             res.send(err);
//         }

//         // create and return all the habits
//         Habit.find(function (err, habits) {
//             if (err)
//                 res.send(err);
//             res.json(habits);
//         });
//     });

// });

// // Update a habit 
// app.put('/api/habits/:id', function (req, res) {
//     const habit = {
//         habit_name: req.body.name
//     };
//     console.log("Updating the habit ... ", req.params.id);
//     Habit.update({_id: req.params.id}, habit, function (err, raw) {
//         if (err) {
//             res.send(err);
//         }
//         res.send(raw);
//     });
// });

// // Delete a habit
// app.delete('/api/habits/:id', function (req, res) {
//     console.log("Deleting a habit ... ", req.params.id);
//     Habit.findOneAndRemove({   //updated from .remove - https://stackoverflow.com/questions/50283081/mongodb-error-cannot-use-retryable-writes-with-limit-0
//         _id: req.params.id
//     }, function (err, habit) {
//         if (err) {
//             console.error("Error deleting the habit ", err);
//         }
//         else {
//             Habit.find(function (err, habits) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 else {
//                     res.json(habits);
//                 }
//             });
//         }
//     });
// });


// // ** DAILY LOG ** //
// // Get all daily log entires 
// app.get('/api/logs', function (req, res) {

//     console.log("Listing daily log entries ...");

//     //use mongoose to get data from the database
//     Log.find(function (err, logs) {
//         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//         if (err) {
//             res.send(err);
//         }

//         res.json(logs); // return all daily entries in JSON format
//     });
// });

// // Get last daily entry record
// app.get('/api/logs/latest-entry', function (req, res) {

//     console.log("List latest daily log entry ...");
    
//     //use mongoose to get a single log entry from the database
//     Log.findOne( {}, {}, {sort: { 'last_completed_date' : -1 } }, function (err, logs) {

//         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//         if (err) {
//             res.send(err);
//         }

//         res.json(logs); // return the habit in JSON format
//     });
// });

// // Create a new daily log entry
// app.post('/api/logs', function (req, res) {

//     console.log("Creating a new daily log entry ...");
//     console.log(req.body.habit_name)
//     console.log(req.body.last_completed_date)

//     Log.create({
//         habit_name: req.body.habit_name,
//         last_completed_date: req.body.last_completed_date,
//         done: false
//     }, function (err, log) {
//         if (err) {
//             res.send(err);
//         }

//         // create and return all the log entries
//         Log.find(function (err, logs) {
//             if (err)
//                 res.send(err);
//             res.json(logs);
//         });
//     });

// });

// // Update a daily log entry 
// app.put('/api/logs/:id', function (req, res) {
//     const log = {
//         habit_name: req.body.name,
//         last_completed_date: req.body.date
//     };
//     console.log("Updating the daily log entry ... ", req.params.id);
//     Log.update({_id: req.params.id}, log, function (err, raw) {
//         if (err) {
//             res.send(err);
//         }
//         res.send(raw);
//     });
// });

// // Delete a daily log entry
// app.delete('/api/logs/:id', function (req, res) {
//     console.log("Deleting a daily log entry ... ", req.params.id);
//     Log.findOneAndRemove({   //updated from .remove - https://stackoverflow.com/questions/50283081/mongodb-error-cannot-use-retryable-writes-with-limit-0
//         _id: req.params.id
//     }, function (err, log) {
//         if (err) {
//             console.error("Error deleting the log entry ", err);
//         }
//         else {
//             Log.find(function (err, logs) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 else {
//                     res.json(logs);
//                 }
//             });
//         }
//     });
// });


// Start app and listen on port 8080  
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));