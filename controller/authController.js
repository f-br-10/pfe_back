//authController.js
const User = require("../model/userModel.js");
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
//Controller for Register User
exports.registerUser = async (req, res) => {
  const newUser = new User({
    iduser: req.body.iduser,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(), //for hashed pass
    nom: req.body.nom || "Not Added",
    prenom: req.body.prenom || "Not Added",
    num: req.body.num || "Not Added",
    image: req.body.image || "user.png",
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  } 
};

//Controller for Login User
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email
     });
    !user && res.status(401).json("we dont have this user");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Invalid Password!");

    const accessToken = jwt.sign(
      {
        _id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (error) {
    return error;
  }
};
