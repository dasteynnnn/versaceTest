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

    //new purchase
    const purchase = new purchases({
        code: req.body.code,
        capital: req.body.capital,
        retail: req.body.retail,
        discount: req.body.discount,
        profit: req.body.profit,
        owner: req.body.owner,
        commission: req.body.commission,
        liveId: req.body.liveId,
        buyerId: req.body.buyerId
    });
    const retail = parseInt(req.body.retail);
    const profit = parseInt(req.body.profit) + parseInt(req.body.commission);
    //save purchase to db
    purchase
        .save(purchase)
        .then(data => {
            //update income of the live
            livesDb.findByIdAndUpdate(req.body.liveId, { $inc: {income : retail}}, { useFindAndModify:false })
                .then(data=>{
                    if(!data){
                        return res
                            .status(404)
                            .send({
                                code : 'TF',
                                description : 'Failed to process transaction',
                                details : `Cannot update income of live ${req.body.liveId}`
                            })
                    } else {
                        //update profit of the live
                        livesDb.findByIdAndUpdate(req.body.liveId, { $inc: {profit : profit}}, { useFindAndModify:false })
                        .then(data=>{
                            if(!data){
                                return res
                                    .status(404)
                                    .send({
                                        code : 'TF',
                                        description : 'Failed to process transaction',
                                        details : `Cannot update profit of live ${req.body.liveId}`
                                    })
                            } else {
                                //update total of the buyer
                                buyers.findByIdAndUpdate(req.body.buyerId, { $inc: {total : retail}}, { useFindAndModify:false })
                                .then(data=>{
                                    if(!data){
                                        return res
                                            .status(404)
                                            .send({
                                                code : 'TF',
                                                description : 'Failed to process transaction',
                                                details : `Cannot update total of buyer ${req.body.buyerId}`
                                            })
                                    } else {
                                        //update profit from the buyer
                                        buyers.findByIdAndUpdate(req.body.buyerId, { $inc: {profit : profit}}, { useFindAndModify:false })
                                        .then(data=>{
                                            if(!data){
                                                return res
                                                    .status(404)
                                                    .send({
                                                        code : 'TF',
                                                        description : 'Failed to process transaction',
                                                        details : `Cannot update total of buyer ${req.body.buyerId}`
                                                    })
                                            } else {
                                                res.send({
                                                    code : 'TS',
                                                    description : 'Sucessfuly processed transaction'
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

//return purchases
exports.get = (req,res) => {
    const buyerId = req.params.id;
    purchases.find({buyerId : buyerId})
        .then(purchases=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : purchases
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

//delete purchase
exports.delete = (req,res) => {
    const id = req.query.id;
    purchases.findByIdAndDelete(id)
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
                let profit = parseInt(req.query.profit) + parseInt(req.query.commission);
                //update income of the live
                livesDb.findByIdAndUpdate(req.query.liveId, { $inc: {income : -Math.abs(req.query.retail)}}, { useFindAndModify:false })
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
                            livesDb.findByIdAndUpdate(req.query.liveId, { $inc: {profit : -Math.abs(profit)}}, { useFindAndModify:false })
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
                                    //update total of buyer
                                    buyers.findByIdAndUpdate(req.query.buyerId, { $inc: {total : -Math.abs(req.query.retail)}}, { useFindAndModify:false })
                                    .then(data=>{
                                        if(!data){
                                            return res
                                                .status(404)
                                                .send({
                                                    code : 'TF',
                                                    description : 'Failed to process transaction',
                                                    details : `Cannot update total of buyer ${req.query.buyerId}`
                                                })
                                        } else {
                                            //update profit from buyer
                                            buyers.findByIdAndUpdate(req.query.buyerId, { $inc: {profit : -Math.abs(profit)}}, { useFindAndModify:false })
                                            .then(data=>{
                                                if(!data){
                                                    return res
                                                        .status(404)
                                                        .send({
                                                            code : 'TF',
                                                            description : 'Failed to process transaction',
                                                            details : `Cannot update profit from buyer ${req.query.buyerId}`
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

//return sellers earnings
exports.getOwnerEarnings = (req,res) => {
    const liveId = req.query.liveId;
    purchases.aggregate([ { $match: { "liveId": liveId } }, { $group: { "_id": "$owner", "income" : {$sum: "$retail"}, "profit" : {$sum: "$profit"}, "commission" : {$sum: "$commission"}, "soldItems" : {$sum: 1} } }, { $sort: { "soldItems": -1 } } ])
        .then(purchases=>{
            res.send({
                code : 'TS',
                description : 'Sucessfuly processed transaction',
                data : purchases
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