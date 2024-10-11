const Matches = require('../models/matchesModel');
const Message = require('../models/messageModel');
const mongoose = require('mongoose');

//RECUPERA I MATCH DISPONIBILI SUL DATABASE
const getMatches = async (req, res) => {
    try {
        const matches = await Matches.find({})   //recupera tutti i match disponibili nel database
        res.status(200).json({ msg: "ok", matches: matches })
    } catch (err) {
        res.status(500).json({ msg: "error", err: err })  //errore server
    }
}

//RECUPERA I MATCH AI QUALI L'UTENTE STA PARTECIPANDO
const getUserMatches = async (req, res) => {
    const userId = req.user._id;
    try {
        const userMatches = await Matches.find({ partecipants: userId });

        res.status(200).json({ msg: "ok", matches: userMatches, joined: true });
    } catch (err) {
        res.status(500).json({ msg: "error", err: err });
    }
};

//RECUPERA I MATCH IN BASE ALLO SPORT SPECIFICATO
const getMatchSport = async (req, res) => {
    const sport = req.params.sport;
    try {
        const matches = await Matches.find({ sport: sport });

        res.status(200).json({ msg: "ok", matches: matches });
    } catch (err) {
        res.status(500).json({ msg: "error", err: err });
    }
};

//RECUPERA I MATCH CREATI DA L'UTENTE
const getMatchUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const matches = await Matches.find({ creator: userId });

        res.status(200).json({ msg: "ok", matches: matches });
    } catch (err) {
        res.status(500).json({ msg: "error", err: err });
    }
};

//CREA UN MATCH SUL DATABASE
const createMatches = async (req, res) => {
    const creator = req.user._id;
    try {
        const matches = await Matches.create({ ...req.body, creator: creator });
        res.status(201).json({ msg: "ok", matches: matches })
    } catch (err) {
        res.status(500).json({ msg: "error", err: err })
    }
}

//PERMETTE ALL'UTENTE DI ISCRIVERSI AD UN MATCH
const joinMatch = async (req, res) => {
    const matchId = req.body.matchId;
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });   //verifica se utente è già registrato
    }
    if (!matchId) {
        return res.status(400).json({ msg: "Match ID is required" });
    }

    try {
        const match = await Matches.findById(matchId);

        if (!match) {
            return res.status(404).json({ joined: false, msg: "Match not found" });
        }

        if (match.partecipants.length >= match.maxParticipants) {
            return res.status(400).json({ joined: false, msg: "Maximum participants limit reached" });
        }

        if (match.partecipants.includes(userId)) {
            return res.status(400).json({ joined: false, msg: "User already registered for this match" });
        }

        match.partecipants.push(userId);  //aggiunge utente dopo verifiche al match
        await match.save();    //salva match

        res.status(200).json({ joined: true, msg: "User successfully joined the match", match: match });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err: err });
    }
};

//PERMETTE ALL'UTENTE DI ABBANDONARE UN MATCH
const leaveMatch = async (req, res) => {
    const matchId = req.body.matchId;
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    if (!matchId) {
        return res.status(400).json({ msg: "Match ID is required" });
    }

    try {
        const match = await Matches.findById(matchId);

        if (!match) {
            return res.status(404).json({ left: false, msg: "Match not found" });
        }

        const participantIndex = match.partecipants.indexOf(userId);   //verifica che utente sia iscritto al match andando a vedere il suo indice
        if (participantIndex === -1) {
            return res.status(400).json({ left: false, msg: "User is not registered for this match" });
        }

        match.partecipants.splice(participantIndex, 1);   //rimuove utente da lista 
        await match.save();

        res.status(200).json({ left: true, msg: "User successfully left the match", match: match });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err: err });
    }
};

//PERMETTE ALL'UTENTE CREATORE DI ELIMINARE IL MATCH
const deleteMatch = async (req, res) => {
    const matchId = req.params._id;
    const userId = req.user._id; 
    console.log(matchId);

    if (!mongoose.Types.ObjectId.isValid(matchId)) {   //verifica se matchId fornito è un oggetto valido di mongoose
        return res.status(400).json({ msg: "Invalid match ID" });
    }

    try {
        const match = await Matches.findById(matchId);   //nel database trova match con quell'id

        if (!match) {
            return res.status(404).json({ msg: "Match not found" });
            
        }


        if (!match.creator.equals(userId)) {     //se utente loggato non è ugugale a creatore match
            return res.status(403).json({ msg: "Only the creator can delete this match" });
        }

        await Message.deleteMany({ matchId: matchId });   //elimina messaggi del match 

        await Matches.findByIdAndDelete(matchId);   //elimina match

        res.status(200).json({ msg: "Match and associated messages deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", err: err });
    }
};



module.exports = {
    getMatches,
    getUserMatches,
    getMatchSport,
    getMatchUser,
    createMatches,
    joinMatch,
    leaveMatch,
    deleteMatch
}