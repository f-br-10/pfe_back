const express = require('express');
const fournisseur = express.Router();
const {createFournisseur,getFournisseurById, getAllFournisseurs,deleteFournisseur,assignServicesToFournisseur,getFournisseursWithServicesCount} = require('../controller/fournisseurController');
const { verifyToken } = require('../verifyToken.js');


fournisseur.post('/create', verifyToken, createFournisseur);

fournisseur.get('/:id', getFournisseurById);

fournisseur.get('/', verifyToken, getAllFournisseurs);

// fournisseur.patch('/:id', verifyTokenAndAdmin, updateFournisseur);

fournisseur.delete('/:id', verifyToken, deleteFournisseur);

fournisseur.patch('/assignServicesToFournisseur', verifyToken, assignServicesToFournisseur);

fournisseur.get('/service-distribution', getFournisseursWithServicesCount);

module.exports = fournisseur;
