const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const {validatorSignUp, validateLogin, validateResult} = require('../middleware/validator')

const router = express.Router();

router.get('/new', isGuest, controller.new);
router.get('/login', isGuest, controller.login);
router.get('/profile', isLoggedIn, controller.profile);
router.post('/', isGuest, validatorSignUp, validateResult, controller.createUser);
router.post('/login', isGuest, validateLogin, validateResult, controller.loginUser);
router.get('/logout', isLoggedIn, controller.logOut);

module.exports = router;