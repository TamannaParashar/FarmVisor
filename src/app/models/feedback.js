import mongoose  from "mongoose"

const newFeedback = new mongoose.Schema({
    feedbackText:{
        type: String
    }
})

const feedback = mongoose.models.feedback || mongoose.model("feedback",newFeedback)
export default feedback