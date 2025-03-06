import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export const preferredRegion = "fra1"; // Frankfurt
export const runtime = "edge";

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

    // Call the compression API from here
    try {
      const compressResponse = await fetch(
        new URL("/api/compress-image", req.url).toString(),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            base64Image: `data:image/png;base64,${image.base64}`,
            quality: 75
          })
        }
      );

      if (compressResponse.ok) {
        // If compression succeeded, return the compressed image
        const compressData = await compressResponse.json();

        return new Response(
          JSON.stringify({
            base64: compressData.base64.replace(/^data:image\/\w+;base64,/, ""),
            originalSize: compressData.originalSize,
            compressedSize: compressData.compressedSize,
            compressionRatio: compressData.compressionRatio
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=31536000"
            }
          }
        );
      }
    } catch (compressError) {
      // Log compression error but continue with original image
      console.error("Error compressing image:", compressError);
    }

    // Fallback to returning the original image if compression fails
    return new Response(
      JSON.stringify({
        base64: image.base64
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
