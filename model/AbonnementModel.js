import { Double } from "mongodb";
import mongoose from "mongoose";

//Create table for abonnement
const abonnementSchema = new mongoose.Schema({

    idabonnement: { type: Number, required: true, unique: true }, 
    iduser: { type: Number, required: true },
    nom: { type: Number, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    cout: { type: Number, required: true },
    statut: { type: String, required: true },
    nombre_abonnement: { type: Number, required: true },

}, );

const abonnement = mongoose.model('abonnement', abonnementSchema);
export default abonnement;