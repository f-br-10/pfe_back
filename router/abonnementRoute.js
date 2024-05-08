// abonnementRoute.js

const express = require('express');
const abonnementRoute = express.Router();
const abonnementController = require('../controller/abonnementController');

// Route pour calculer la durée restante jusqu'à l'expiration
abonnementRoute.get('/remainingTime', abonnementController.calculateRemainingTime);

module.exports = abonnementRoute;
