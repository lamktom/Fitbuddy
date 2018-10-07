'use strict'; 
const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose');
const {Workout} = require('../models');

mongoose.Promise = global.Promise; 

const workoutSchema = mongoose.Schema({
  workout: {
    workoutName: { type: String, required: true }, 
    musclesWorked: { type: String, required: true },
    equipment: { type: String, required: true },
    video: { type: String }
  } 
}); // end workoutSchema  

const UserSchema = mongoose.Schema({
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''},
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  workout: [workoutSchema]
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
    console.log(this.password);
    console.log(password);
  // use bcrypt to compare plain text value passed to function(password) 
  // with hashed value stored on the user object (this.password)
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10); //10 rounds of salted algorithm used
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};