const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    result: {
        type:String,
        required:true
    },
    winners: {
        type:Number,
        required:true
    },
    date: String
})

const results = mongoose.model('results', schema);

module.exports = results;