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

// add workout to user page 
router.post('/workouts', jwtAuth, jsonParser, (req, res) => {
	const username = req.user.username; 
	const newBook = req.body; 
	const id = req.body.id; 

	//create and return user workouts 
	return User.update( {username}, {$push: {'workouts': newWorkout }} )
		.then(function() {
			return res.json(newWorkout);
		})
		.catch( err => {
			return res.status(500).json({message: `Internal server error`})
		});
}); 
 
// delete a workout
router.delete('/workouts/:id', jwtAuth, (req, res) => {
    const id = req.params.id;
    const username = req.user.username;
    
    // delete workout from db
    return User.update( {username}, {$pull: { 'workouts': { id: id } } } )
     .then( function(data) {
        if(data.nModified > 0) {
           return res.sendStatus(204);
        }
        else {
            return res.sendStatus(404);
        }
     })
     .catch( err => {
       return res.status(500).json({message: `Internal server error`});
     });

});

// Update user workout
// A protected endpoint which needs a valid JWT to access it
router.put('/workouts/:id/:rating', jwtAuth, jsonParser, (req, res) => {
    const id = req.params.id;
    const new_rating = req.params.rating;
    const username = req.user.username;
    
    let user_id;

    User.find( { username } )
    .then( function(data) {
        user_id = data[0]._id
        
        let query = { _id: user_id, workouts: { $elemMatch: { id } } };
        let update = { "workouts.$.rating_user": new_rating}

        return User.update( query, {$set: update })
         .then( function(data) {
            res.json(data);
        }) 
         .catch( err => {
           return res.status(500).json({message: `Internal server error`});
         });
    })
});

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 2
    },
    password: {
      min: 6,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
























