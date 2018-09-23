//authenticate user 
$('.login-form').submit(function(event) {
	event.preventDefault(); 

	// get and set jwt to sessionStorage
	// redirects to home page if successful 
	authenticateUser(); 
});