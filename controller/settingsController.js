// settingsController.js

const Settings = require ("../model/settingsModel.js");

// Controller pour récupérer les paramètres de notification d'un utilisateur
exports.getUserSettings = async (req, res) =>{

    try {
        const userId = req.params.userId; // Supposons que l'ID de l'utilisateur est envoyé dans les paramètres de la requête
        const settings = await Settings.findOne({ userId });
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des paramètres de notification de l'utilisateur" });
    }
}

// Controller pour mettre à jour les paramètres de notification d'un utilisateur
exports.updateUserSettings = async (req, res) =>{

    try {
        const setting = req.params.setting; // Supposons que l'ID de l'utilisateur est envoyé dans les paramètres de la requête
        const updatedSettings = req.body; // Supposons que les nouveaux paramètres sont envoyés dans le corps de la requête
        // await Settings.findOneAndUpdate({ userId }, updatedSettings, { new: true, upsert: true });
        await Settings.findByIdAndUpdate(setting, updatedSettings, { new: true })
        res.status(200).json({ message: "Paramètres de notification mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres de notification de l'utilisateur" });
    }
}

// Controller pour ajouter les paramètres de notification d'un utilisateur pour la première fois
exports.addUserSettings = async (req, res) =>{

  try {
      // const userId = req.params.userId; // Supposons que l'ID de l'utilisateur est envoyé dans les paramètres de la requête
      // const newSettings = req.body; // Supposons que les paramètres sont envoyés dans le corps de la requête
      // await Settings.findOneAndUpdate({ userId }, newSettings, { new: true, upsert: true });
      const userId = req.params.userId;
      const settings = req.body;
      const newSettings = new Settings({ userId, ...settings });
      await newSettings.save();
      res.status(201).json({ message: "Paramètres de notification ajoutés avec succès" });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout des paramètres de notification de l'utilisateur" });
      console.log(error);
  }
}
  