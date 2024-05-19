//userController.js
const User = require("../model/userModel.js");
const Service = require('../model/ServiceModel');
const CryptoJS = require('crypto-js');

//Controller for update User info
exports.updateUser = async (req, res) => {
  try {
      const user = req.user;
      const file = req.file;
      if (file) {
          req.body.image = file.filename;
          if(user.image) {
            deleteFile(path.join(__dirname, `../uploads/${user.image}`));
          }
      }
      const userFinded = await User.findByIdAndUpdate(user._id, { $set: req.body },{new:true});
      //if user exists
      if (!userFinded) {
          return res.status(500).json({ message: "User not found" });
      }
      return res.status(200).json(userFinded);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
}

//Controller for update Password
exports.updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
        !user && res.status(401).json('Wrong credentials!');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.oldPassword && res.status(401).json('The old password is not correct!');

        if (req.body.newPassword === req.body.repeatNewPassword) {

            user.password = CryptoJS.AES.encrypt(req.body.newPassword, process.env.PASS_SEC).toString();
            await user.save();
            return res.status(201).json("Password changed successfully!");

        } else {
            return res.status(500).json("Passwords Don't Match!");
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

//Controller for delete Account or User
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(200).json("User has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
}

//Controller for update User image
exports.updateImage = async (req, res) => {
    const user = req.user;
    try {
        await User.findByIdAndUpdate(user._id, {
            $set: {
                image: req.body.image
            },
        }, { new: true });
        return res.status(200).json("Image has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }

}

//Controller for Get all User
exports.getAllUsers = async (req, res) => {
    const users = await User.find();

    return res.send(users);
}


exports.getProfile = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à partir de req.user
        const userId = req.user._id;
        // Rechercher l'utilisateur dans la base de données en utilisant son ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Retourner les informations de l'utilisateur
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//Controller for count Users
exports.countUsers = async (req, res) => {
    try {
        const countAllUsers = await User.countDocuments();
        return res.status(200).json({ count: countAllUsers });
    } catch (error) {
        return res.status(500).json(error);
    }
}

// Fonction pour attribuer des services disponibles à un utilisateur
exports.assignServicesToUser = async (req, res) => {
    try {
        const { userId, serviceIds } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérifier si les services existent
        const services = await Service.find({ _id: { $in: serviceIds } });
        if (!services || services.length !== serviceIds.length) {
            return res.status(404).json({ message: 'One or more services not found' });
        }

        // Assigner les services à l'utilisateur
        user.services = serviceIds;
        await user.save();

        return res.status(200).json({ message: 'Services assigned to user successfully' });
    } catch (error) {
        console.error('Error assigning services to user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
