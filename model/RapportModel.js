import mongoose from "mongoose";

//Create table for rapport
const rapportSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true }, 
    contenu: { type: String, required: true },
    date: { type: Date, required: true },
}, );

const rapport = mongoose.model('rapport', rapportSchema);
export default rapport;