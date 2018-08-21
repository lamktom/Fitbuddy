"use strict"; 

exports.DATABASE_URL = 
	process.env.DATABASE_URL || "mongodb://localhost/fitbuddy-app"; 
exports.TEST_DATABASE_URL = 
	process.env.TEST_DATABASE_URL || "mongodb://localhost/test-fitbuddy-app"; 
exports.PORT = process.env.PORT || 8080; 

// mongodb://fitbuddy-user:fitbuddy-user1@ds223542.mlab.com:23542/fitbuddy-db