const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

exports.createSubSection = async(req,res) => {
    try{
        const {sectionId,title,timeDuration,description} = req.body;
        const video = req.files.video;

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
        ).populate("subSection")

        return res.status(200).json({
            success: true,
            message: "Sub Section created Successfully",
            data: updatedSection
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

        const { subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)
    
        if (!subSection) {
            return res.status(404).json({
            success: false,
            message: "SubSection not found",
            })
        }
    
        if (title !== undefined) {
            subSection.title = title
        }
    
        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()

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
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
            $pull: {
                subSection: subSectionId,
            },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
    
        if (!subSection) {
            return res.status(404).json({ 
                success: false, 
                message: "SubSection not found" 
            })
        }

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