import db from "@/app/utils/db"
import feedback from "@/app/models/feedback";

export async function POST(req){
    const {feedbackText} = await req.json();
    const addFeedback = new feedback({feedbackText})
    await addFeedback.save();
    return new Response(JSON.stringify({ message: "Feedback saved successfully" }),{ status: 200 });
}