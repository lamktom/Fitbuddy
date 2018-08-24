//mock data 
var MOCK_WORKOUT_DATA = {
	"workouts": [
		{
			"id": "1111",
			"workoutName": "Incline Hammer Curls",
			"musclesWorked": "Biceps",
			"equipment": "Dumbbell",
			"video": "https://www.bodybuilding.com/exercises/incline-hammer-curls"
		},
		{
			"id": "2222",
			"workoutName": "Wide-Grip Standing Barbell Curl",
			"musclesWorked": "Biceps",
			"equipment": "Barbell",
			"video": "https://www.bodybuilding.com/exercises/wide-grip-standing-barbell-curl"
		},
		{
			"id": "3333",
			"workoutName": "Close-Grip Barbell Bench Press",
			"musclesWorked": "Chest (pectoralis)",
			"equipment": "Barbell",
			"video": "https://www.bodybuilding.com/exercises/close-grip-barbell-bench-press"
		},
		{
			"id": "4444",
			"workoutName": "Seated Triceps Press",
			"musclesWorked": "Chest (pectoralis)",
			"equipment": "Dumbbell",
			"video": "https://www.bodybuilding.com/exercises/seated-triceps-press"
		}
	]
}; 

//func to have data appear after 100 milliseconds  
function getWorkouts(callbackFn) {
	setTimeout(function(){ callbackFn(MOCK_WORKOUT_DATA)}, 1);
}

function displayWorkoutData(data) {
	for (index in data.workouts) {
		$('body').append(
			'<br>' + 
			'<p>' + data.workouts[index].workoutName + '</p>',
			'<p>' + data.workouts[index].musclesWorked + '</p>',
			'<p>' + data.workouts[index].equipment + '</p>',
			'<p>' + data.workouts[index].video + '</p>'
			 + '<br>');
	}
}

function getAndDisplayWorkoutData() {
	getWorkouts(displayWorkoutData);
	console.log("displaying workout data");
}

//do this on page load 
$(function() {
	getAndDisplayWorkoutData(); 
})