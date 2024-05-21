const express = require('express');
const fournisseur = express.Router();
const {createFournisseur,getFournisseurById, getAllFournisseurs,deleteFournisseur,assignServicesToFournisseur} = require('../controller/fournisseurController');
const { verifyToken } = require('../verifyToken.js');


fournisseur.post('/create', verifyToken, createFournisseur);

fournisseur.get('/:id', verifyToken, getFournisseurById);

fournisseur.get('/', verifyToken, getAllFournisseurs);

// fournisseur.patch('/:id', verifyTokenAndAdmin, updateFournisseur);

fournisseur.delete('/:id', verifyToken, deleteFournisseur);

fournisseur.patch('/assignServicesToFournisseur', verifyToken, assignServicesToFournisseur);


module.exports = fournisseur;
