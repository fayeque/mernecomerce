const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    // Get token from header
    const token=req.header('x-auth-token');

    //check if no token
    if(!token){
        return res.status(401).json({error:"No token,authorization denied"});
    }

    //verify token
    try{
        const decoded=jwt.verify(token,process.env.JWT);
        req.user=decoded.user;
        next()
    }catch(err){
        res.status(401).json({error:"Token is not valid"});

    }
};