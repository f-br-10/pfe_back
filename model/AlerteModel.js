import mongoose from "mongoose";

//Create table for alerte
const alerteSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true }, 
    iduser: { type: String, required: true },
    titre_de_notification: { type: Date, required: true },
    description: { type: String, required: true },
    statut: { type: String, required: true },

}, );

const alerte = mongoose.model('alerte', alerteSchema);
export default alerte;