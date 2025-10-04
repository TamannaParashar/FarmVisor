import db from "@/app/utils/db"
import cropDisease from "@/app/models/diseaseDetect";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req){
    try{
    const data = await req.json();
    const detection = new cropDisease({name: data.class});
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = await genAI.getGenerativeModel({model : "models/gemini-2.5-flash"})
    const prompt = `
    You are an expert agricultural advisor.

    A farmer has detected a crop disease called "${data.class}". 
    Provide clear, concise, and practical advice for a farmer in simple language.

    Respond in ${data.lang === 'en' ? 'English' : data.lang === 'hi' ? 'Hindi' : 'Kannada'}.

    Include the following details:
    1. **Disease Name and Description**: What it is, how it affects the crop.
    2. **Cure**: Step-by-step actions to treat the disease.
    3. **Precautions**: How to prevent it in the future.
    4. **Danger Level**: Severity and urgency of action.

    Format the response clearly so that a farmer can easily understand and follow it. Use simple words and practical tips suitable for small-scale farming.
`;

    const result = await model.generateContent([prompt])
    const response = result.response
    const aiResp = await response.text()
    await detection.save();
    return Response.json({message:"Detected crop disease added to database sucessfully",cropDiseaseResp:aiResp},{status:200});
    }catch(e){
        return Response.json({error:"error saving detected crop disease"},{status:400});
    }
}