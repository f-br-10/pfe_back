const express = require('express');
const { countUsers, deleteAccount,getProfile, getAllUsers, updatePassword, updateUser , assignServicesToUser } = require('../controller/userController.js');
const { verifyToken , verifyTokenAndAdmin} = require('../verifyToken.js');

const UserRoutes = express.Router();

//Get All Users
UserRoutes.get('/allUsers', getAllUsers);


// Get user info
UserRoutes.get('/userinfo',verifyToken, getProfile);


//Update User Info
UserRoutes.patch('/update',verifyToken, updateUser);

//Update User Password
UserRoutes.patch('/change-password ',verifyToken, updatePassword);

//Delete User Account
UserRoutes.delete('/:id', deleteAccount);

//Count All Users
UserRoutes.get('/countUsers', countUsers);

//assignServicesToUser
UserRoutes.patch('/assignServicesToUser',verifyTokenAndAdmin, assignServicesToUser);

module.exports =  UserRoutes;