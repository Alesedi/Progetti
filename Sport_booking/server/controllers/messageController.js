const Message = require('../models/messageModel');
const mongoose = require('mongoose');

const getMessage = async (req, res) => {   //asincrona perchè effettua chiamata al database che potreebbe richiedere tempo
  try {
    const messages = await Message.find({ matchId: req.params.matchId }).sort({ createdAt: 1 });  //prima cerca tutti i messaggii nel database che  hanno il campo match Id uguale all ID match passato come parametro URL poi li ordina in ordine cresce in base al timestap
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il recupero dei messaggi.' });
  }
};

module.exports = { getMessage };