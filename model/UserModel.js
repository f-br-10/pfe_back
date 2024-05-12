const mongoose = require("mongoose");

//Create table for User
const UserSchema = new mongoose.Schema({

    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    num: { type: String, required: true },
    image: { type: String, required: false },
    isAdmin: { type: Boolean, required: false, default: false }

}, {
    timestamps: true //for date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;