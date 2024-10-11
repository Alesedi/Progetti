const User = require('../models/userModel');
const bcrypt = require('bcrypt');  //usato per crittografare password
const jwt = require('jsonwebtoken');  //importa il jsonwebtoken usato per generare e verificare i token JWT per gestire autenticazione

//LOGIN
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;   //estrae username e password dal corpo della richiesta
        const user = await User.findOne({ username });   //cerca utente con stesso username nel database
        if (!user) {
            return res.status(400).json({ msg: 'Username o password non validi', success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(400).json({ msg: 'Username o password non validi', success: false });
        }
        const jwtToken = jwt.sign(     //genera un token JWT con informazioni utente usando una chiave segreta
            { username: user.username, _id: user._id },
            process.env.JWT_SECRET,        //chiave segretaa
            { expiresIn: '12h' }  //scadenza token
        );
        res.cookie("jwtToken", jwtToken, {    //imposta il cookie chiamato come il token, accessibile solo con HTTP
            sameSite: 'strict',
            httpOnly: true,  //accessibile solo così
            secure: false, 
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 12)  //imposta la scadenza in ore
        }).json({     //invia risposta di successo
            msg: 'Login eseguito con successo',
            success: true,
            username: user.username
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Errore durante il login', success: false });
    }
};

//ENDPOINT
const checkAuth = async (req, res) => {     //funzione asincrona che verifica la presenza di un token JWT nei cookie della richiesta
    try {
        const token = req.cookies.jwtToken;    //crea token uguale al cookie creato
        if (!token) {
            return res.json({ authenticated: false, message: "Token non presente" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);     //decodedToken è una decodifica del token tramite chiave
        if (decodedToken) {
            const user = await User.findOne({ _id: decodedToken._id });    //se il token è valido restituisce un utente cercato nel database con quel id
            if (user) {
                return res.json({        //risposta json
                    authenticated: true,  
                    message: "Autenticazione riuscita",
                    user: {
                        username: user.username,
                        _id: user._id, 
                    }
                });
            } else {
                return res.json({ authenticated: false, message: "Utente non trovato" });
            }
        } else {
            return res.json({ authenticated: false, message: "Token non valido" });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json({ authenticated: false, message: "Errore interno al server" });   //mi risponde con json
    }
};

//MIDDLEWARE
const verifyAuth = async (req, res, next) => {    //middleware che verifica autenticazione utente

    try {
        const token = req.cookies.jwtToken;    //creo token nel cookie
        if (!token) {
            return res.json({ authenticated: false, message: "error", error: "Token non presente" });
        }
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET)
        if (decodedToken) {      //se l'utente è autenticato
            const user = await User.findOne({ _id: decodedToken._id })   //imposta user per richieste successive
            if (user) {
                req.user = user;    //assegna req.user che permetterà all'utente di fare delle operazioni

                next();
            } else {
                res.json({ authenticated: false, message: "error", error: "Utente non trovato" })
            }
        } else {
            res.json({ authenticated: false, message: "error", error: "Token non valido" })
        }
    } catch (e) {
        console.log(e);
        res.json({ authenticated: false, message: "error", error: e });
    }
}

const logoutUser = (req, res) => {
    try {
        // Cancella il cookie jwtToken impostando un valore vuoto e un'esperienza già scaduta
        res.cookie('jwtToken', '', {
            expires: new Date(0),
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });

        res.status(200).json({
            msg: 'Logout eseguito con successo',
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Errore durante il logout',
            success: false
        });
    }
};

const changePassword = async (req, res) => {
    const userId = req.user._id   
    const { currentPassword, newPassword } = req.body;  //estrae ID utente e password dal corpo della richiesta
    console.log(userId)
    console.log(currentPassword)
    console.log(newPassword)

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'Utente non trovato', success: false });
        }

        // Confronta la password corrente con quella salvata nel database
        const isPassEqual = await bcrypt.compare(currentPassword, user.password);
        if (!isPassEqual) {
            return res.status(400).json({ wrongPass: true, msg: 'La password attuale non è corretta', success: false });
        }


        // Aggiorna la password nel database
        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            msg: 'Password cambiata con successo',
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Errore durante il cambio della password', success: false });
    }
};






module.exports = { loginUser, checkAuth, verifyAuth, logoutUser, changePassword, };