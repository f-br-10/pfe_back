const express = require('express');
const alerteRoutes = express.Router();
const  {verifyToken}  = require('../verifyToken.js');
const {getAlertesByUserId,markAlerteAsRead} = require('../controller/alerteController');

// Route pour obtenir les alertes de l'utilisateur connecté
alerteRoutes.get('/user', verifyToken, getAlertesByUserId);

// Route pour marquer une alerte comme lue
alerteRoutes.put('/:id/read', verifyToken, markAlerteAsRead);

module.exports = alerteRoutes;
