import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: { quality: "standard", style: "natural" },
      },
      n: 1,
    });

    return new Response(
      JSON.stringify({
        base64: image.base64,
        data: image.uint8Array,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(JSON.stringify({ error: "Failed to generate image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
