import db from "@/app/utils/db"
import cropDisease from "@/app/models/diseaseDetect";

export async function POST(req){
    try{
    const data = await req.json();
    const detection = new cropDisease({name: data.class});
    await detection.save();
    return Response.json({message:"Detected crop disease added to database sucessfully"},{status:200});
    }catch(e){
        return Response.json({error:"error saving detected crop disease"},{status:400});
    }
}