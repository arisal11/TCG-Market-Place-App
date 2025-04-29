const express = require('express');
const router = express.Router({mergeParams: true});
const controller = require('../controllers/offerController.js')
const {isLoggedIn, isSeller, isAuthor} = require('../middleware/auth');
const {validateOffer, validateResult} = require('../middleware/validator.js');

router.post('/', isLoggedIn, isSeller, validateOffer, validateResult, controller.makeOffer);

router.get('/offers', isLoggedIn, isAuthor, controller.getOffers);

router.post('/offers', isLoggedIn, isAuthor, controller.acceptOffer);

module.exports = router;