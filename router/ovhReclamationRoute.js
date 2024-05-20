const express = require('express');
const { verifyToken , verifyTokenAndAdmin} = require('../verifyToken.js');

const reclamation = express.Router();

const {
  fetchAndStoreReclamations,
  createOvhReclamation,
  updateOvhReclamation,
  closeOvhReclamation, 
  getAllReclamations
} = require('../controller/ovhReclamationController');


// Route pour créer une nouvelle réclamation OVH
reclamation.post('/create', createOvhReclamation);

// Route pour mettre à jour une réclamation OVH
reclamation.post('/update/:ticketId', updateOvhReclamation);

// Route pour fermer une réclamation OVH
reclamation.post('/:ticketId/close', closeOvhReclamation);
// Route pour obtenir toutes les réclamations BD
reclamation.get('/getall', getAllReclamations);

module.exports = reclamation;
