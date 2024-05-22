// serviceroute.js

const express = require('express');
const serviceroute = express.Router();
const serviceController = require('../controller/serviceController');
const { verifyToken } = require('../verifyToken');

serviceroute.post('/create',verifyToken, serviceController.createService);

serviceroute.get('/remainingTime', serviceController.calculateRemainingTime);

serviceroute.get('/getallservices', serviceController.getAllServices); 
serviceroute.get("/getserviceswithuser", verifyToken, serviceController.getServicesWithUser);

serviceroute.get('/getservice/:id', serviceController.getServiceById);

serviceroute.patch('/updateservice/:id', serviceController.updateService);

serviceroute.delete('/deleteservices/:id', serviceController.deleteService);
 
//pour les diagrammes 
serviceroute.get('/Status-Counts', serviceController.getServiceStatusCounts);

serviceroute.get('/fournisseur-distribution', serviceController.getServiceDistributionByFournisseur);

serviceroute.get('/expiration-dates', serviceController.getServiceExpirationDates);

module.exports = serviceroute;
