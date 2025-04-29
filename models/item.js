const mongoose = require('mongoose');
const Schema = mongoose.Schema

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    condition: {type: String, required: [true, 'condition is required'], 
        enum: ['New', 'Like New', 'Good', 'Used', 'Other']},
    price: {type: Number, required: [true, 'price is required'], 
        min: [0.01, 'minimum price is 0.01'], },
    details: {type: String, required: [true, 'details is required'], 
        minLength: [20, 'content should have atleast 20 characters']},
    image: {type: String, required: [true, 'an image is required'],
        match: [/^[\w-]+\.(jpeg|jpg|png)$/, 'Invalid image file format. Allowed formats: jpg, jpeg, png']},
    active: {type: Boolean, default:true},
    totalOffers: {type: Number, default:0},
    highestOffer: {type: Number, default:0}
});

module.exports = mongoose.model('Item', itemSchema);
