var express = require('express');
var router = express.Router();

const controller = require('../server/controller/controller');
const buyers = require('../server/controller/buyers');
const purchases = require('../server/controller/purchases');
const lottery = require('../server/controller/results');
const expenses = require('../server/controller/expenses');


router.get('/', function(req, res, next) {
    res.send({message : 'API is working properly'});
})

router.get('/ubp', function(req, res, next) {

    let arrayBody = req.body;
    let output = [];
    arrayBody.forEach(element => {
        output.push(element.code)
    });

    res.send({message : output});
})

router.get('/ubp/diff', function(req, res, next) {
    let arrayExisting = req.body.existing;
    let arrayProdList = req.body.prodList;
    let output = [];
    arrayProdList.forEach(element => {
        let exist = arrayExisting.indexOf(element);
        if(exist == -1){
            output.push(element)
        }
    });
    res.send({message : output});
})

router.get('/romanNumerals', function(req, res, next) {
    if(req.body.number){
        let input = req.body.number;
        let output = '';
        var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},i;
        for ( i in lookup ) {
            while ( input >= lookup[i] ) {
                output += i;
                input -= lookup[i];
            }
        }
        res.send({result : output});
    } else {
        res.send({result : 'No Input!'});
    }
})

router.get('/getDates', function(req, res, next) {
    const { JsonCalendar } = require('json-calendar')
    const calendar = new JsonCalendar({ today: new Date(2022, 10, 1) });
    //const calendar = new JsonCalendar();
    //res.send({result : calendar});
    //res.send({result : calendar.weeks.map(w => w.map(d => d.day))}); // get days array
    res.send({result : calendar}); // get days in month
})

router.get('/getTasks/nov', function(req, res, next) {

    let format = (val) => {
        return (val).toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
        })
    }

    var calculate = function(bank, payment, balance, rate, callback){
        let result = {
            "bank" : bank,
            "balance" : format(balance),
            "interest(ma)" : rate,
            "monthlyPayment" : format(payment),
            "result" : [],
            "payments" : []
        }
        let pushTran = (month, outstandingBalance, payment, interest, newBalance) => {
            result.payments.push({
                month : month,
                outstandingBalance : format(outstandingBalance),
                payment : format(payment),
                interest : format(interest),
                newBalance : format(newBalance)
            })
        }
        let cc = function(bal, paymentTotal, interestTotal, m){
            let interest, chargedBal, newBalance;
            if(bal === 0){
                result.result.push({
                    "months" : m + " months to pay", 
                    "paymentTotal" : format(paymentTotal),
                    "interestTotal" : format(interestTotal)
                })
                //return res.send(result);
                return callback({ paymentTotal, interestTotal, result });
            }
            if(bal < payment){
                interest = 0;
                chargedBal = bal + interest;
                newBalance = 0;
                pushTran(m + 1, bal, bal, interest, newBalance);
                return cc(newBalance, paymentTotal + bal, interestTotal + interest, m + 1);
            }
            
            interest = bal * rate;
            chargedBal = bal + interest;
            newBalance = chargedBal - payment;
            pushTran(m + 1, bal, payment, interest, newBalance);
            return cc(newBalance, paymentTotal + payment, interestTotal + interest, m + 1);
        }
        cc(balance, 0, 0, 0)
    }

    let finalResult = {
        totalBalance : 0,
        totalMonthlyPayment : 0,
        totalPaymentPayed: 0,
        totalInterestPayed: 0,
        creditCards : []
    }

    for(let body of req.body){
        let bank = body.bank;
        let payment = body.payment;
        let balance = body.balance;
        let rate = body.rate;
        calculate(bank, payment, balance, rate, result => {
            finalResult.totalBalance += balance
            finalResult.totalMonthlyPayment += payment
            finalResult.totalPaymentPayed += result.paymentTotal;
            finalResult.totalInterestPayed += result.interestTotal;
            finalResult.creditCards.push(result.result);
        });
    }
    finalResult.totalBalance = format(finalResult.totalBalance)
    finalResult.totalMonthlyPayment = format(finalResult.totalMonthlyPayment)
    finalResult.totalPaymentPayed = format(finalResult.totalPaymentPayed);
    finalResult.totalInterestPayed = format(finalResult.totalInterestPayed);
    res.send(finalResult)
    // res.send({result : {
    //         "month" : "November",
    //         "weeks": [
    //             [
    //                 {
    //                     "className": "",
    //                     "id": "day1667145600000",
    //                     "day": 31,
    //                     "date": "2022-10-30T16:00:00.000Z",
    //                     "monthIndex": 9,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "HOLIDAY",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day today",
    //                     "id": "day1667232000000",
    //                     "day": 1,
    //                     "date": "2022-10-31T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",  
    //                     "sprint": "161",
    //                     "tasks": "HOLIDAY",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667318400000",
    //                     "day": 2,
    //                     "date": "2022-11-01T16:00  :00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667404800000",
    //                     "day": 3,
    //                     "date": "2022-11-02T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667491200000",
    //                     "day": 4,
    //                     "date": "2022-11-03T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-sprint review -finacle 11 testing",
    //                     "blocker": "none"
    //                 }
    //             ],
    //             [
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667750400000",
    //                     "day": 7,
    //                     "date": "2022-11-06T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-sprint planning -finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667836800000",
    //                     "day": 8,
    //                     "date": "2022-11-07T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1667923200000",
    //                     "day": 9,
    //                     "date": "2022-11-08T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-mid sprint alignment -finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668009600000",
    //                     "day": 10,
    //                     "date": "2022-11-09T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-finacle 11 testing -update sandbox extraction : update email subject",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668096000000",
    //                     "day": 11,
    //                     "date": "2022-11-10T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "161",
    //                     "tasks": "-sprint review -finacle 11 testing",
    //                     "blocker": "none"
    //                 }
    //             ],
    //             [
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668355200000",
    //                     "day": 14,
    //                     "date": "2022-11-13T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "162",
    //                     "tasks": "-sprint planning -finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668441600000",
    //                     "day": 15,
    //                     "date": "2022-11-14T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "162",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668528000000",
    //                     "day": 16,
    //                     "date": "2022-11-15T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "162",
    //                     "tasks": "VL",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668614400000",
    //                     "day": 17,
    //                     "date": "2022-11-16T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "162",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668700800000",
    //                     "day": 18,
    //                     "date": "2022-11-17T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "162",
    //                     "tasks": "-sprint review -finacle 11 testing -update customer bills payment v3 and v4",
    //                     "blocker": "none"
    //                 }
    //             ],
    //             [
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1668960000000",
    //                     "day": 21,
    //                     "date": "2022-11-20T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "163",
    //                     "tasks": "-sprint planning -finacle 11 testing -update customer bills payment v3",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669046400000",
    //                     "day": 22,
    //                     "date": "2022-11-21T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "163",
    //                     "tasks": "-finacle 11 testing -update customer bills payment v4",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669132800000",
    //                     "day": 23,
    //                     "date": "2022-11-22T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "163",
    //                     "tasks": "-mid sprint alignment -finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669219200000",
    //                     "day": 24,
    //                     "date": "2022-11-23T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "163",
    //                     "tasks": "-finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669305600000",
    //                     "day": 25,
    //                     "date": "2022-11-24T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "163",
    //                     "tasks": "-sprint review -finacle 11 testing",
    //                     "blocker": "none"
    //                 }
    //             ],
    //             [
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669564800000",
    //                     "day": 28,
    //                     "date": "2022-11-27T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "164",
    //                     "tasks": "-sprint planning -finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669651200000",
    //                     "day": 29,
    //                     "date": "2022-11-28T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "164",
    //                     "tasks": "- finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "month-day",
    //                     "id": "day1669737600000",
    //                     "day": 30,
    //                     "date": "2022-11-29T16:00:00.000Z",
    //                     "monthIndex": 10,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "164",
    //                     "tasks": "HOLIDAY",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "",
    //                     "id": "day1669824000000",
    //                     "day": 1,
    //                     "date": "2022-11-30T16:00:00.000Z",
    //                     "monthIndex": 11,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "164",
    //                     "tasks": "- finacle 11 testing",
    //                     "blocker": "none"
    //                 },
    //                 {
    //                     "className": "",
    //                     "id": "day1669910400000",
    //                     "day": 2,
    //                     "date": "2022-12-01T16:00:00.000Z",
    //                     "monthIndex": 11,
    //                     "year": 2022,
    //                     "project": "UBP External",
    //                     "sprint": "164",
    //                     "tasks": "- finacle 11 testing",
    //                     "blocker": "none"
    //                 }
    //             ]
    //         ]
    //     }
    // });
})

//get expenses
router.get('/api/expenses/get', expenses.get)

//get expenses
router.get('/api/expenses/get/filtered/:filters', expenses.getFiltered)

//add expenses
router.post('/api/expenses/add', expenses.create)

//pay loan
router.put('/api/expenses/loan/pay/:id', expenses.payLoan)

//add delete
router.delete('/api/expenses/delete/:id', expenses.delete)

//get lottery
router.get('/api/lottery/get', lottery.get)

//add lottery
router.post('/api/lottery/add', lottery.create)

//delete lottery
router.delete('/api/lottery/delete/:id', lottery.delete)

//add live
router.post('/api/lives/add', controller.create)

//update live
router.put('/api/lives/update/:id', controller.update)

//delete live
router.delete('/api/lives/delete/:id', controller.delete)

//get lives
router.get('/api/lives/get', controller.get)

//get live
router.get('/api/lives/get/:id', controller.getLive)

//add buyer
router.post('/api/lives/buyers/add', buyers.create)

//delete buyer
router.delete('/api/lives/buyers/delete/', buyers.delete)

//get buyers
router.get('/api/lives/buyers/get/:liveId', buyers.get)

//get buyer
router.get('/api/lives/buyers/get/single/:id', buyers.getSingle)

//add purchase
router.post('/api/lives/buyers/purchases/add', purchases.create)

//get purchases
router.get('/api/lives/buyers/purchases/get/:id', purchases.get)

//delete purchase
router.delete('/api/lives/buyers/purchases/delete/', purchases.delete)

//delete purchase
router.get('/api/lives/sellers/earnings/', purchases.getOwnerEarnings)


module.exports = router;