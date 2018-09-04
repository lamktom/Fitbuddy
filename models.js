//done
"use strict"; 

const mongoose = require("mongoose"); 

const workoutSchema = mongoose.Schema({
	workout: {
		workoutName: { type: String, required: true }, 
		musclesWorked: { type: String, required: true },
		equipment: { type: String, required: true },
		video: { type: String }
	}	
}); // end workoutSchema  

workoutSchema.methods.serialize = function() {
	return {
		id: this._id,
		workout: this.workout
	};
}; 

const Workout = mongoose.model("Workout", workoutSchema); 

module.exports = { Workout }; 