const User = require("../models/User");
const OTP = require("../models/OTP.JS");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();



// Send OTP
exports.sendOTP = async(req,res) => {
    try{
        const {email} = req.body;
    
        const checkUserPresent = await User.findOne({email});
    
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            })
        }
        
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        const result = await OTP.findOne({otp: otp});
        
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
    
            result = await OTP.findOne({otp: otp});
        }
        
        const otpPayload = {email,otp};
        
        const otpBody = await OTP.create(otpPayload);
        
        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Issue in OTP generator"
        })
    }
}


// Signup
exports.signUp = async(req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message:"All Fields are Required !!!"
            })
        }
        
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message:"Password and Confirm-Password do not match"
            })
        }

        // Finding if user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            })
        }
        
        
        const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(-1); 
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message:'OTP not Found',
            })
        }
        else if(otp !== recentOtp.otp) {
            return res.status(400).json({
                success:false,
                message:'Invalid OTP',
            })
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:'Error in hashing password',
            })
        }

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        res.status(200).json({
            success:true,
            message:"User Registered Successfully"
        });
    }

    catch(error){
        console.error(error);
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User can't be registered, please try again later"
        })
    }
}


// Login
exports.login = async(req,res) => {
    try{

        const {email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'Plz fill all the details',
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:'User not Registered',
            })
        }

        const payload = {
            email : user.email,
            id : user._id,
            accountType : user.accountType,
        }

        if(await bcrypt.compare(password, user.password)){

            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"2h"});

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }

          res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user,
                message:"User Logged In successfully",
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:'Incorrect Password',
            })
        }

    }

    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        })
    }
}