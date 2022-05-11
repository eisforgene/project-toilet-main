const { Schema, model } = require('mongoose');

const toiletSchema = new Schema({
    coordinates: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true,
    },
    lat: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true,
        trim: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

const Toilet = new model('Toilet', toiletSchema);

module.exports = Toilet;