const User = require("../models/user");

module.exports= async function(req,res,next){
    const user = await User.findById(req.user.id)
    if(user && user.role==0){
       return res.json("Not admin! acess denied");
    }
    next();
}