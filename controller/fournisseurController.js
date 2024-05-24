const Fournisseur = require('../model/FournisseurModel.js'); 
const User = require('../model/userModel.js');
const Service = require('../model/ServiceModel.js');


// Créer un nouveau fournisseur
async function createFournisseur(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    const newFournisseur = await Fournisseur.create(req.body);
    return res.status(201).json(newFournisseur);
  } catch (error) {
    console.error('Erreur lors de la création du fournisseur:', error);
    res.status(500).json({ message: 'Erreur lors de la création du fournisseur' });
  }
}

// Récupérer un fournisseur par son ID
async function getFournisseurById(req, res) {
  try {
    const fournisseur = await Fournisseur.findById(req.params.id);
    if (!fournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    return res.json(fournisseur);
  } catch (error) {
    console.error('Erreur lors de la récupération du fournisseur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du fournisseur' });
  }
}

// Récupérer tous les fournisseurs
async function getAllFournisseurs(req, res) {
  try {
    const user = req.user;
    const userFinded = await User.findById(user._id);
    if(!userFinded) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if(userFinded.isAdmin) {
      const fournisseurs = await Fournisseur.find().populate("services");
      return res.json(fournisseurs);
    } else {
      const fournisseurs = await Fournisseur.find({services: { $in: userFinded.services }}).populate("services");
      return res.json(fournisseurs);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des fournisseurs:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des fournisseurs' });
  }
}

async function updatedFournisseur(req,res) {
  try {
    const fornisseur = await Fournisseur.findByIdAndUpdate(req.params.id,{ $set: req.body },{ new: true });
    if(!fornisseur) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    return res.json(fornisseur);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du fournisseur' });
  }
}

// Supprimer un fournisseur
async function deleteFournisseur(req, res) {
  try {
    const deletedFournisseur = await Fournisseur.findByIdAndDelete(req.params.id);
    if (!deletedFournisseur) {
      return res.status(404).json({ message: 'Fournisseur non trouvé' });
    }
    return res.json({ message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du fournisseur:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du fournisseur' });
  }
}

async function assignServicesToFournisseur (req, res)  {
    try {
        const { fournisseurId, serviceIds } = req.body;
        // Vérifier si le fournisseur existe
        const fournisseur = await Fournisseur.findById(fournisseurId);
        if (!fournisseur) {
            return res.status(404).json({ message: 'Fournisseur not found' });
        }

        // Vérifier si les services existent
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (!services || services.length !== serviceIds.length) {
            return res.status(404).json({ message: 'One or more services not found' });
        }

        // Assigner les services au fournisseur
        fournisseur.services = serviceIds;
        await fournisseur.save();

        return res.status(200).json({ message: 'Services assigned to fournisseur successfully' });
    } catch (error) {
        console.error('Error assigning services to fournisseur:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



async function getFournisseursWithServicesCount(req, res) {
  try {
      const fournisseurs = await Fournisseur.aggregate([
          {
              $lookup: {
                  from: 'services',
                  localField: 'services',
                  foreignField: '_id',
                  as: 'ournisseurServices'
              }
          },
          {
              $project: {
                  nom: 1,
                  servicesCount: { $size: '$fournisseurServices' }
              }
          }
      ]);
      res.status(200).json(fournisseurs);
  } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des fournisseurs', error });
  }
}
module.exports = {
  createFournisseur,
  getFournisseurById,
  getAllFournisseurs,
  deleteFournisseur,
  assignServicesToFournisseur,
  getFournisseursWithServicesCount,
  updatedFournisseur
};
