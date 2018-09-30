'use strict'; 
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 

const config = require('../config');
const router = express.Router(); 

const createAuthToken = function(user) {
	return jwt.sign({user}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};

// session: false to stop Passport form adding session cookies 
const localAuth = passport.authenticate('local', {session: false}); 

router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({
	extended: true 
}));

//user provides username and password to to login 
//runs through localAuth middleware to handle auth
//if auth successful, creates and responds with a JWT
router.post('/login', localAuth, (req, res) => {
	console.log('authenticated user');
	const authToken = createAuthToken(req.user.serialize()); 

	res.json({authToken});
})

const jwtAuth = passport.authenticate('jwt', {session: false}); 

//user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
	console.log('authenticated user');
	const authToken = createAuthToken(req.user);
	res.json({authToken}); 
});

module.exports = {router};
