const express = require('express');
const {verifyAuth} = require('../controllers/loginController');

const {getMatches, getUserMatches, getMatchSport, getMatchUser, createMatches, joinMatch, leaveMatch, deleteMatch} = require('../controllers/matchesController');

const router= express.Router();

router.get('/', getMatches);
router.get('/user', verifyAuth, getUserMatches);
router.get('/sport/:sport', getMatchSport);
router.get('/creator/',verifyAuth, getMatchUser);
router.post('/',verifyAuth, createMatches);
router.post('/join', verifyAuth, joinMatch);
router.post('/leave', verifyAuth, leaveMatch);
router.delete('/delete/:_id', verifyAuth, deleteMatch);

module.exports = router;