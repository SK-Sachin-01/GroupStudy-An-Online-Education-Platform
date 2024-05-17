const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async(req,res) => {
    const {course_id} = req.body;
    const userId = req.user.id;

    if(!course_id){
        return res.status(403).json({
            success: false,
            message: "Please provide valid Course ID"
        })
    }

    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.status(403).json({
                success: false,
                message: "Couldn't find the course with given Course ID"
            })
        }
        
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled"
            })
        }
        
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }


    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount*100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId
        }
    }

    try{
        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Could not initiate Order"
        })
    }
}


exports.verifySignature = async(req,res) => {
    
    const signature = req.headers["x-razorpay-signature"];
    
    const webhookSecret = "12345678";
    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try{
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {
                    $push:{
                        studentsEnrolled: userId,
                    }
                },
                {new:true}
            );

            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Could not Found"
                })
            }


            const enrolledStudent = await User.findOneAndUpdate(
                {_id: userId},
                {
                    $push:{
                        courses: courseId,
                    }
                },
                {new:true}
            );


            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Course Registration Successfull",
                "Congo, You are onboarded into new Course"
            )

            return res.status(200).json({
                success: true,
                message: "Signature verified and course added",
            })

        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    else{
        return res.status(400).json({
            success: false,
            message: "Invalid Request"
        });
    }

}