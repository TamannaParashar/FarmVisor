import db from "@/app/utils/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { spawn } from "child_process"
import fInfo from "@/app/models/farmerInfo"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const formData = await req.formData()
    const file = formData.get("file")
    const location = formData.get("location");
    const weather = JSON.parse(formData.get("weather"));

    const email = await session.user.email;
    
    // Save uploaded file
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(process.cwd(), "uploads")
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

    const filePath = path.join(uploadDir, `${Date.now()}-farmer_audio.wav`)
    fs.writeFileSync(filePath, buffer)

    // Run whisper via Python child process
    const transcription = await new Promise((resolve, reject) => {
      const outputDir = path.join(process.cwd(), "uploads")

      // Normalize paths for Windows
      const normalizedPath = filePath.replace(/\\/g, "/")
      const normalizedOutputDir = outputDir.replace(/\\/g, "/")

      const py = spawn("python", [
        "-m", "whisper",
        normalizedPath,
        "--model", "base",
        "--language", "en",
        "--fp16", "False",
        "--output_format", "txt",
        "--output_dir", normalizedOutputDir,
      ])

      let error = ""

      py.stderr.on("data", (data) => {
        error += data.toString()
      })

      py.on("close", (code) => {
        if (code === 0) {
          try {
            const txtFile = path.join(
              normalizedOutputDir,
              `${path.basename(normalizedPath, path.extname(normalizedPath))}.txt`
            )

            // Read transcription from file
            const transcriptionText = fs.readFileSync(txtFile, "utf-8")
            resolve(transcriptionText.trim())
          } catch (readErr) {
            reject(`Failed to read transcription file: ${readErr}`)
          }
        } else {
          reject(error)
        }
      })
    })
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({model : "models/gemini-2.5-flash"})
    const prompt = `
        You are an expert agricultural advisor. A farmer has asked the following question:

        "${transcription}"

        The farmer is located in "${location}" and the current weather conditions are:
        - Temperature: ${weather.temp}°C
        - Humidity: ${weather.humidity}%
        - Description: ${weather.description}

        Answer the farmer's question clearly and in the same language as it was asked. 
        Provide practical advice, step-by-step instructions if applicable, and consider the local weather conditions while giving your recommendations.
        Keep your answer concise, simple, and easy for a farmer to understand.
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const aiResp = await response.text();

    const farmer = await fInfo.findOneAndUpdate({email},{$push:{queries:transcription}},{new:true,upsert:true})
    return NextResponse.json({ text: transcription,farmer, audioQuery: aiResp})

  } catch (err) {
    console.error("Transcription error:", err)
    return NextResponse.json(
      { error: "Something went wrong while transcribing" },
      { status: 500 }
    )
  }
}
