const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    amount: {
        type:Number,
        required:true
    },
    term: {
        type:Number,
        required:true
    },
    frequency: {
        type:Number,
        required:true
    },
    isLoan: {
        type:String,
        required:true
    },
    doneTerm: {
        type:Number,
        required:true
    },
    loanStartDate: String,
    repeat: {
        type:String,
        required:true
    }
})

const expenses = mongoose.model('expenses', schema);

module.exports = expenses;