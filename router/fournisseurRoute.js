const express = require('express');
const fournisseur = express.Router();
const {createFournisseur,getFournisseurById, getAllFournisseurs,updateFournisseur,deleteFournisseur,assignServicesToFournisseur} = require('../controller/fournisseurController');
const { verifyTokenAndAdmin } = require('../verifyToken.js');


fournisseur.post('/create', verifyTokenAndAdmin, createFournisseur);

fournisseur.get('/:id', verifyTokenAndAdmin, getFournisseurById);

fournisseur.get('/', verifyTokenAndAdmin, getAllFournisseurs);

fournisseur.patch('/:id', verifyTokenAndAdmin, updateFournisseur);

fournisseur.delete('/:id', verifyTokenAndAdmin, deleteFournisseur);

fournisseur.patch('/assignServicesToFournisseur', verifyTokenAndAdmin, assignServicesToFournisseur);


module.exports = fournisseur;
