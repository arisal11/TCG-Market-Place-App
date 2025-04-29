const express = require('express');
const controller = require('../controllers/itemController');
const offerRoutes = require('../routes/offerRoutes.js')
const router = express.Router();
const { upload } = require('../middleware/upload');
const {isLoggedIn, isAuthor} = require('../middleware/auth');
const {validateId, validateItem, validateResult} = require('../middleware/validator.js');

router.get('/', controller.index);

router.get('/new', isLoggedIn, controller.new);

router.get('/:id', validateId, controller.show);

router.post('/', isLoggedIn, upload, validateItem, validateResult, controller.create);

router.get('/:id/edit', isLoggedIn, validateId, isAuthor, controller.edit);

router.put('/:id',isLoggedIn, validateId, isAuthor, upload, validateItem, validateResult, controller.update);

router.delete('/:id', isLoggedIn, validateId, isAuthor, controller.delete);

router.use('/:id', offerRoutes);

module.exports = router;