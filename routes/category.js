const express=require("express");
const router=express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const Category = require("../models/category");

const Product = require("../models/products");

router.post("/category/create",[auth,isAdmin],async (req,res) => {
    try{
        const {name}=req.body
    const category = new Category({name:name});
    await category.save();

    return res.status(200).json({category});
    }catch(err){
        console.log(err);
        return res.status(400).json({error:"Some thing went wrong"});
    }
})

router.get('/category/:categoryId', auth,async (req,res) => {
    try{
    const category = await Category.findById(req.params.categoryId);
    return res.json(category);
    }catch(err){
        console.log(err);
        return res.status(400).json({error:'Server error'});
    }
});

router.put("/category/:categoryId",[auth,isAdmin],async (req,res) => {
    try{
        const category=await Category.findById({_id:req.params.categoryId});
        category.name=req.body.name;
        await category.save();
        console.log(category);
       return res.json(category);

    }catch(err){
        console.log(err);
        return res.status(400).json({error:"Server error"});
    }
});

router.delete("/category/:categoryId",[auth,isAdmin],async (req,res) => {
    try{
        const category=await Category.findOne({_id:req.params.categoryId});
        console.log(category);
        const product = await Product.find({category:req.params.categoryId});

        if(product.length > 1){
            return res.status(500).json({error:`Sorry. You cant delete ${category.name}. It has ${product.length} associated products.`})
        }
        await category.remove(req.params.categoryId);
        // await category.save();
        res.json({error:"category deleted successfully"});

    }catch(err){
        console.log(err);
        return res.status(400).json({error:'Server error'});
    }
});

router.get("/categories",async (req,res) => {
    try{
    const categories= await Category.find({});
    return res.json(categories);
    }catch(err){
        console.log(err);
        return res.status(400).json({error:'Server error'});
    }
})

module.exports=router;