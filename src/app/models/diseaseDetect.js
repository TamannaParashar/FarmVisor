import mongoose from "mongoose";
const detectedDisease = new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
})
const cropDisease = mongoose.models.cropDisease || mongoose.model("cropDisease",detectedDisease)
export default cropDisease;