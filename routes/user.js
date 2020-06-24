const express = require("express");
const router=express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {check,validationResult}=require('express-validator');

const User = require('../models/user');
router.post("/signup",[
    check('name','Name is required')
    .not().isEmpty(),
    check('email',"Please include a valid email").isEmail(),
    check("password","Please enter a password for 6 or more characters").isLength({min : 6})
],async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    

const {name,email,password,role} = req.body;

try{

   var  user = await User.findOne({email:email});
    
    if(user){
        return res.status(400).json({errors:[{"msg":"A user with given email already exist"}]})
    }


    user= new User({
        name,
        email,
        password,
        role
    })

    const salt= await bcrypt.genSalt(10);

    user.password=await bcrypt.hash(password,salt);
    await user.save();

//Return jsonWebtoken
const payload={
    user:{
        id:user.id
    }
}

jwt.sign(
    payload,
    process.env.JWT,
    {expiresIn:360000},
    (err,token) => {
        if(err) throw err;
        res.cookie('t', token, { expire: new Date() + 9999 });
        res.json({token})
    }
)

// persist the token as 't' in cookie with expiry date

// return response with user and token to frontend client


}
catch(err){
console.log(err.message);
res.status(500).send('Server error')
}
});


module.exports=router;