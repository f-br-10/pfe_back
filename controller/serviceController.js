// serviceController.js
const mongoose = require("mongoose");
const exampleResponse = require('../exempleResponse.js');
const Service = require('../model/ServiceModel');
const User = require('../model/userModel.js');
const ovh = require('../ovhinit.js');
const Fournisseur = require('../model/FournisseurModel.js');

async function fetchAndStoreServices() {
  try {
    // Récupérer la liste des services OVH
    const response = await ovh.requestPromised('GET', '/service');
    const allServices = await Service.find();
    // Traiter la réponse de l'API OVH
    for (const service of response) {
      try {
        // Récupérer les détails de chaque service
        const serviceDetails = await ovh.request('GET', `/services/${service.id}`);
        for (const serviceModel of allServices) {
          if (serviceModel.nom.toLowerCase() === serviceDetails.resource.name.toLowerCase()) {
            serviceModel.date_debut = new Date(serviceDetails.engagementDate);
            serviceModel.date_fin = new Date(serviceDetails.expirationDate);
            serviceModel.statut = serviceDetails.state
          } else {
            // Créer un document Service mongoose avec les détails du service et l'enregistrer dans la base de données
            await Service.create({
              nom: serviceDetails.resource.name,
              date_debut: new Date(serviceDetails.engagementDate),
              date_fin: new Date(serviceDetails.expirationDate),
              statut: serviceDetails.state,
            });
          }
        }

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
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const newService = await Service.create(req.body);
    user.services.push(newService._id);
    await user.save();
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

async function getServicesWithUser(req,res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('services');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json(user.services);
  } catch (error) {
    console.error('Erreur lors de la récupération des services de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services de l\'utilisateur' });
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



async function updateServiceStatus() {
  try {
    // Récupérer tous les services
    const services = await Service.find();

    // Parcourir chaque service pour mettre à jour son statut
    for (const service of services) {
      const expirationDate = new Date(service.date_fin);
      const currentTime = new Date();
      const remainingTimeMs = expirationDate - currentTime;

      let status;
      if (remainingTimeMs > 0) {
        status = 'Active';
      } else {
        status = 'Expired';
      }

      // Mettre à jour le statut uniquement si cela a changé
      if (service.statut !== status) {
        service.statut = status;
        await service.save();
      }
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut des services:', error);
  }
}


async function getServiceStatusCounts   (req, res)  {
    try {
        const statusCounts = await Service.aggregate([
            {
                $group: {
                    _id: "$statut",
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(statusCounts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques de service', error });
    }
};

async function getServiceDistributionByFournisseur   (req, res) {
  try {
      const fournisseurCounts = await Service.aggregate([
          {
              $group: {
                  _id: "$fournisseur",
                  count: { $sum: 1 }
              }
          }
      ]);
      res.status(200).json(fournisseurCounts);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques par fournisseur', error });
  }
};

async function getServiceExpirationDates  (req, res) {
  try {
      const expirationDates = await Service.find({}, 'nom date_fin').sort('date_fin');
      return res.status(200).json(expirationDates);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des dates d\'expiration des services', error });
  }
};
async function updateServiceReferences() {
  const fournisseurs = await Fournisseur.find();
  for (const fournisseur of fournisseurs) {
      const updatedServices = fournisseur.services.map(service => {
          if (typeof service === 'string' && mongoose.Types.ObjectId.isValid(service)) {
              return mongoose.Types.ObjectId(service);
          } else if (mongoose.Types.ObjectId.isValid(service)) {
              return service;
          }
          console.warn(`Service ID non valide trouvé: ${service}`);
          return service;
      });
      await Fournisseur.updateOne({ _id: fournisseur._id }, { services: updatedServices });
  }
  console.log('Mise à jour des références de services terminée.');
}
module.exports = {
  createService, getServiceById, getAllServices,
   updateService, deleteService, updateServiceStatus,
    fetchAndStoreServices,getServicesWithUser, getServiceStatusCounts,
     getServiceDistributionByFournisseur, getServiceExpirationDates, updateServiceReferences
};
