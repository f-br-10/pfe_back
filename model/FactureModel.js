/* const mongoose = require ("mongoose");

//Create table for factureSchema
const factureSchema = new mongoose.Schema({
    billId: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    orderId: { type: String, required: true },
    password: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    priceWithTax:{ { type: String, required: true },
    currencyCode  { type: String, required: true },
    priceInUcents { type: String, required: true },
    text { type: String, required: true },
    value { type: String, required: true }},
    email: { type: String, required: true },
    email: { type: String, required: true },
    email: { type: String, required: true },
    email: { type: String, required: true },
    email: { type: String, required: true },
    email: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }] 

}, );
/*{
  "billId": "string",
  "category": "autorenew",
  "date": "2024-05-22T14:01:49.327Z",
  "orderId": 0,
  "password": "string",
  "pdfUrl": "string",
  "priceWithTax": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "priceWithoutTax": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "tax": {
    "currencyCode": "AUD",
    "priceInUcents": 0,
    "text": "string",
    "value": 0
  },
  "url": "string"
}*//*
const facture = mongoose.model('facture', factureSchema);
module.exports = facture;


*/