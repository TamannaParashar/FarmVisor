import db from "@/app/utils/db"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fInfo from "@/app/models/farmerInfo";

export async function POST(req){
    const session = await getServerSession(authOptions);
    const name = session.user.name;
    const email = session.user.email;
    const {query} = await req.json();
    const farmer = await fInfo.findOneAndUpdate({email},{$setOnInsert:{name,email},$push:{queries:query}},
    {new:true,upsert:true});
    return new Response(JSON.stringify({success: true,text:query,farmer}), {status: 201,
    headers: { "Content-Type": "application/json" },
  })
}