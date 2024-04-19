import mongoose from "mongoose";

//Create table for service
const servicecloudSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true }, 
    nom: { type: String, required: true },
    fournisseur: { type: String, required: true },
    typesdeservice: { type: String, required: true },
    
}, );

const servicecloud = mongoose.model('servicecloud', servicecloudSchema);
export default servicecloud;