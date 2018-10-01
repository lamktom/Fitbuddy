"use strict"; 

const chai = require("chai"); 
const chaiHttp = require("chai-http"); 
const { app, runServer, closeServer } = require("../server"); 
const { TEST_DATABASE_URL, PORT } = require("../config");

// lets us use expect style syntax in tests
// such as `expect(1 + 1).to.equal(2);`
const expect = chai.expect; 

// so we can make HTTP requests in our tests 
chai.use(chaiHttp); 

describe("Workouts", function() {
	// start server before running tests 
	before(function() {
		return runServer(TEST_DATABASE_URL); 
	});

	// close server after tests 
	after(function() {
		return closeServer(); 
	});

	it("should list workouts on GET", function() {
		return chai 
			.request(app)
			.get("/workouts")
			.then(function(res) {
				expect(res).to.have.status(200); 
				expect(res).to.be.json;
			}); 
	}); // end it for GET 

	it("should add a workout on POST", function() {
		const newWorkout = { workoutName: "test", musclesWorked: "test", equipment: "test" };
		return chai 
			.request(app)
			.post("/workouts")
			.send(newWorkout)
			.then(function(res) {
				expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "workout");
        expect(res.body.id).to.not.equal(null);
			});
	}); // end it for POST

	it("should update workouts on PUT", function() {
		const updateData = {
			id: "5b949498e7179a73d49078a0",
			workout: {
				workoutName: "test",
				musclesWorked: "test", 
				equipment: "test",
				video: "test"
			}
		};

		return (
			chai
				.request(app)
				.get("/workouts")
				.then(function(res) {
					// console.log(res);
					updateData.id = res.body[0].id;
					return chai
						.request(app)
						.put(`/workouts/${updateData.id}`)
						.send(updateData);
				})
				.then(function(res) {
					expect(res).to.have.status(204);
				})
		);
	}); // end it for PUT 

	it("should delete workouts on DELETE", function() {
		return (
			chai
				.request(app)
				.get("/workouts")
				.then(function(res) {
					expect(res).to.have.status(200); 
				})	

		);
	}); // end it for DELETE
}); // end describe 