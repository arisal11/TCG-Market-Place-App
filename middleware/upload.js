const multer = require('multer');
const path = require('path');
const {validateId, validateItem, validateResult} = require('../middleware/validator.js');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

exports.upload = multer({ storage, 
                        limits:{fileSize: 2*1024*1024}
                        }).single('image');