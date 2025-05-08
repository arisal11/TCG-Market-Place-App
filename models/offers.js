const mongoose = require('mongoose');
const Schema = mongoose.Schema

const offerSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    itemId: {type: Schema.Types.ObjectId, ref:'Item'},
    amount: {type: Number, required: [true, 'price is required'], 
        min: [0.01, 'minimum price is 0.01']},
    status: {type: String, enum: ['Pending', 'Rejected', 'Accepted'], default: 'Pending'},
});

module.exports = mongoose.model('Offers', offerSchema);