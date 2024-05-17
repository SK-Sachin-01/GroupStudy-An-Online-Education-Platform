const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res) => {
    try{
        const {sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Section Properties not filled"
            })
        }

        const newSection = await Section.create({sectionName});

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success: true,
            message: "Section created Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Unable to create Section"
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        const {sectionName,sectionId} = req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "Section Properties not filled"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Section can't update due to some errors, please try again"
        })
    }
}

exports.deleteSection = async(req,res) => {
    try{
        const {sectionId} = req.body;

        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Section can't delete due to some errors, please try again"
        })
    }
}