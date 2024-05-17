const Tag = require("../models/Tag");

exports.createTag = async(req,res) => {
    try{
        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })        
        
        return res.status(200).json({
            success: true,
            message: "Tag created Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating Tags",
        })
    }
}


exports.showAllTags = async(req,res) => {
    try{
        const allTags = await Tag.find({},{name:true, description: true})
        
        return res.status(200).json({
            success: true,
            message: "All Tags returned Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all Tags",
        })
    }
}