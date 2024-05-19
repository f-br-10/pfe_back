const express = require('express');
const { registerUser, loginUser, forgetPasswordRequest, resetPasswordVerification } = require('../controller/authController');

const AuthRoutes = express.Router();

//Register User
AuthRoutes.post('/register', registerUser);

// Login User
AuthRoutes.post('/login', loginUser);

AuthRoutes.post("/forget-password", forgetPasswordRequest);

AuthRoutes.put("/create-password/:activation_Token",resetPasswordVerification)

module.exports = AuthRoutes;

