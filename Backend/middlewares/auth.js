const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = (req,res,next) => {
    try{
        const token = req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer ", "") ;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            })
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is Invalid",
            })
        }

        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Something went Wrong, while verifying the token",
        })
    }
}



exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Students",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role can't verified, please try again",
        })
    }
}

exports.isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Instructors",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role can't verified, please try again",
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admins",
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User Role can't verified, please try again",
        })
    }
}