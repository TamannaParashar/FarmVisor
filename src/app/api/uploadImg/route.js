import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json()

    const uploadRes = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${imageBase64}`,
      {
        folder: "crop-disease-images",
      }
    )

    return NextResponse.json({
      url: uploadRes.secure_url,
      public_id: uploadRes.public_id,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Cloudinary upload failed" },
      { status: 500 }
    )
  }
}
