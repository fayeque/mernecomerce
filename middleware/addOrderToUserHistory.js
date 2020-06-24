const User = require('../models/user');

module.exports = function(req,res,next){
    const history=[];
    req.body.order.products.forEach((item) => {
        history.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category:item.category,
            quantity:item.count,
            amount:req.body.order.amount
        })
    });

    User.findOneAndUpdate({_id:req.user.id},{$push:{history:history}},{new:true},(err,data) => {
        if(err){
            console.log(err);
            return res.status(400).json({error:err.msg});
        }
        next();
    })

}