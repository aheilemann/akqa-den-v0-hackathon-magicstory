import { NextResponse } from "next/server"
import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
})

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "REPLICATE_API_TOKEN is not set" }, { status: 500 })
    }

    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`

    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          image: base64Image,
          task: "image_captioning",
        },
      },
    )

    return NextResponse.json({ caption: output }, { status: 200 })
  } catch (error) {
    console.error("Error generating caption:", error)
    return NextResponse.json({ error: "Failed to generate caption" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}