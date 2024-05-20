const mongoose = require ("mongoose");

//Create table for fournisseur
const fournisseurSchema = new mongoose.Schema({

    nom: { type: String, required: true },
    num: { type: Number, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]

}, );

const fournisseur = mongoose.model('fournisseur', fournisseurSchema);
export default fournisseur;
