const Alerte = require('../model/AlerteModel');
const User = require('../model/UserModel');
const Service = require('../model/ServiceModel');
const Settings = require('../model/SettingsModel');

async function checkAndCreateAlerts() {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.find().populate('services').exec();
    console.log('Nombre d\'utilisateurs trouvés:', users.length);

    // Parcourir chaque utilisateur
    for (const user of users) {
      console.log('Vérification des alertes pour l\'utilisateur:', user.nom);

      // Récupérer les paramètres de notification de l'utilisateur
      const settings = await Settings.findOne({ userId: user._id }).exec();
      let globalNotificationDays = settings ? settings.globalNotificationDays : 10;
      console.log('Paramètres de notification globale pour l\'utilisateur', user.nom, ':', globalNotificationDays);

      // Parcourir chaque service de l'utilisateur
      for (const service of user.services) {
        console.log('Vérification du service:', service.nom);

        let notificationDays = globalNotificationDays;

        // Vérifier s'il y a des notifications personnalisées pour ce service
        if (settings && settings.customNotifications) {
          const customSetting = settings.customNotifications.find(sn => sn.serviceId.equals(service._id));
          if (customSetting) {
            notificationDays = customSetting.notificationDays;
          }
        }
        console.log('Jours de notification pour le service', service.nom, ':', notificationDays);

        // Calculer le temps restant jusqu'à la date d'expiration du service
        const currentTime = new Date();
        const expirationTime = new Date(service.date_fin);
        const timeDiff = expirationTime.getTime() - currentTime.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Créer et enregistrer une alerte si le temps restant est égal au paramètre de notification
        if (daysDiff === notificationDays) {
          const newAlert = new Alerte({
            serviceId: service._id,
            userId: user._id,
            fournisseurId: service.fournisseur,
            message: `Le service ${service.nom} expire dans ${notificationDays} jours.`,
          });

          await newAlert.save();
          console.log('Alerte enregistrée:', newAlert);
        } else {
          console.log(`Pas d'alerte à créer pour le service ${service.nom}. Jours restants: ${daysDiff}`);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des alertes:', error);
  }
}

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

module.exports = { checkAndCreateAlerts,getAlertesByUserId ,markAlerteAsRead};

