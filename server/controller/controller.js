var livesDb = require('../model/model');

//create new live
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

    //new live
    const live = new livesDb({
        date: req.body.date,
        income: req.body.income,
        profit: req.body.profit,
        settled: req.body.settled
    });

    //save live to db
    live
        .save(live)
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
    livesDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
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
    livesDb.findByIdAndDelete(id)
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
    livesDb.find()
        .then(lives=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : lives
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

//return live
exports.getLive = (req,res) => {
    const id = req.params.id;
    livesDb.findById(id)
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