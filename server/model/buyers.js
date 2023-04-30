const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    liveId: {
        type:String,
        required:true
    },
    firstName: {
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    mos: String,
    mop: String,
    dop: String,
    total: Number,
    profit: Number
})

const buyers = mongoose.model('buyers', schema);

module.exports = buyers;