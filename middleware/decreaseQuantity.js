const Product = require('../models/products');

module.exports = function(req,res,next){
// req.body.order.products.forEach((product) => {
//     Product.findById(product._id).select("-photo").exec((err,data) => {
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("data is",data);
//             data.sold=parseInt(data.sold)+parseInt(product.count);
//             data.quantity=data.quantity - product.count;
//             data.save((err,res) => {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     console.log("ghjhgjh",res);
//                 }
//             })
//         }
//     })
// })
// next();
let bulkOps = req.body.order.products.map(item => {
    return {
        updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -item.count, sold: +item.count } }
        }
    };
});

Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
        return res.status(400).json({
            error: 'Could not update product'
        });
    }
    next();
});
}