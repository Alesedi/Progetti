const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({    //crea schema mongoose
    sport: {
        type: String,
        required: true,
        enum: ['Calcio', 'Basket', 'Beach Volley', 'Ping Pong']
    },
    title: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'   //object id che punta al modello User
    },
    date: {
        type: Date,
        required: true
    },
    partecipants: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    maxParticipants: {
        type: Number,
        defaultValue: 0
    }
})

matchSchema.pre('save', function(next) {  //middleware che si attiva prima che un nuovo match sia salvato nel database
    if (this.isNew) { // Controlla se il documento è nuovo
        switch (this.sport) {
            case 'Calcio':
                this.maxParticipants = 22; // 11 giocatori per squadra
                break;
            case 'Basket':
                this.maxParticipants = 10; // 5 giocatori per squadra
                break;
            case 'Beach Volley':
                this.maxParticipants = 12; // 6 giocatori per squadra
                break;
            case 'Ping Pong':
                this.maxParticipants = 2; // 1 contro 1
                break;
            default:
                this.maxParticipants = 10; // Valore di default
                break;
        }
    }
    next();
});

matchSchema.pre('find', async function(next) {
    try {
        const Match = mongoose.model('Match')
        await Match.deleteMany({ date: { $lt: new Date() } });   //elimina da database tutti i match la cui data è già passata
        next();
    } catch (error) {  //in caso di errore, passa errore a funzione next
        next(error);
    }
});



module.exports = mongoose.model('Match', matchSchema);   //esporta modello Match basato su matchSchema