var livesDb = require('../model/model');
var buyers = require('../model/buyers');
var purchases = require('../model/purchases');

//create new buyer
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

    //new buyer
    const buyer = new buyers({
        liveId: req.body.liveId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mos: req.body.mos,
        mop: req.body.mop,
        dop: req.body.dop,
        total: req.body.total,
        profit: req.body.profit
    });

    //save buyer to db
    buyer
        .save(buyer)
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

//delete buyer
exports.delete = (req,res) => {
    const id = req.query.id;
    buyers.findByIdAndDelete(id)
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
                //delete purchases of this buyer
                purchases.deleteMany({buyerId : id})
                    .then(data=>{
                        if(!data){
                            return res
                                .status(404)
                                .send({
                                    code : 'TF',
                                    description : 'Failed to process transaction',
                                    details : `Cannot delete purchases of buyer ${id}`
                                })
                        } else {
                            //update income of the live
                            livesDb.findByIdAndUpdate(req.query.liveId, { $inc: {income : -Math.abs(req.query.total)}}, { useFindAndModify:false })
                                .then(data=>{
                                    if(!data){
                                        return res
                                            .status(404)
                                            .send({
                                                code : 'TF',
                                                description : 'Failed to process transaction',
                                                details : `Cannot update income of live ${req.query.liveId}`
                                            })
                                    } else {
                                        //update profit of the live
                                        livesDb.findByIdAndUpdate(req.query.liveId, { $inc: {profit : -Math.abs(req.query.profit)}}, { useFindAndModify:false })
                                        .then(data=>{
                                            if(!data){
                                                return res
                                                    .status(404)
                                                    .send({
                                                        code : 'TF',
                                                        description : 'Failed to process transaction',
                                                        details : `Cannot update profit of live ${req.query.liveId}`
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
                    })
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

//return buyers
exports.get = (req,res) => {
    const liveId = req.params.liveId;
    buyers.find({liveId : liveId})
        .then(buyers=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : buyers
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

//return buyers
exports.getSingle = (req,res) => {
    const id = req.params.id;
    buyers.findById(id)
        .then(buyers=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : buyers
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