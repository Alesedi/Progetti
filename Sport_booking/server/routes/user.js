const express = require('express');

const {getUser, createUser, deleteUser} = require('../controllers/userController');
const {verifyAuth} = require('../controllers/loginController');

const router= express.Router();

router.get('/',verifyAuth, getUser);
router.post('/', createUser);
router.post('/delete', verifyAuth, deleteUser);

module.exports = router;