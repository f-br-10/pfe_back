// serviceroutes.js

const express = require('express');
const serviceroute = express.Router();
const serviceController = require('../controller/serviceController');

serviceroute.post('/create', serviceController.createService);

serviceroute.get('/remainingTime', serviceController.calculateRemainingTime);

serviceroute.get('/getallservices', serviceController.getAllServices); 

serviceroute.get('/getservice/:id', serviceController.getServiceById);

serviceroute.patch('/updateservice/:id', serviceController.updateService);

serviceroute.delete('/deleteservices/:id', serviceController.deleteService);

module.exports = serviceroute;
