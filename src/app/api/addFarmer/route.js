import db from "@/app/utils/db"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import fInfo from "@/app/models/farmerInfo";

export async function POST(req){
    const session = await getServerSession(authOptions);
    const name = session.user.name;
    const email = session.user.email;
    const data = new fInfo({name,email});
    await data.save();
    return new Response(JSON.stringify({ success: true, farmer: data }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  })
}