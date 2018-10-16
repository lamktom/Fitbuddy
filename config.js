"use strict"; 

exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://fitbuddy-user:fitbuddy-user1@ds223542.mlab.com:23542/fitbuddy-db";
// exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/fitbuddy-db"; 
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || "mongodb://test-fitbuddy-user:test-fitbuddy-user1@ds133152.mlab.com:33152/test-fitbuddy-db"; 
exports.PORT = process.env.PORT || 8080; 

exports.JWT_SECRET = process.env.JWT_SECRET || '1superdupersecretstring';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'; //expires in 7 days 
