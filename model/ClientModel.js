const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  email: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

























try {
  // Récupérer tous les paramètres de notification des utilisateurs
  const allUserSettings = await Settings.find();

  // Parcourir tous les paramètres de notification
  allUserSettings.forEach(setting => {
      console.log(`UserId: ${setting.userId}`);
      console.log(`Global Notification Days: ${setting.globalNotificationDays}`);

      // Parcourir toutes les notifications personnalisées
      setting.customNotifications.forEach(customNotification => {
          console.log(`ServiceId: ${customNotification.serviceId}`);
          console.log(`Notification Days: ${customNotification.notificationDays}`);
      });
  });
} catch (error) {
  console.error("Error mapping notification days:", error);
}

















