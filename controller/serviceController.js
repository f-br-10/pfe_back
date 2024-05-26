// serviceController.js
const mongoose = require("mongoose");
const Service = require('../model/ServiceModel');
const User = require('../model/UserModel.js');
const { createOvhInstance }  = require('../ovhinit.js');
const Fournisseur = require('../model/FournisseurModel.js');


async function fetchAndStoreOvhServices() {
  try {
    const fournisseursOvh = await Fournisseur.find({ nom: 'OVH' });
    for (const fournisseur of fournisseursOvh) {
      const ovhInstance = createOvhInstance(
        fournisseur.ovhApiKey,
        fournisseur.ovhSecret,
        fournisseur.ovhConsumerKey
      );

      // Récupérer la liste des services OVH pour ce fournisseur
      const response = await ovhInstance.requestPromised('GET', '/service');

      const allServices = await Service.find({ fournisseur: fournisseur._id });

      // Traiter la réponse de l'API OVH
      for (const serviceId of response) {
        try {
          // Récupérer les détails de chaque service
          const serviceDetails = await ovhInstance.requestPromised('GET', `/services/${serviceId}`);

          const existingService = await Service.findOne({ nom: serviceDetails.resource.name.toLowerCase(), fournisseur: fournisseur._id });

          if (existingService) {
            existingService.date_debut = new Date(serviceDetails.engagementDate);
            existingService.date_fin = new Date(serviceDetails.expirationDate);
            existingService.statut = serviceDetails.state;
            existingService.statique = false;
            await existingService.save();
          } else {
            const newService = new Service({
              nom: serviceDetails.resource.name,
              date_debut: new Date(serviceDetails.engagementDate),
              date_fin: new Date(serviceDetails.expirationDate),
              statut: serviceDetails.state,
              statique: false,
              fournisseur: fournisseur._id,
              deleted: false
            });
            await newService.save();
            fournisseur.services.push(newService._id);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération et du stockage des détails du service OVH:', error);
        }
      }
      await fournisseur.save();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des services OVH:', error);
  }
}

async function createService(req, res) {
  try {
    const { fournisseurId, ...serviceData } = req.body;

    const fournisseur = await Fournisseur.findById(fournisseurId);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }

    // Vérifier si un service avec le même nom et les mêmes dates existe déjà pour ce fournisseur
    const existingService = await Service.findOne({ fournisseur: fournisseurId, nom: serviceData.nom, date_debut: serviceData.date_debut, date_fin: serviceData.date_fin });
    if (existingService) {
      return res.status(409).json({ message: 'Service existe déjà pour ce fournisseur avec les mêmes dates' });
    }
    const newService = new Service({
      ...serviceData,
      statique: true, 
      fournisseur: fournisseurId
    });

    await newService.save();

    fournisseur.services.push(newService._id);
    await fournisseur.save();

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
}const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({
      $or: [{ deleted: { $exists: false } }, { deleted: false }]
    }).populate('fournisseur');

    const formattedServices = services.map(service => ({
      ...service._doc,
      date_debut: formatDate(service.date_debut),
      date_fin: formatDate(service.date_fin)
    }));

    res.status(200).json(formattedServices);
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des services' });
  }
};

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
    const updatedService = await Service.findByIdAndUpdate(req.params.id, {$set:req.body}, { new: true });
    if (!updatedService) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    return res.json(updatedService);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du service' });
  }
}

const deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    // Mettre à jour le champ 'deleted' à true
    const service = await Service.findByIdAndUpdate(serviceId, { deleted: true }, { new: true });
    
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }

    res.status(200).json({ message: 'Service supprimé (soft delete)' });
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du service' });
  }
};

async function updateServiceStatus() {
  try {
    // Récupérer tous les services  statique
    const services = await Service.find({ statique: true });

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

async function renewService(req, res) {
  try {
      const { serviceId, numberOfMonths } = req.body;
      const service = await Service.findById(serviceId);
      if (!service) {
          return res.status(404).json({ message: 'Service not found' });
      }
      
      const currentDate = new Date();
      const expirationDate = new Date(service.date_fin);
      
      let newExpirationDate;
      if (numberOfMonths >= 12) {
          const years = Math.floor(numberOfMonths / 12);
          const remainingMonths = numberOfMonths % 12;
          newExpirationDate = addMonthsToDate(expirationDate, remainingMonths);
          newExpirationDate.setFullYear(newExpirationDate.getFullYear() + years);
      } else {
          newExpirationDate = addMonthsToDate(expirationDate, numberOfMonths);
      }
      
      service.date_fin = newExpirationDate;
      await service.save();
      
      return res.status(200).json({ message: 'Service renewed successfully', newExpirationDate });
  } catch (error) {
      console.error('Error renewing service:', error);
      res.status(500).json({ message: 'Error renewing service' });
  }
}


module.exports = {
  createService, getServiceById, getAllServices,
   updateService, deleteService, updateServiceStatus,
    fetchAndStoreOvhServices,getServicesWithUser, getServiceStatusCounts,
     getServiceDistributionByFournisseur, getServiceExpirationDates, updateServiceReferences,
     renewService
};



function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}


function addMonthsToDate(date, months) {
  const newDate = new Date(date);
  const currentMonth = newDate.getMonth();
  const newMonth = currentMonth + months;
  newDate.setMonth(newMonth);
  return newDate;
}
