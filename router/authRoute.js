const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');

const AuthRoutes = express.Router();

//Register User
AuthRoutes.post('/register', registerUser);

// Login User
AuthRoutes.post('/login', loginUser);

module.exports = AuthRoutes;

