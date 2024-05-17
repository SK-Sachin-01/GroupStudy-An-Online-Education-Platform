const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

exports.resetPasswordToken = async(req,res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({email: email});
    
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Your email is not registered with us"
            })
        }
    
        const token = crypto.randomUUID();
    
        const updatedDetails = await User.findOneAndUpdate(
            {email:email}, 
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}
        );
    
        const url = `http://localhost:3000/update-password/${token}`
    
        await mailSender(email,"Reset Password",`Password Reset link: ${url}`);
    
        return res.status(200).json({
            success: true,
            message: "Email Sent successfully, please check email and change Password",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went Wrong while Resetting the password",
        })
    }
}


exports.resetPassword = async(req,res) => {
    try{
        const {password, confirmPassword, token} = req.body;
    
        if(password !== confirmPassword){
            return res.status(500).json({
                success: false,
                message: "Password Do Not Match"
            })
        }
        
        const userDetails = await User.findOne({token: token});
        
        if(!userDetails){
            return res.status(500).json({
                success: false,
                message: "Invalid Token"
            })
        }
        
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(500).json({
                success: false,
                message: "Token expires, please regenerate your token"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        )
        
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Issue in Password Reset"
        })
    }
}