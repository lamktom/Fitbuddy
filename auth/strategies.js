'use strict'; 

const { Strategy: LocalStrategy } = require('passport-local'); 
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models'); 
const { JWT_SECRET } = require('../config'); 

const localStrategy = new LocalStrategy((username, password, callback) => {
  
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) { 
        // Return a rejected promise so we break out of the chain of .thens.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        }); 
      }
      return user.validatePassword(password);
    })
    // password invalid
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      // password is valid, return user
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});

// define new strategy and pass in same secret key used to sign the tokens
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };