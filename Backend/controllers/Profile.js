const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req,res) => {
    try{
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        const id = req.user.id;

        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success: false,
                message: "Profile Fields not Filled"
            });
        }

        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await User.findById(profileId);

        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile Fields updated Successfully",
            profileDetails
        });

    }
    catch(err){
        return res.status(400).json({
            success: false,
            message: "Profile Fields can't updated due to some errors, please try again"
        });
    }
}

exports.deleteAccount = async(req,res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User not Found"
            });
        }

        await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});
        await User.findByIdAndDelete({_id: id});

        return res.status(200).json({
            success: true,
            message: "User deleted Successfully"
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Some error in deleting User"
        });
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{
        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();
 
        return res.status(200).json({
            success: true,
            message: "User data fetched Successfully"
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Some error in fetching data of User"
        });
    }
}

