'use strict'; 
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const { User } = require('./models'); 

const router = express.Router(); 


