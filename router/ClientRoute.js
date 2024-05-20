// serviceroutes.js

const express = require('express');
const clientroute = express.Router();
const clientController = require('../controller/clientController');
const { verifyToken } = require('../verifyToken');

clientroute.post('/create', clientController.createClient);/*

clientroute.get('/getallclient', clientController.getAllClients); 

clientroute.get('/getclient/:id', clientController.getClientById);

clientroute.patch('/updateclient/:id', clientController.updateClient);

clientroute.delete('/deleteclient/:id', clientController.deleteClient);*/

module.exports = clientroute;
