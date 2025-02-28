import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge";
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await generateText({
      // model: openai("gpt-4"),
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Parse the response text as JSON since it should be in our Story format
    console.log("Response:", response.text);
    const storyData = response.text;

    return new Response(JSON.stringify(storyData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating story:", error);
    return new Response(JSON.stringify({ error: "Failed to generate story" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
