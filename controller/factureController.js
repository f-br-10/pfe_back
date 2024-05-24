const Facture = require ('../model/FactureModel'); 
const ovh = require('../ovhinit.js');



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
  