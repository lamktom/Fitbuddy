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
const jsonParser = bodyParser.json()

app.use(express.json()); 
app.use(express.static('public'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// GET request to /workouts 
app.get("/workouts", (req, res) => {
  Workout.find()
    .then(workouts => {
  console.log(workouts); // should log an array of posts    
  const results = workouts.map(workout => workout.serialize());
  console.log(results); // should log an array of "serialized" posts
  res.json(results);
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
  const requiredFields = ["workoutName", "musclesWorked", "equipment"]; 
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    console.log(req.body.workout);
    console.log(req.body.workoutName);
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`; 
      console.error(message); 
      return res.status(400).send(message); 
    }
  }
  Workout.create({ workout: {
    workoutName: req.body.workoutName,
    musclesWorked: req.body.musclesWorked,
    equipment: req.body.equipment,
    video: req.body.video
    }
  })
    .then(workout => res.status(201).json(workout.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Whoops, something went wrong" }); 
    });
}); 

// PUT request

app.put("/workouts/:id", jsonParser, (req, res) => {
  // ensure id in request path and the one in request body match 
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = 
      `Request path id (${req.params.id}) and request body id ` + 
      `(${req.body.id}) must match`;
      console.error(message);
      return res.status(400).json({ message: message }); 
  }
  const toUpdate = {};
  const updateableFields = ["workoutName", "musclesWorked", "equipment", "video"];
  updateableFields.forEach(field => {
    if (field in req.body.workout) {
      toUpdate[field] = req.body.workout[field];
    }
  });
  console.log(toUpdate);
  Workout
    .update({_id:req.params.id}, {$set: {"workout" : toUpdate}})
    .then(workout => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Whoops, something went wrong" }));
});

// DELETE request 
app.delete("/workouts/:id", (req, res) => {
  Workout.findByIdAndRemove(req.params.id)
    .then(workout => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Whoops, something went wrong" }));
});

// catch all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "404 Not Found" });
});

// declare server 
let server; 
//connects to database and starts server 
function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl, 
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve(); 
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err); 
          });
      }
    );
  });
} // end runServer 
// closes server and returns promise
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
} // end closeServer
// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err)); 
}
module.exports = { app, runServer, closeServer };