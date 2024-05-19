const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();


exports.createCourse = async(req,res) => {
    try{
        let {
			courseName,
			courseDescription,
			whatYouWillLearn,
			price,
			tag,
			category,
			status,
			instructions,
		} = req.body;

        const thumbnail = req.files.thumbnailImage;
        const userId = req.user.id;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        
        const instructorDetails = await User.findById(userId,{accountType: "Instructor"});
        
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not Found"
            })
        }
        
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category Details not Found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
			courseDescription,
			instructor: instructorDetails._id,
			whatYouWillLearn: whatYouWillLearn,
			price,
			tag: tag,
			category: categoryDetails._id,
			thumbnail: thumbnailImage.secure_url,
			status: status,
			instructions: instructions,
        })
        
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new: true}
        );

        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
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
            error: err.message,
        })
    }
}


exports.getAllCourses = async(req,res) => {
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
            data: allCourses
        })
    }
    catch(err){
        console.log(err);
        return res.status(404).json({
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
            message: "Course details found successfully",
            data:courseDetails
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}