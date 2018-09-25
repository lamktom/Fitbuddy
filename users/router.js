'use strict'; 
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const { User } = require('./models'); 

const router = express.Router(); 

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });

// get workouts 
// protected endpoint needs valid JWT to access
router.get('/workouts', jwtAuth, (req, res) => {
	const username = req.user.username;

	// return user's workouts 
	return User.findOne({ username }, 'workouts', function(err, workouts) {
		if (err) console.error(err);
		return res.json(workouts); 
	})
});

// get one workout
router.get('/workouts/:id', jwtAuth, (req, res) => {
	const id = req.params.id; 
	const username = req.user.username;

	const workout = User.findOne( { username }, {"workouts": { $elemMatch: { id }}} )
    .then( function(data) {
        res.json(data.workouts[0]);
    })
});