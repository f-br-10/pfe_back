// settingsRoutes.js
const express  = require('express');
const { getUserSettings, updateOrCreateUserSettings, updateUserSettings, addUserSettings } = require('../controller/settingsController.js');

const settingsRoutes = express.Router();

// Route pour récupérer les paramètres de notification d'un utilisateur
settingsRoutes.get('/:userId', getUserSettings);


settingsRoutes.put('/:userId', updateOrCreateUserSettings);

/*
// Route pour ajouter les paramètres de notification d'un utilisateur
settingsRoutes.post('/:userId', addUserSettings);

// Route pour mettre à jour les paramètres de notification d'un utilisateur
settingsRoutes.patch('/:userId', updateUserSettings);
*/
module.exports = settingsRoutes;