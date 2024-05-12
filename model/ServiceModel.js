const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    cout: { type: Number, required: true },
    statut: { type: String, required: true },
    fournisseur: { type: String, required: true },
    typesdeservice: { type: String, required: true }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
