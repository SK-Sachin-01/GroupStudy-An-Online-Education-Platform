const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async(req,res) => {
    try{
        const {sectionId,title,timeDuration,description} = req.body;
        const video = req.files.videoFile;

        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: "Sub Section fields are missing"
            })
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        });

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                    subSection: SubSectionDetails._id,
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success: true,
            message: "Sub Section created Successfully",
            updatedSection
        })

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Sub Section can't be created due to some error"
        })
    }
}


exports.updateSubSection = async(req,res) => {
    try{

        const {SubSectionId,title,timeDuration,description} = req.body;
        const video = req.files.videoFile;

        if(!SubSectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: "Sub Section fields are missing"
            })
        }

        const subSection = await SubSection.findByIdAndUpdate(
            SubSectionId,
            {
                title,timeDuration,description,videoUrl
            },
            {new:true}
        );

        return res.status(200).json({
            success: true,
            message: "Sub Section Updated Successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Sub Section can't update due to some errors, please try again"
        })
    }
}

exports.deleteSubSection = async(req,res) => {
    try{
        const {SubSectionId} = req.body;

        await SubSection.findByIdAndDelete(SubSectionId);

        return res.status(200).json({
            success: true,
            message: "Sub Section deleted Successfully"
        })
    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Sub Section can't delete due to some errors, please try again"
        })
    }
}