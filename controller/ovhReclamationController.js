const ovh = require('../ovhinit.js');
const Reclamation = require ('../model/ReclamationModel');


async function fetchAndStoreReclamations() {
  try {
    // Récupérer la liste des réclamations OVH
    const reclamationsList = await ovh.requestPromised('GET','/support/tickets');
    
    console.log(reclamationsList);
    // Traiter la réponse de l'API OVH
    for (const ticketId of reclamationsList) {
      try {
        // Récupérer les détails de chaque réclamation
        const reclamationDetails = await ovh.requestPromised('GET', `/support/tickets/${ticketId.id}`);
        
        // Créer un document réclamation Mongoose avec les détails de la réclamation et l'enregistrer dans la base de données
        const newReclamation = new Reclamation({
          accountId: reclamationDetails.accountId,
          canBeClosed: reclamationDetails.canBeClosed,
          category: reclamationDetails.category,
          creationDate: new Date(reclamationDetails.creationDate),
          lastMessageFrom: reclamationDetails.lastMessageFrom,
          product: reclamationDetails.product,
          score: reclamationDetails.score,
          serviceName: reclamationDetails.serviceName,
          state: reclamationDetails.state,
          subject: reclamationDetails.subject,
          ticketId: reclamationDetails.ticketId,
          ticketNumber: reclamationDetails.ticketNumber,
          type: reclamationDetails.type,
          updateDate: new Date(reclamationDetails.updateDate),
        });
        await newReclamation.save();
      } catch (error) {
        console.error('Erreur lors de la récupération et du stockage des détails de la réclamation OVH:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations OVH:', error);
  }
}


// Créer une nouvelle réclamation OVH
async function createOvhReclamation(req, res) {
  try {
    const { 
      body,
      category,
      impact,
      product,
      serviceName,
      subcategory,
      subject,
      type,
      urgency
    } = req.body;

    
      ovh.requestPromised('POST', '/support/tickets/create', {
        body,
        category,
        impact,
        product,
        serviceName,
        subcategory,
        subject,
        type,
        urgency,
        watchers: []
      });
    const response = await Reclamation.create({
      body,
      category,
      impact,
      product,
      serviceName,
      subcategory,
      subject,
      type,
      urgency,
      watchers: []
    })

    res.status(201).json(response);
  } catch (error) {
    res.status(500).send('Erreur lors de la création de la réclamation OVH: ' + error.message);
  }
}

async function deleteOvhReclamation(req,res) {
  try {
    const { id } = req.params;
    const deletedReclamation = await Reclamation.findByIdAndDelete(id);
    res.status(200).json(deletedReclamation);
  } catch (error) {
    res.status(500).send('Erreur lors de la suppression de la réclamation OVH: ' + error.message);
  }
}

// Mettre à jour une réclamation OVH
async function updateOvhReclamation(req, res) {
  try {
    const { ticketId } = req.params;
    const { body } = req.body;
    const updatedReclamation = await ovh.requestPromised('POST', `/support/tickets/${ticketId}/reply`, {
      body
    });
    res.status(200).json(updatedReclamation);
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour de la réclamation OVH: ' + error.message);
  }
}

// Fermer une réclamation OVH
async function closeOvhReclamation(req, res) {
  try {
    const { ticketId } = req.params;
    const closedReclamation = await ovh.requestPromised('POST', `/support/tickets/${ticketId}/close`);
    res.status(200).json(closedReclamation);
  } catch (error) {
    res.status(500).send('Erreur lors de la fermeture de la réclamation OVH: ' + error.message);
  }
}
async function getAllReclamations(req, res) {
  try {
    const reclamations = await Reclamation.find();
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des réclamations: ' + error.message);
  }
}
// Obtenir une réclamation par ID
async function getReclamationById(req, res) {
  try {
    const { id } = req.params;
    const reclamation = await Reclamation.findById(id);
    if (!reclamation) {
      return res.status(404).send('Réclamation non trouvée');
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération de la réclamation: ' + error.message);
  }
}
module.exports = {
  fetchAndStoreReclamations,
  createOvhReclamation,
  updateOvhReclamation,
  closeOvhReclamation, 
  getAllReclamations, 
  getReclamationById, 
  deleteOvhReclamation
};
