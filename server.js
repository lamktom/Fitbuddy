"use strict"; 

const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// import PORT and DATABASE_URL from config.js
const { PORT, DATABASE_URL } = require("./config");
// import Workout from model.js
const { Workout } = require("./models");

const app = express();
app.use(express.json()); 

app.use(express.static('public'));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

// GET request to /workouts 
app.get("/workouts", (req, res) => {
  Workout.find()
    .then(workouts => {
      res.json({
        workouts: workouts.map(workout => workout.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      // respond with status 500 and show error message 
      res.status(500).json({ message: "Whoops, looks like something went wrong" }); 
    });
});

// GET request by ID 
app.get("/workouts/:id", (req, res) => {
  Workout.findById(req.params.id)
  .then(restaurant => res.json(restaurant.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Whoops, looks like something went wrong" });
  });
});

// POST request 
app.post("/workouts", (req, res) => {

}); 

// PUT request
app.put("/workouts/:id", (req, res) => {

});

// DELETE request 
app.delete("/workouts/:id", (req, res) =. {

});

// catch all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "404 Not Found" });
});
















// declare server 
let server; 

function runServer() {
	const port = process.env.PORT || 8080; 
	return new Promise((resolve, reject) => {
		server = app
		.listen(port, () => {
			console.log(`Your app is listening on port ${port}`); 
			resolve(server); 
		})
		.on('error', err => {
			reject(err); 
		});
	});
} // end runServer 

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
} // end closeServer

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

