const express = require('express');   //importa express usato per gestire server web

const {loginUser, verifyAuth, logoutUser, checkAuth, changePassword} = require('../controllers/loginController');

const router= express.Router();  //crea un nuovo router express, un'istanza di router e mini applicazione che gestisce rotte specifiche



router.post('/', loginUser);   //rotta che permette di eseguire login
router.get('/', checkAuth);  //controlla se utente è autenticato controllando il token JWT presente nei cookie
router.post('/logout', logoutUser);   //elimina cookie JWT
router.post('/change-password', verifyAuth,changePassword)


module.exports = router;   //esporta router in modo tale chhe possa essere usato nel file principale dell'applicazione, ciò permette di aggiungere il routing per la gestione delle autenticazioni e delle sessioni utente all'applicazione