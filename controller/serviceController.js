// serviceController.js
const exampleResponse = require('../exempleResponse.js');
const Service = require('../model/ServiceModel');
const ovh = require('../ovhinit.js');

async function fetchAndStoreServices() {
  try {
    // Récupérer la liste des services OVH
    const response = await ovh.requestPromised('GET', '/service');
    
    // Traiter la réponse de l'API OVH
    for (const service of response) {
      try {
        // Récupérer les détails de chaque service
        const serviceDetails = await ovh.request('GET', `/services/${service.id}`);
        // Créer un document Service mongoose avec les détails du service et l'enregistrer dans la base de données
        await Service.create({
          nom: serviceDetails.nom,
          date_debut: new Date(serviceDetails.engagementDate),
          date_fin: new Date(serviceDetails.expirationDate),
          statut: serviceDetails.state,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération et du stockage des détails du service OVH:', error);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des services OVH:', error);
  }
}

async function createService(req, res) {
  try {
    const newService = await Service.create(req.body);
    return res.status(201).json(newService);
  } catch (error) {
    console.error('Erreur lors de la création du service:', error);
    res.status(500).json({ message: 'Erreur lors de la création du service' });
  }
}

async function getServiceById(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    return res.json(service);
  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du service' });
  }
}

async function getAllServices(req, res) {
  try {
    const services = await Service.find();
    return res.json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
}

async function updateService(req, res) {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    return res.json(updatedService);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du service' });
  }
}

async function deleteService(req, res) {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    return res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du service' });
  }
}


function calculateRemainingTime(req, res) {
  try {
    const expirationDate = new Date(exampleResponse.exampleResponse.expirationDate);
    const currentTime = new Date();
    const remainingTimeMs = expirationDate - currentTime;

    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    res.json({ days, hours, minutes, seconds });
  } catch (error) {
    console.error('Erreur lors du calcul de la durée restante jusqu\'à l\'expiration:', error);
    res.status(500).json({ message: 'Erreur lors du calcul de la durée restante jusqu\'à l\'expiration' });
  }
}

module.exports = {
   createService , getServiceById ,getAllServices ,updateService ,deleteService ,calculateRemainingTime ,fetchAndStoreServices 
};
