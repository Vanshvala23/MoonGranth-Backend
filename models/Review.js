import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true});
export default mongoose.model("Review",reviewSchema);