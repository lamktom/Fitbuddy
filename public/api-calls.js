// GET request for user's workouts 
function getUserWorkouts(callback) {
	$.ajax({
		url: '/api/users/workouts',
		type: 'GET',
		headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
     	dataType: 'JSON'
    })
    .done(function( data ) { // arr of user workouts
      callback(data);
    })
    .fail(function (err) {
      console.error(err);
    });
}

// calls API to GET a User workout
function findWorkout(id, callback) {
    $.ajax({
       url: `/api/users/workouts/${id}`,
       type: 'GET',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
    })
    .done(function( data ) {    
        callback(data);
    })
    .fail(function (err) {
        console.error(err);
    })
}
// calls API to ADD a User workout
function addWorkout(workout) {
    $.ajax({
       url: '/api/users/workouts',
       type: 'POST',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
       data: JSON.stringify(workout),
       contentType: 'application/json',
       dataType: 'JSON'
    })
    .done(function( data ) {
    		//finish
        $('.workout-result-dialog').append(`<h3 id="successInfo" style="color: #5cb85c">Added Workout</h3>`);
    })
    .fail(function (err) {
        console.log(err);
        //finish 
        $('.workout-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">${err.statusText}</h3>`);
    })
}
// calls API to UPDATE a workout
function updateWorkout(id, updatedWorkout) {
    $('#successInfo').remove();
   $.ajax({
       url: `/api/users/workouts/${id}/${updatedWorkout}`,
       type: 'PUT',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
       console.log(data)
        $('.workout-result-dialog').append(`<h3 id="successInfo" style="color: #5cb85c">Successfully updated workout</h3>`);
    })
    .fail(function (err) {
        console.log(err);
        $('.workout-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">${err.statusText}</h3>`);
    }) 
}

// calls API to DELETE User workout
function deleteWorkout(id) {
    $.ajax({
       url: `/api/users/workout/${id}`,
       type: 'DELETE',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
        // remove workout from sessionStorage
        sessionStorage.removeItem(id);

        // render homepage        
        window.location.replace("/home.html")
    })
    .fail(function (err) {
        console.log(err);
    })
}

// calls API to get an updated Auth token (JWT)
function getAuthToken(callback) {
    $.ajax({
       url: '/api/auth/refresh',
       type: 'POST',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
        callback(data.authToken);
    })
    .fail(function (err) {
        console.log(err);
    })
}

// calls login API route to authenticate
function authenticateUser() {
    $.ajax({
       url: '/api/auth/login',
       type: 'POST',
       data: {username: $('#username').val(), password: $('#password').val()},
       dataType: 'JSON'
    })
    .done(function( data ) {
        sessionStorage.setItem('token', data.token);
        $('.auth-warning').removeClass('warning-on').text('');
        $('.login-btn').addClass('hidden');

        getUserWorkouts(updateSessionStorageWithWorkouts);

        window.location.replace("/home.html");
    })
    .fail(function (err) {
        console.log(err);
        $('.auth-warning').addClass('warning-on').text(`${err.responseText}`);
    })
}

// calls registration API route to register new User
function registerUser(user) {
    $.ajax({
       url: '/api/users',
       type: 'POST',
       data: JSON.stringify(user),
       contentType: 'application/json',
       dataType: 'JSON'
    })
    .done(function(data) {
        console.log("WHERE ARE YOU?!");
        $('.auth-warning').removeClass('warning-on').text('');

        getUserWorkouts(updateSessionStorageWithWorkouts);
        
        window.location.replace("/home.html");
    })
    .fail(function(err) {
        console.log(err);
        $('.auth-warning').addClass('warning-on').text(`${err.responseJSON.location}: ${err.responseJSON.message}`);
    })
}

function updateSessionStorageWithWorkouts(data) {
    data.workouts.forEach( (workout, index) => {
        sessionStorage.setItem(data.workouts[index].id, JSON.stringify(data.workouts[index]));
    })
}