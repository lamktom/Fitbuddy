// once page loads 
$(function() {
	getUserWorkouts(updateSessionStorageWithWorkouts); 
	getWorkoutsFromSessionStorage(renderWorkouts); 

	// event listeners

	// add workout 

	// delete workout 

	// update workout 

	// search workout from database 

	// Rendering functions
	$('#refresh-token-btn').on('click', function() {    
  	getAuthToken(addAuthToken);
  })

});