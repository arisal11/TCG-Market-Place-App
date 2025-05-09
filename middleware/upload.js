require('dotenv').config();
const multer = require('multer');
const {storage} = require('../middleware/cloudinary');
const path = require('path');
const {validateId, validateItem, validateResult} = require('../middleware/validator.js');

exports.upload = multer({ storage, 
                        limits:{fileSize: 2*1024*1024}
                        }).single('image');