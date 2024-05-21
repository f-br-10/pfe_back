const mongoose = require ("mongoose");

//Create table for fournisseur
const fournisseurSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] 

}, );

const fournisseur = mongoose.model('fournisseur', fournisseurSchema);
module.exports = fournisseur;