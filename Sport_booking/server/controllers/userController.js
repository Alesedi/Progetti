const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//RECUPERA LE INFORMAZIONI DELL'UTENTE
const getUser = async (req, res) => {
    const userId = req.user._id;   //id utente è preso dalla richiesta
    try {
        const user = await User.findById(userId)
        res.status(200).json({ msg: "Ecco l'utente: ", user: user })
    } catch (err) {
        res.status(500).json({ msg: "error", err: err })
    }
}

//PERMETTE DI CREARE UN UTENTE
const createUser = async (req, res) => {
    try {
        const user = await User.create({ ...req.body })   //crea nuovo utente prendendo i dati dalla richiesta
        console.log(user);
        res.status(201).json({ success:true ,msg: "Creato", user: user })
    } catch (err) {
        res.status(500).json({ msg: "error", err: err })
    }
}

//PERMETTE DI ELIMINARE UN UTENTE
const deleteUser = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword } = req.body;

    console.log(userId);
    console.log(currentPassword);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Utente non trovato', success: false });
        }

        const isPassEqual = await bcrypt.compare(currentPassword, user.password);
        if (!isPassEqual) {
            return res.status(400).json({ wrongPass: true, msg: 'La password attuale non è corretta', success: false });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            msg: 'Account eliminato con successo',
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Errore durante l\'eliminazione dell\'account', success: false });
    }
};


module.exports = {
    getUser,
    createUser,
    deleteUser,

}