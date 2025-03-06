"use client";

import type React from "react";

import { useCreateContext } from "@/context/CreateStoryContext";
import { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon, Loader2, Camera, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageData } from "@/types/create-story";

export default function ImageCaptioner() {
  const router = useRouter();
  const { setImageData } = useCreateContext();

  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenratedImages, setHasGeneratedImages] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "webcam-photo.jpg", {
            type: "image/jpeg",
          });
          setImages((prev) =>
            [...prev, { file, preview: imageSrc }].slice(0, 5),
          );
        });
    }
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const generateCaptions = async () => {
    if (images.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const captionPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("image", image.file);

        const response = await fetch("/api/generate-caption", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to generate caption");
        }

        const data = await response.json();
        return data.caption;
      });

      const captions = await Promise.all(captionPromises);
      console.log(captions);

      setImages((prev) =>
        prev.map((image, index) => ({
          ...image,
          caption: captions[index],
        })),
      );
    } catch (err) {
      setError("Error generating captions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setHasGeneratedImages(true);
    }
  };

  const handleCreateStory = () => {
    setImageData(images);
    router.push("/create/story");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Images to Inspire Your Story</CardTitle>
          <CardDescription>Upload or take up to 5 images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="webcam">Take Photo</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="flex items-center justify-center">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or GIF (Max 5 images)
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </TabsContent>
            <TabsContent value="webcam">
              <div className="flex flex-col items-center justify-center">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-64 object-contain"
                />
                <Button onClick={capturePhoto} className="mt-4">
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Photo
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image.preview || "/placeholder.svg"}
                  alt={`Uploaded image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {image.caption && process.env.NODE_ENV === "development" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-xs">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={generateCaptions}
            disabled={images.length === 0 || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Images...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Images
              </>
            )}
          </Button>
          {hasGenratedImages && (
            <Button className="w-full" onClick={handleCreateStory}>
              Generate story!
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
