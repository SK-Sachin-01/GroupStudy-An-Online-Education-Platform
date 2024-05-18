const Category = require("../models/Category");

exports.createCategory = async(req,res) => {
    try{
        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
        
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })        
        
        return res.status(200).json({
            success: true,
            message: "Category created Successfully",
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating Category",
        })
    }
}


exports.showAllCategories = async(req,res) => {
    try{
        const allCategories = await Category.find({},{name:true, description: true})
        
        return res.status(200).json({
            success: true,
            message: "All Categories returned Successfully",
            data: allCategories,
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

exports.categoryPageDetails = async (req, res) => {
    try {
        const {categoryId} = req.body;
        const selectedCategory = await Category.findById(categoryId)
                                        .populate("courses")
                                        .exec();
        
        if(!selectedCategory) {
            return res.status(404).json({
                success:false,
                message:'Data Not Found',
            });
        }

        const differentCategories = await Category.find({
                                        _id: {$ne: categoryId},
                                        })
                                        .populate("courses")
                                        .exec();

                                        
        return res.status(200).json({
            success:true,
            data: {
                selectedCategory,
                differentCategories,
            },
        });
    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}