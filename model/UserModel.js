const mongoose = require("mongoose");

//Create table for User
const UserSchema = new mongoose.Schema({

    iduser: { type: String, required: true, unique: true }, 
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    num: { type: String, required: true },
    image: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false }

}, {
    timestamps: true //for date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;