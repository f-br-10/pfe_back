import mongoose from "mongoose";

//Create table for reclamation
const reclamationSchema = new mongoose.Schema({

    titre: { type: String, required: true },
    description: { type: String, required: true },
    statut: { type: String, required: true },
    date: { type: Date, required: true },
    
}, );

const reclamation = mongoose.model('reclamation', reclamationSchema);
export default reclamation;