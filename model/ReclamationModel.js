const mongoose = require ("mongoose");

//Create table for reclamation
const reclamationSchema = new mongoose.Schema({
    accountId:{type: String},
    canBeClosed: { type: Boolean,},
    category: {type: String,enum: ['assistance', 'billing', 'incident']},
    creationDate:  { type: Date, },
    lastMessageFrom:{type: String,enum: ['customer', 'support', 'incident']},
    product:{type: String,enum: ['adsl', 'cdn', 'dedicated' , 'dedicated-billing' , 'dedicated-other', 'dedicatedcloud', 'domain' , 'exchange' , 'fax' , 'hosting' ,'housing' , 'iaas' , 'mail' , 'network' , 'publiccloud' , 'sms' , 'ssl' , 'storage' , 'telecom-billing' , 'telecom-other' , 'vac', 'voip','vps','web','billing','web','other' ]},
    score: {type: String},
    serviceName: {type: String},
    state: {type: String,enum: ['closed', 'open', 'unknown']},
    subject: {type: String},
    ticketId:{ type: Number, },
    ticketNumber: { type: Number, },
    type:{type: String,enum: ['criticalIntervention', 'genericRequest']},
    updateDate :  { type: Date, },
    
}, );

const reclamation = mongoose.model('reclamation', reclamationSchema);
module.exports = reclamation;

