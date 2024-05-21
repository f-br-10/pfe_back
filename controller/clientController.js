const Client = require('../model/ClientModel.js');
const User = require('../model/userModel.js');
const Service = require('../model/ServiceModel.js');

// Créer un nouveau fournisseur
async function createClient(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    const newClient = await Client.create(req.body);
    return res.status(201).json(newClient);
  } catch (error) {
    console.error('Erreur lors de la création du Client:', error);
    res.status(500).json({ message: 'Erreur lors de la création du Client' });
  }
}

// Récupérer un Client par son ID
async function getClientById(req, res) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    return res.json(client);
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du client' });
  }
}

// Récupérer tous les client
async function getAllClients(req, res) {
  try {
    const clients = await Client.find();
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
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    return res.json(updatedClient);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du Client:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du Client' });
  }
}

// Supprimer un fournisseur
async function deleteClient(req, res) {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    return res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du Client:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du Client' });
  }
}


async function assignServicesToClient (req, res)  {
    try {
        const { clientId, serviceIds } = req.body;

        // Vérifier si le client existe
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Vérifier si les services existent
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (!services || services.length !== serviceIds.length) {
            return res.status(404).json({ message: 'One or more services not found' });
        }

        // Assigner les services au client
        client.services = serviceIds;
        await client.save();

        return res.status(200).json({ message: 'Services assigned to client successfully' });
    } catch (error) {
        console.error('Error assigning services to client:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient, 
  assignServicesToClient
};
