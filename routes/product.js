const express=require("express");
const router=express.Router();
const formidable=require("formidable");
const _ = require("lodash");
const fs = require("fs");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.cloud_name, 
  api_secret: process.env.cloud_name
});

const Product = require("../models/products");

router.post("/product/create",[auth,isAdmin],(req,res) => {
    let form = new formidable.IncomingForm();
    console.log('form............',form)
    form.keepExtensions=true;
    console.log(req.body);
    form.parse(req, (err,fields,files) =>{
        if(err){
            return res.status(400).json({error:"Image could not be uploaded"})
        }
        console.log(fields);
        console.log('files',files);
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }
        let product = new Product(fields);

        if(files.photo){
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            console.log("files.photo.path",files.photo.path);
            cloudinary.uploader.upload(files.photo.path,function(result){
                console.log("cloudinary url",result.secure_url);
                product.photo.data=result.secure_url;
                product.photo.contentType=files.photo.type;
                product.save((err,result) => {
                    console.log(result);
                    if(err){
                        return res.status(400).json({error:err.msg});
                    }
                    return res.json(result);
            })
            })
            // product.photo.data = fs.readFileSync(files.photo.path);
            
        }

       
    })
})





router.get("/product/:productId",async (req,res) => {
    try{
    const product = await Product.findById({_id:req.params.productId});
    return res.json(product);
    }catch(err){
        console.log(err);
        return res.status(400).json({error:"Error occured"});
    }
})

router.delete("/product/:productId",auth,async (req,res) => {
    try{
        const product = await Product.findById({_id:req.params.productId});
        await product.remove();
        return res.json("product deleted successfully");
        }catch(err){
            console.log(err);
            return res.status(400).json({msg:"Error occured"});
        }
});

router.put("/product/:productId",auth,async (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, (err,fields,files) =>{
        if(err){
            return res.status(400).json({msg:"Image could not be uploaded"})
        }
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

    Product.findByIdAndUpdate({_id:req.params.productId},fields,(err,product) => {
        if(err){
            console.log(err);
        }else{
            console.log(product);
        if(files.photo){
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType=files.photo.type;
            product.save((err,result) => {
                if(err){
                    return res.status(400).json({error:err.msg});
                }
                return res.json(result);
        })
    }
    }
})
       
    })
});

router.get("/products",(req,res) => {
    var order= req.query.order ? req.query.order:"asc";
    var sortBy=req.query.sortBy ? req.query.sortBy : "_id";
    var limit=req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .exec((err,product) => {
        if(err){
            return res.status(400).json({error:"Product not found"});
        }
        return res.json(product);
    })
})

router.post("/products/by/search",(req,res) => {
    var order= req.body.order ? req.body.order:"asc";
    var sortBy=req.body.sortBy ? req.body.sortBy : "_id";
    var limit=req.body.limit ? parseInt(req.body.limit) : 100;
    var skip =parseInt(req.body.skip);
    var findArgs = {};

     console.log(order, sortBy, limit, skip, req.body.filters);
     console.log("findArgs", findArgs);

     for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][req.body.filters[key].length-2],
                    $lte: req.body.filters[key][req.body.filters[key].length-1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
     console.log("finalargs",findArgs);

     Product.find(findArgs)
     .populate("category")
     .sort([[sortBy,order]])
     .skip(skip)
     .limit(limit)
     .exec((err,data) => {
        if(err){
            console.log(err);
            return res.status(400).json({error:"Product not found"});
        }else{
            return res.json({
                size:data.length,
                data
            })
        }
     })

})


router.get("/products/related/:productId",async (req,res) => {
    try{
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    const product = await Product.findOne({_id:req.params.productId});

    const products = await Product.find({_id : {$ne : product._id},category:product.category}).limit(limit).populate("category").exec();
    if(products.length == 0){
        return res.status(400).json({
            error: 'Products not found'
        });
    }
    return res.json(products);
}catch(err){
    console.log(err);
    return res.status(400).json("Server error");
}
});


router.get("/products/categories",auth,(req,res) => {
    Product.distinct("category",{},(err,categories) => {
        if(err){
            return res.status(400).json({
                error:"No categories found"
            })
            console.log(categories);
            return res.json(categories);
        }
    })
})


router.get("/product/photo/:productId", async (req,res,next) => {
    const product = await Product.findOne({_id:req.params.productId});

    if(product.photo.data){
        res.set("Content-type",product.photo.contentType);
        // console.log(product.photo.data);
        return res.json({url:product.photo.data});
    }
    next();
});


router.get("/products/search",async (req,res) => {
    const query = {};

    if(req.query.search){
        query.name={$regex:req.query.search , $options:'i'};
        if(req.query.category && req.query.category != "All"){
            query.category = req.query.category;
        }
    

    Product.find(query,(err,products) => {
        if(err){
            return res.status(400).json({error:err.msg})
        }
        res.json(products);
    })
}
})
module.exports=router;