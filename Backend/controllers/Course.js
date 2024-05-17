const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/imageUploader");
require("dotenv").config();


exports.createCourse = async(req,res) => {
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,tag} = req.body;
        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnailImage){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not Found"
            })
        }
        
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details not Found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })
        
        await User.findById(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true}
        );
        
        return res.status(200).json({
            success:true,
            message:"Course created Successfully",
            data: newCourse
        })
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Failed to create Course",
            error: error.message,
        })
    }
}


exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},
            {
                courseName:true,
                price: true,
                thumbnail: true,
                instructor: true,
                ratingAndReviews: true,
                studentsEnrolled: true,
            }).populate("instructor").exec();
        
        return res.status(200).json({
            success: true,
            message: "All Courses returned Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
        })
    }
}


exports.getCourseDetails = async(req,res) => {
    try{
        const {courseId} = req.body;

        const courseDetails = await Course.find(
            {_id:courseId})
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails"
                    }
                }
            )
            .populate("category")
            .populate(
                {
                    path:"courseContent",
                    populate:{
                        path:"subSection"
                    }
                }
            )
            .populate("ratingAndReviews")
            .exec();

        
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: "Could not find the course with given Course ID"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course details found successfully"
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}