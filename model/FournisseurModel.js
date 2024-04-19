import mongoose from "mongoose";

//Create table for fournisseur
const fournisseurSchema = new mongoose.Schema({

    idfournisseur: { type: Number, required: true, unique: true }, 
    nom: { type: String, required: true },
    num: { type: Number, required: true },
    type_de_service: { type: String, required: true },

}, );

const fournisseur = mongoose.model('fournisseur', fournisseurSchema);
export default fournisseur;