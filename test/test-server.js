"use strict"; 

const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
const { app, runServer, closeServer } = require("../server"); 

// lets us use expect style syntax in tests
// such as `expect(1 + 1).to.equal(2);`
const expect = chai.expect; 

// so we can make HTTP requests in our tests 
chai.use(chaiHttp); 

describe("index page", function() {

	// // start server before running tests 
	// before(function() {
	// 	return runServer(); 
	// });

	// // close server after tests 
	// after(function() {
	// 	return closeServer(); 
	// });

	it("should load html", function() {
		return chai 
			.request(app)
			.get("/")
			.then(function(res) {
				expect(res).to.have.status(200); 
			}); // end then 	
	}); // end it  
}); // end describe 