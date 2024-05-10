//userController.js
const User = require("../model/userModel.js");
const CryptoJS = require('crypto-js');

//Controller for update User info
exports.updateUser = async (req, res) => {
    try {
        const user = req.user;
        const userFinded = await User.findByIdAndUpdate(user._id, { $set: req.body },{new:true});
        //if user exists
        if (!userFinded) {
            return res.status(500).json({ message: "User not found" });
        }
        res.status(200).json(userFinded);
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
            res.status(201).json("Password changed successfully!");

        } else {
            res.status(500).json("Passwords Don't Match!");
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

//Controller for delete Account or User
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
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
        res.status(200).json("Image has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }

}

//Controller for Get all User
exports.getAllUsers = async (req, res) => {
    const users = await User.find();

    res.send(users);
}

//Controller for count Users
exports.countUsers = async (req, res) => {
    try {
        const countAllUsers = await User.countDocuments();
        res.status(200).json({ count: countAllUsers });
    } catch (error) {
        return res.status(500).json(error);
    }
}