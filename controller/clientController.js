const Service = require('../model/ServiceModel');
const Client = require('../model/ServiceModel');
const User = require('../model/userModel');


assignServicesToUser = async (req, res) => {
    try {
        const { clientId, serviceIds } = req.body;

        // Vérifier si l'utilisateur existe
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Vérifier si les services existent
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (!services || services.length !== serviceIds.length) {
            return res.status(404).json({ message: 'One or more services not found' });
        }

        // Assigner les services à l'utilisateur
        client.services = serviceIds;
        await client.save();

        return res.status(200).json({ message: 'Services assigned to client successfully' });
    } catch (error) {
        console.error('Error assigning services to user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function createClient  (req, res) {
  const newClient = new Client();

  try {
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(500).json(error);
  } 
};



 
module.exports = {
  createClient
};




























/*
async function createClient(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      const servicesToSave = [];
      for(const service of req.body.services) {
        const serviceFind = await Service.findById(service)
        if(!serviceFind) return res.status(404).json({message:"service not found"});
        servicesToSave.push(serviceFind);
      }
      const newClient = await Client.create({...req.body, services:servicesToSave});
      user.Clients.push(newClient._id);
      await Client.save();
      return res.status(201).json(newClient);
    } catch (error) {
      console.error('Erreur lors de la création du Client:', error);
      res.status(500).json({ message: 'Erreur lors de la création du Client' });
    }
  }
  
  async function getClientById(req, res) {
    try {
      const Client = await Client.findById(req.params.id);
      if (!Client) {
        return res.status(404).json({ message: 'Client non trouvé' });
      }
      return res.json(Client);
    } catch (error) {
      console.error('Erreur lors de la récupération du Client:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du Client' });
    }
  }
  
  async function getAllClients(req, res) {
    try {
      const clients = await Client.find();
      return res.json(clients);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des clients' });
    }
  }
  
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





  async function createclient(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
      const newClient = await Service.create(req.body);
      user.clients.push(newClient._id);
      await user.save();
      return res.status(201).json(newClient);
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      res.status(500).json({ message: 'Erreur lors de la création du service' });
    }
  }
   
  
module.exports = {
    createClient,
    getClientById,
    getAllClients,
    updateClient,
    deleteClient
  };
  */
  