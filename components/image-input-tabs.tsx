"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import Image from "next/image";

interface ImageInputTabsProps {
  onImageCapture: (file: File, previewUrl: string) => void;
}

export function ImageInputTabs({ onImageCapture }: ImageInputTabsProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        setPreviewUrl(previewUrl);
        onImageCapture(file, previewUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-image.jpg", {
            type: "image/jpeg",
          });
          const previewUrl = URL.createObjectURL(blob);
          setPreviewUrl(previewUrl);
          onImageCapture(file, previewUrl);
        }
      }, "image/jpeg");
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        setActiveTab(value);
        if (value === "camera") {
          startCamera();
        } else {
          stopCamera();
        }
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload Image</TabsTrigger>
        <TabsTrigger value="camera">Take Photo</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card className="pt-6">
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
          >
            {previewUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-contain p-2"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or GIF
                </p>
              </div>
            )}
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </Card>
      </TabsContent>
      <TabsContent value="camera">
        <Card className="pt-6">
          <div className="relative w-full h-64">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {previewUrl && (
              <div className="absolute inset-0">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Captured photo"
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </div>
          <Button onClick={capturePhoto} className="mt-4 w-full">
            <Camera className="mr-2 h-4 w-4" />
            Capture Photo
          </Button>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
