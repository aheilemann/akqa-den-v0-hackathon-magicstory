import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge"; // Keep Edge runtime for faster global responses

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (process.env.DISABLE_IMAGE_GENERATION === "true") {
      return new Response(
        JSON.stringify({ error: "Image generation is disabled" }),
        {
          status: 400
        }
      );
    }

    // Generate the image with DALL-E 3
    const { image } = await generateImage({
      model: openai.image("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          quality: "standard",
          style: "natural",
          response_format: "b64_json"
        }
      },
      n: 1
    });

    if (!image?.base64) {
      throw new Error("No image data received from DALL-E");
    }

    // Return the original image - compression will be called separately
    return new Response(
      JSON.stringify({
        base64: image.base64,
        needsCompression: true
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=31536000"
        }
      }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
