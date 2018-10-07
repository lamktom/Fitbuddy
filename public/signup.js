// to handle user submitting registration form
$('.signup-form').submit(function(event) {
	event.preventDefault(); 

	// const name = $('#fullname').val(); 
	// if(typeof $('#fullname').val() != 'undefined') {

	// }
	
	const firstName = $('#firstName').val(); 
	const lastName = $('#lastName').val(); 
	const username = $('#username').val(); 
	const password = $('#password').val();

	let user = {
		firstName,
		lastName,
		username,
		password
	}
	console.log(user);
	// call api to register user
	registerUser(user); 
});