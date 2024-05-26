const Client = require('../model/ClientModel.js');
const User = require('../model/userModel.js');
const Service = require('../model/ServiceModel.js');

// Créer un nouveau client
async function createClient(req, res) {
  try {
    const newClient = await Client.create(req.body);
    return res.status(201).json(newClient);
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({ message: 'Erreur lors de la création du client' });
  }
}

// Récupérer un client par son ID
async function getClientById(req, res) {
  try {
    const client = await Client.findById(req.params.id).populate('services');
    if (!client || client.deleted) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    return res.json(client);
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du client' });
  }
}

// Récupérer tous les clients
async function getAllClients(req, res) {
  try {
    const user = req.user;
    const userFinded = await User.findById(user._id);
    if (!userFinded) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    let clients;
    if (userFinded.isAdmin) {
      clients = await Client.find({ deleted: false }).populate('services');
    } else {
      clients = await Client.find({ services: { $in: userFinded.services }, deleted: false }).populate('services');
    }
    return res.json(clients);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
  }
}

// Mettre à jour un client
async function updateClient(req, res) {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedClient || updatedClient.deleted) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    return res.json(updatedClient);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du client' });
  }
}

// Supprimer un client (soft delete)
async function deleteClient(req, res) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.deleted) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    client.deleted = true;
    await client.save();
    return res.json({ message: 'Client supprimé avec succès (soft delete)' });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du client' });
  }
}

// Assigner des services à un client
async function assignServicesToClient(req, res) {
  try {
    const { clientId, serviceIds } = req.body;

    // Vérifier si le client existe
    const client = await Client.findById(clientId);
    if (!client || client.deleted) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }

    // Vérifier si les services existent
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (!services || services.length !== serviceIds.length) {
      return res.status(404).json({ message: 'Un ou plusieurs services non trouvés' });
    }

    // Assigner les services au client
    client.services = serviceIds;
    await client.save();

    return res.status(200).json({ message: 'Services assignés au client avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'assignation des services au client:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

module.exports = {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient,
  assignServicesToClient
};
