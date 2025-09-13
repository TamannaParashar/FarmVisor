import db from "@/app/utils/db";
import fInfo from "@/app/models/farmerInfo";
import { getServerSession } from "next-auth";

export async function GET(){
const session = await getServerSession();
const email = session.user.email;
const data = await fInfo.findOne({email});
return new Response(JSON.stringify({data,message:"data has successfully been retrieved"}),{status:200,headers: { "Content-Type": "application/json" }});
}