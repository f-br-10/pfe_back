const express = require('express');
const { countUsers, deleteAccount, getAllUsers, updatePassword, updateUser } = require('../controller/userController.js');
const { verifyToken } = require('../verifyToken.js');

const UserRoutes = express.Router();

//Get All Users
UserRoutes.get('/allUsers', getAllUsers);

//Update User Info
UserRoutes.put('/update',verifyToken, updateUser);

//Update User Password
UserRoutes.put('/updatePassword',verifyToken, updatePassword);

//Delete User Account
UserRoutes.delete('/:id', deleteAccount);

//Count All Users
UserRoutes.get('/countUsers', countUsers);


module.exports =  UserRoutes;