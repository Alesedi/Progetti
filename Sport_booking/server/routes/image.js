const express = require('express');   //express sarà usato per creare app web in Node.js
const { getImageByName} = require('../controllers/imageController');  // importa la funzione dal controller delle immagini

const router = express.Router();   //crea un oggetto router che permette di definire rotte separate e modulari, gestirà richieste HTTP

// Route per ottenere un'immagine per nome
router.get('/images/:name', getImageByName);  //definisce rotta get con :name variabile , la logica di recupero sarà gestita dal controller


module.exports = router;