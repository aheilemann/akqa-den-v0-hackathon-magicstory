import sharp from "sharp";

export const preferredRegion = "fra1"; // Frankfurt
// No runtime specification to default to Node.js

function getBase64Size(base64String: string) {
  try {
    // Remove data URL prefix if present
    const base64WithoutPrefix = base64String.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    return Math.round((base64WithoutPrefix.length * 3) / 4);
  } catch (error) {
    console.error("Error calculating base64 size:", error);
    return 0;
  }
}

async function compressImage(
  base64Image: string,
  quality: number = 75
): Promise<string> {
  try {
    // Remove the data URL prefix if it exists
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Compress the image using Sharp
    const compressedBuffer = await sharp(buffer)
      .jpeg({ quality }) // Convert to JPEG with specified quality (1-100)
      .toBuffer();

    // Convert back to base64 with correct data URL prefix
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    const originalSize = getBase64Size(base64Image) / 1024; // KB
    const compressedSize = getBase64Size(compressedBase64) / 1024; // KB
    console.log(
      `Compressed image: ${originalSize.toFixed(2)}KB → ${compressedSize.toFixed(2)}KB (${((1 - compressedSize / originalSize) * 100).toFixed(2)}% reduction)`
    );

    return compressedBase64;
  } catch (error) {
    console.error("Error compressing image:", error);
    return base64Image; // Return original if compression fails
  }
}

export async function POST(req: Request) {
  try {
    const { base64Image, quality = 75 } = await req.json();

    if (!base64Image) {
      return new Response(JSON.stringify({ error: "No image data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const originalSize = getBase64Size(base64Image);
    console.log("Original image size:", Math.round(originalSize / 1024), "KB");

    // Compress the image with the specified or default quality
    const compressedBase64 = await compressImage(base64Image, quality);
    const compressedSize = getBase64Size(compressedBase64);

    return new Response(
      JSON.stringify({
        base64: compressedBase64,
        originalSize: Math.round(originalSize / 1024),
        compressedSize: Math.round(compressedSize / 1024),
        compressionRatio: parseFloat(
          ((1 - compressedSize / originalSize) * 100).toFixed(2)
        )
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=31536000"
        }
      }
    );
  } catch (error) {
    console.error("Error compressing image:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to compress image",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
