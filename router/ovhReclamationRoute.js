/*const express = require('express');
const { verifyToken , verifyTokenAndAdmin} = require('../verifyToken.js');

const reclamation = express.Router();

const {
  createOvhReclamation,
  updateOvhReclamation,
  closeOvhReclamation, 
  getAllReclamations,
  deleteOvhReclamation,
  getReclamationCountsByCategory
} = require('../controller/ovhReclamationController');


// Route pour créer une nouvelle réclamation OVH
reclamation.post('/create', createOvhReclamation);
reclamation.delete("/delete-reclamation/:id", deleteOvhReclamation);
// Route pour mettre à jour une réclamation OVH
reclamation.post('/update/:ticketId', updateOvhReclamation);

// Route pour fermer une réclamation OVH
reclamation.post('/:ticketId/close', closeOvhReclamation);
// Route pour obtenir toutes les réclamations BD
reclamation.get('/getall', getAllReclamations);

//pour les diagrammes 
reclamation.get('/category-counts', getReclamationCountsByCategory);

module.exports = reclamation;
*/