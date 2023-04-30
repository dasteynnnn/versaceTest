var resultsDb = require('../model/results');

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
    const result = new resultsDb({
        result: req.body.result,
        winners: req.body.winners,
        date: req.body.date
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
    resultsDb.findByIdAndUpdate(id, req.body, { useFindAndModify:false })
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
    resultsDb.findByIdAndDelete(id)
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
    resultsDb.find()
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

//return live
exports.getLive = (req,res) => {
    const id = req.params.id;
    resultsDb.findById(id)
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