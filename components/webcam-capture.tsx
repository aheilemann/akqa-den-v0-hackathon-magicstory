"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, FlipHorizontal } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export default function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const startWebcam = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }

      // Check if device has multiple cameras
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasMultipleCameras(videoDevices.length > 1);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert(
        "Unable to access your camera. Please make sure you've granted permission."
      );
    }
  }, [isFrontCamera]);

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const imageSrc = canvas.toDataURL("image/jpeg");
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const switchCamera = useCallback(() => {
    stopWebcam();
    setIsFrontCamera((prev) => !prev);
  }, [stopWebcam]);

  // Start webcam when component mounts or camera direction changes
  useEffect(() => {
    startWebcam();

    // Cleanup function to stop webcam when component unmounts
    return () => {
      stopWebcam();
    };
  }, [startWebcam, stopWebcam]);

  useEffect(() => {
    startWebcam();
  }, [isFrontCamera, startWebcam]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto aspect-video object-cover"
          />

          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              onClick={captureImage}
              size="lg"
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            >
              <Camera className="h-6 w-6" />
            </Button>

            {hasMultipleCameras && (
              <Button
                onClick={switchCamera}
                variant="secondary"
                size="icon"
                className="rounded-full"
              >
                <FlipHorizontal className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
