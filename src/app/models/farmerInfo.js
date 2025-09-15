import mongoose from "mongoose";
const farmerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    lang:{
        type:String
    },
    queries:[{
        type:String,
        required:true
    }]
})
const fInfo = mongoose.models.fInfo || mongoose.model("fInfo",farmerSchema);
export default fInfo;