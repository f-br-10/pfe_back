const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    num: { type: String, required: true },
    image: { type: String, required: false },
    isAdmin: { type: Boolean, required: false, default: false },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] // Référence vers les services associés à l'utilisateur
}, {
    timestamps: true // for date
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
