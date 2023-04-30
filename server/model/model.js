const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    date: {
        type:String,
        required:true
    },
    income: Number,
    profit: Number,
    settled: String
})

const livesDb = mongoose.model('livesdb', schema);

module.exports = livesDb;