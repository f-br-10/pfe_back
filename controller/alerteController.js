const exampleResponse = require('../exempleResponse.js');
const alerteModel = require('../AlerteModel.js');

async function notifyExpiration(req, res) {
  try {
    // Récupérer les détails de l'abonnement ou du service
    const { serviceId } = req.params;
    const result = await ovh.request('GET', `/services/${serviceId}`);
    const expirationDate = new Date(result.expirationDate);

    // Calculer la date limite de notification en fonction de la configuration de l'utilisateur
    const notificationConfig = req.body.notificationConfig; // Assurez-vous que la configuration est envoyée depuis l'interface utilisateur
    const notifyBeforeDays = notificationConfig && notificationConfig.serviceNotifyBeforeDays ? notificationConfig.serviceNotifyBeforeDays : notificationConfig.defaultNotifyBeforeDays;
    const notificationDate = new Date(expirationDate.getTime() - (notifyBeforeDays * 24 * 60 * 60 * 1000));

    // Vérifier si la date de notification est passée ou non
    const currentTime = new Date();
    if (notificationDate < currentTime) {
      // Si la date de notification est passée, envoyer la notification
      const alerte = new alerteModel({
        iduser: req.body.iduser, // Vous devez fournir l'ID de l'utilisateur depuis la requête ou d'une autre manière
        titre_de_notification: notificationConfig.titre_de_notification, // Titre de la notification
        description: notificationConfig.description, // Description de la notification
        statut: 'En attente', // Statut de la notification
      });
      await alerte.save();
      res.status(200).json({ message: 'Notification de l\'expiration enregistrée avec succès' });
    } else {
      // Si la date de notification n'est pas encore passée, renvoyer un message indiquant qu'il est trop tôt pour notifier
      res.status(200).json({ message: 'Trop tôt pour notifier l\'expiration' });
    }
  } catch (error) {
    console.error('Erreur lors de la notification de l\'expiration:', error);
    res.status(500).json({ message: 'Erreur lors de la notification de l\'expiration' });
  }
}

module.exports = {
  notifyExpiration
};
