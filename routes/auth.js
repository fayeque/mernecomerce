const express = require("express");
const router=express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {check,validationResult}=require('express-validator');

const User = require("../models/user")

router.get("/",auth,async (req,res) => {
    try{
        const user= await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/signin",[
    check('email',"Please include a valid email").isEmail(),
    check("password","Please enter a valid password").exists()
],async (req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    

const {email,password} = req.body;

try{

   var  user = await User.findOne({email:email});
    
    if(!user){
        return res.status(400).json({errors:[{"msg":"Invalid credentials"}]});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({errors:[{"msg":"Invalid credentials"}]});
    }

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
            res.json({token,user})
        }
    )
    


// const token = jwt.sign({ _id: user._id }, process.env.JWT);
// // persist the token as 't' in cookie with expiry date
// res.cookie('t', token, { expire: new Date() + 9999 });
// // return response with user and token to frontend client
// const { _id, name, email, role } = user;
// return res.json({ token, user: { _id, email, name, role } });

}
catch(err){
console.log(err.message);
res.status(500).send('Server error')
}

}
)

router.get("/secret",[auth,isAdmin],(req,res) => {
    res.json(req.user);
})

router.get("/logout",(req,res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
});


module.exports=router;
