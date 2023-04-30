var expensesDb = require('../model/expenses');

//create new result
exports.create = (req,res) => {
    //validate request
    if(!req.body){
        return res
            .status(400)
            .send({
                code : 'TF',
                description : 'Failed to process transaction',
                details : `Invalid Content`
            })
    }

    //new result
    const result = new expensesDb({
        name: req.body.name,
        amount: req.body.amount,
        term: req.body.term,
        frequency: req.body.frequency,
        isLoan: req.body.isLoan,
        loanStartDate: req.body.loanStartDate,
        repeat: req.body.repeat,
        doneTerm: req.body.doneTerm
    });

    //save result to db
    result
        .save(result)
        .then(data => {
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction'
            });
        })
        .catch(err => {
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}

//pay loan
exports.payLoan = (req,res) => {
    if(!req.body){
        return res
            .status(400)
            .send({
                code : 'TF',
                description : 'Failed to process transaction',
                details : `Invalid Content`
            })
    }
    const id = req.params.id;
    expensesDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data=>{
            if(!data){
                return res
                    .status(404)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : `Cannot update ${id}`
                    })
            } else {
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly updated ${id}`,
                    body : req.body
                });
            }
        })
        .catch(err=>{
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}

//update live
exports.update = (req,res) => {
    if(!req.body){
        return res
            .status(400)
            .send({
                code : 'TF',
                description : 'Failed to process transaction',
                details : `Invalid Content`
            })
    }
    const id = req.params.id;
    expensesDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
        .then(data=>{
            if(!data){
                return res
                    .status(404)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : `Cannot update ${id}`
                    })
            } else {
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly updated ${id}`
                });
            }
        })
        .catch(err=>{
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}

//delete live
exports.delete = (req,res) => {
    const id = req.params.id;
    expensesDb.findByIdAndDelete(id)
        .then(data=>{
            if(!data){
                return res
                    .status(404)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : `Cannot delete ${id}`
                    })
            } else {
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    details : `Successfuly deleted ${id}`
                });
            }
        })
        .catch(err=>{
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}

//return lives
exports.get = (req,res) => {
    expensesDb.find()
        .then(results=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : results
            })
        })
        .catch(err=>{
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}

//filtered get
exports.getFiltered = (req,res) => {
    let filters = req.params.filters;
    let splitFilters = filters.split("-");
    let frequency = splitFilters[0]
    let isLoan  = splitFilters[1]

    if(frequency == "" && isLoan == "all"){
        expensesDb.find()
            .then(results=>{
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    data : results
                })
            })
            .catch(err=>{
                return res
                    .status(500)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : err.message || 'DB Error'
                    })
            })
    }

    if(frequency != "all" && isLoan == "all"){
        expensesDb.find({
            frequency : {
                $eq: frequency
            }
        })
            .then(results=>{
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    data : results
                })
            })
            .catch(err=>{
                return res
                    .status(500)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : err.message || 'DB Error'
                    })
            })
    }

    if(frequency == "all" && isLoan != "all"){
        expensesDb.find({
            isLoan : {
                $eq: isLoan
            }
        })
            .then(results=>{
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    data : results
                })
            })
            .catch(err=>{
                return res
                    .status(500)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : err.message || 'DB Error'
                    })
            })
    }

    if(frequency != "all" && isLoan != "all"){
        expensesDb.find({
            $and: [
                {
                    frequency : {
                        $eq: frequency
                    }
                },
                {
                    isLoan : {
                        $eq: isLoan
                    }
                }
            ]
        })
            .then(results=>{
                res.send({
                    code : 'TS',
                    description : 'Sucessfuly processed transaction',
                    data : results
                })
            })
            .catch(err=>{
                return res
                    .status(500)
                    .send({
                        code : 'TF',
                        description : 'Failed to process transaction',
                        details : err.message || 'DB Error'
                    })
            })
    }
}

//return live
exports.getLive = (req,res) => {
    const id = req.params.id;
    expensesDb.findById(id)
        .then(live=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : live
            })
        })
        .catch(err=>{
            return res
                .status(500)
                .send({
                    code : 'TF',
                    description : 'Failed to process transaction',
                    details : err.message || 'DB Error'
                })
        })
}