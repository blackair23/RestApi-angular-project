const { Schema, model, Types } = require('mongoose');

const listingSchema = new Schema({
    title: { type: String, required: true, minlength: [3, 'Title should be at least 3 charakters long']},
    location: { type: String, required: true, minlength: [3, 'Location should be at least 3 charakters long']},
    price: { type: Number, required: true, min: [0.01, 'Price must be a positive number']},
    description: { type: String, required: true, minlength: [10, 'Description should be at least 10 charakters long']},
    imgFile: { type: String, required: [true, 'Image URL is required!']},
    service1: { type: String},
    service2: { type: String},
    service3: { type: String},
    service4: { type: String},
    _ownerId: { type: Types.ObjectId, ref: 'User', required: true }
})

const Listing = model('Listing', listingSchema);

module.exports = Listing; 