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
		workoutName: this.workoutName,
		musclesWorked: this.musclesWorked,
		equipment: this.equipment, 
		video: this.video
	};
}; 

const Workout = mongoose.model("Workout", workoutSchema); 

module.exports = { Workout }; 
