const express=require("express");
const router=express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const addOrderToUserHistory = require("../middleware/addOrderToUserHistory");
const decreaseQuantity = require("../middleware/decreaseQuantity");
const User = require('../models/user');
const {Order,CartItem}=require("../models/order");
const braintree = require('braintree');
require('dotenv').config();

router.post("/order/create",auth,addOrderToUserHistory,decreaseQuantity,(req,res) => {
    console.log("User",req.user);
    req.body.order.user=req.user.id;
    const order = new Order(req.body.order);
    order.save((err,data) => {
        if(err){
            console.log(err);
            return res.status(400).json({error:err.msg})
        }else{
            return res.json(data);
        }
    })
})


router.get("/order/list",auth,isAdmin,(req, res) => {
    Order.find()
        .populate('user', '_id name address')
        .sort('-createdAt')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({error:err.msg})
            }
            res.json(orders);
        });
});

router.get("/order/status-values",auth,isAdmin,(req, res) => {
    res.json(Order.schema.path('status').enumValues);
});

router.put("/order/:orderId/status",auth,isAdmin,(req, res) => {
    Order.update({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({error:err.msg})
        }
        res.json(order);
    });
});



module.exports= router;