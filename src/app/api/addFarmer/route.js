import db from "@/app/utils/db"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fInfo from "@/app/models/farmerInfo";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req){
    const session = await getServerSession(authOptions);
    const name = session.user.name;
    const email = session.user.email;

    try{
    const {query,lang,loca,desp,humidity,temp} = await req.json();
    const farmer = await fInfo.findOneAndUpdate({email},{$setOnInsert:{name,email},$push:{queries:query}},
    {new:true,upsert:true});
    
    // Gemini AI call
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `
        You are a helpful farming assistant. A farmer from "${loca}" has asked a question.
        The current weather there is:
        - Temperature: ${temp}°C
        - Humidity: ${humidity}%
        - Conditions: ${desp}

        Please answer the following question in the language: "${lang}"

        Question: ${query}
        `;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const aiResp = await response.text();

    return new Response(JSON.stringify({success: true,ans:aiResp,text:query,farmer}), {status: 201,
    headers: { "Content-Type": "application/json" },})
  }catch(e){
    console.log("Error answer to your text query",e);
    return new Response(JSON.stringify({message:"Cannot get your query answered"}),{status:400,headers: { "Content-Type": "application/json" },});
  }
}