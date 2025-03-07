import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: `You are a creative writing assistant. Generate exactly 6 story options.
            Return ONLY a JSON array with this exact format:
            [
              {"name": "short title", "description": "brief description"},
              {"name": "short title", "description": "brief description"},
              {"name": "short title", "description": "brief description"},
              {"name": "short title", "description": "brief description"},
              {"name": "short title", "description": "brief description"},
              {"name": "short title", "description": "brief description"},
            ]`,
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      temperature: 0.7,
      maxTokens: 500,
    });

    // Clean the response and ensure it's valid JSON
    const cleanText = text.trim().replace(/```json|```/g, "");
    const options = JSON.parse(cleanText);

    return NextResponse.json({ success: true, options });
  } catch (error) {
    console.error("Options generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate options" },
      { status: 500 },
    );
  }
}
