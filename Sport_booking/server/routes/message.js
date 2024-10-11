const express = require('express');

const {getMessage} = require('../controllers/messageController');  //importa funzione getMessage dal controller  dei messaggi


const router= express.Router();


router.get('/:matchId', getMessage); //:matchId parametro dinamico



module.exports = router;