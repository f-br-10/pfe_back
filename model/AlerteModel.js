//AlerteModel.js

const mongoose = require('mongoose');

const alerteSchema = new mongoose.Schema({
  serviceId: {type: mongoose.Schema.Types.ObjectId,ref: 'Service', required: true  },
  userId: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  message: {type: String,required: true},
  createdAt: {type: Date,default: Date.now},
  statut: {type: String,enum: ['unread', 'read', 'processed'], default: 'unread'}
});

const Alerte = mongoose.model('Alerte', alerteSchema);

module.exports = Alerte;






/*import mongoose from "mongoose";

//Create table for alerte
const alerteSchema = new mongoose.Schema({

    userId: { type: mongoose.Types.ObjectId, ref:"User" },
    serviceId: { type: mongoose.Types.ObjectId, ref:"Service" },
    titre_de_notification: { type: Date, required: true },
    description: { type: String, required: true },
    statut: { type: String, required: true },

}, );

const alerte = mongoose.model('alerte', alerteSchema);
export default alerte;
*/