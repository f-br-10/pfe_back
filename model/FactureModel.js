import mongoose from "mongoose";

//Create table for facture
const factureSchema = new mongoose.Schema({

    date: { type: Date, required: true },
    montant: { type: Number, required: true },
    statut: { type: String, required: true },

}, );

const facture = mongoose.model('facture', factureSchema);
export default facture;