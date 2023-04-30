const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    code: {
        type:String,
        required:true
    },
    capital: {
        type:Number,
        required:true
    },
    retail: {
        type:Number,
        required:true
    },
    discount: {
        type:String,
        required:true
    },
    profit: Number,
    owner: {
        type:String,
        required:true
    },
    commission: Number,
    liveId: {
        type:String,
        required:true
    },
    buyerId: {
        type:String,
        required:true
    }
})

const purchases = mongoose.model('purchases', schema);

module.exports = purchases;