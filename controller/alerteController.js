const Service = require('../model/ServiceModel');
const Settings = require("../model/settingsModel.js");
const Alerte = require("../model/AlerteModel");
const User = require("../model/userModel.js");


async function compareServiceExpirationDateWithUserSettings() {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.find();

    // Parcourir tous les utilisateurs
    for (const user of users) {    

      // Vérifier si l'utilisateur a des services associés
      if (user.services && user.services.length > 0) {
        // Parcourir les services associés à l'utilisateur
        for (const serviceId of user.services) {
          // Récupérer le service
          const service = await Service.findById(serviceId);
          if (!service) {
            console.error(`Service not found with ID ${serviceId} for user ${user._id}`);
            continue;
          }

          // Calculer la différence entre la date d'expiration et la date actuelle
          const expirationDate = new Date(service.date_fin);
          expirationDate.setHours(0, 0, 0, 0);
          const currentTime = new Date();// Forcer l'utilisation de la date locale
          currentTime.setUTCHours(0, 0, 0, 0);
          const daysDifference = Math.floor((expirationDate - currentTime) / (1000 * 60 * 60 * 24));
          /*console.log("Expiration Date:", expirationDate);
          console.log("Current Time:", currentTime);
          console.log("Days Difference:", daysDifference);*/
          
          // Récupérer les paramètres de notification de l'utilisateur
          const userSettings = await Settings.findOne({ userId: user._id });

          // Vérifier si les paramètres de notification de l'utilisateur existent
          if (!userSettings) {
            console.error(`Aucun paramètre de notification trouvé pour l'utilisateur avec l'ID ${user._id}.`);
            continue;
          }

          // Utiliser les paramètres spécifiques pour ce service s'ils existent, sinon utiliser les paramètres globaux de l'utilisateur
          const specificNotification = userSettings.customNotifications.find(notification => notification.serviceId.equals(service._id));
          const notificationDays = specificNotification ? specificNotification.notificationDays : userSettings.globalNotificationDays;

          // Comparer les valeurs avec la période de notification de l'utilisateur
          if (daysDifference === notificationDays) {
            // Créer une alerte et l'enregistrer dans la base de données
            const alertMessage = `Le service ${service.nom} id ${service._id} expire dans ${daysDifference} jours.`;

            await Alerte.create({
              serviceId: service._id,
              userId: user._id,
              message: alertMessage
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la comparaison des dates d'expiration des services avec les paramètres de notification des utilisateurs:", error);
  }
}


/*
async function compareServiceExpirationDateWithUserSettings() {
  try {
    
    // Récupérer tous les utilisateurs
    const users = await User.find();
    
    // Parcourir tous les utilisateurs
    for (const user of users) {    
      
      // Vérifier si l'utilisateur a des services associés
      if (user.services && user.services.length > 0) {
        // Parcourir les services associés à l'utilisateur
        for (const serviceId of user.services) {
          // Récupérer le service
          const service = await Service.findById(serviceId);
          if (!service) {
            console.error(`Service not found with ID ${serviceId} for user ${user._id}`);
            continue;
          }
          // Calculer la différence entre la date d'expiration et la date actuelle
          const expirationDate = new Date(service.date_fin);
          expirationDate.setHours(0, 0, 0, 0);
          const currentTime = new Date();// Forcer l'utilisation de la date locale
          currentTime.setUTCHours(0, 0, 0, 0);
          const daysDifference = Math.floor((expirationDate - currentTime) / (1000 * 60 * 60 * 24));
          /*console.log("Expiration Date:", expirationDate);
          console.log("Current Time:", currentTime);
          console.log("Days Difference:", daysDifference);*/
          /*
          // Récupérer les paramètres de notification de l'utilisateur
          const userSettings = await Settings.findOne({ userId: user._id });

          // Vérifier si les paramètres de notification de l'utilisateur existent
          if (!userSettings) {
            console.error(`Aucun paramètre de notification trouvé pour l'utilisateur avec l'ID ${user._id}.`);
            continue;
          }

          // Utiliser les paramètres spécifiques pour ce service s'ils existent, sinon utiliser les paramètres globaux de l'utilisateur
          const specificNotification = userSettings.customNotifications.find(notification => notification.serviceId.equals(service._id));
          const notificationDays = specificNotification ? specificNotification.notificationDays : userSettings.globalNotificationDays;

          // Comparer les valeurs avec la période de notification de l'utilisateur
          if (daysDifference === notificationDays) {
            // Créer une alerte et l'enregistrer dans la base de données
            const alertMessage = `Le service ${service.nom} id ${service._id} expire dans ${daysDifference} jours.`;

            await Alerte.create({
              serviceId: service._id,
              userId: user._id,
              message: alertMessage
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la comparaison des dates d'expiration des services avec les paramètres de notification des utilisateurs:", error);
  }
}
*/

async function getAlertesByUserId(req, res) {
  try {
    const userId = req.user._id; 
    const alertes = await Alerte.find({ userId }).populate('serviceId');
    let unreadAlertes = alertes.filter(alerte => alerte.statut === 'unread');
    res.status(200).json({ alertes: alertes, unreadAlertes: unreadAlertes });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des alertes de l\'utilisateur: ' + error.message);
  }
}

async function markAlerteAsRead(req, res) {
  try {
    const { id } = req.params;
    const alerte = await Alerte.findByIdAndUpdate(id, { statut: 'read' }, { new: true });
    if (!alerte) {
      return res.status(404).send('Alerte non trouvée.');
    }
    res.status(200).json(alerte);
  } catch (error) {
    res.status(500).send('Erreur lors de la mise à jour de l\'alerte: ' + error.message);
  }
}

module.exports = { compareServiceExpirationDateWithUserSettings , getAlertesByUserId , markAlerteAsRead};
