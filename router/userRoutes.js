const express = require('express');
const { countUsers, deleteAccount, getAllUsers, updatePassword, updateUser } = require('../controller/userController.js');

const UserRoutes = express.Router();

//Get All Users
UserRoutes.get('/allUsers', getAllUsers);

//Update User Info
UserRoutes.put('/update', updateUser);

//Update User Password
UserRoutes.put('/updatePassword', updatePassword);

//Delete User Account
UserRoutes.delete('/:id', deleteAccount);

//Count All Users
UserRoutes.get('/countUsers', countUsers);


module.exports =  UserRoutes;