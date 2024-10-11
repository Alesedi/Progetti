const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  matchId: {
    type: String, // Può essere ObjectId o String in base alla logica della tua applicazione
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Message', messageSchema);