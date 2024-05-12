// serviceroutes.js

const express = require('express');
const serviceroute = express.Router();
const serviceController = require('../controller/serviceController');

// Route pour récupérer les détails d'un service OVH
serviceroute.get('/services/:serviceId', serviceController.getServiceDetails);
serviceroute.get('/services', serviceController.getServices);
serviceroute.get('/remainingTime', serviceController.calculateRemainingTime);

module.exports = serviceroute;
