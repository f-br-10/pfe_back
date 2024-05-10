//AbonnementModel.js
const mongoose = require("mongoose");

//Create table for abonnement
const abonnementSchema = new mongoose.Schema({

    nom: { type: Number, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    cout: { type: Number, required: true },
    statut: { type: String, required: true },

}, );

const abonnement = mongoose.model('abonnement', abonnementSchema);
module.exports = abonnement;