import mongoose from "mongoose";

//Create table for notifications
const notificationsSchema = new mongoose.Schema({

    id: { type: Number, required: true, unique: true }, 
    userId: { type: mongoose.Types.ObjectId, ref:"User" },
    titre_de_notification: { type: Date, required: true },
    description: { type: String, required: true },
    statut: { type: String, required: true },

}, );

const notifications = mongoose.model('notifications', notificationsSchema);
export default notifications;