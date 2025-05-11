require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

console.log(process.env.CLOUDINARY_URL)

cloudinary.config({
    url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'battlebinder',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

module.exports = {
    cloudinary,
    storage
}