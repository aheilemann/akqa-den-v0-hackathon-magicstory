import { useState, useEffect } from "react";

/**
 * A hook that detects if a webcam is available and updates when devices change
 * @returns {boolean} Whether a webcam is available
 */
export function useWebcamDetection(): boolean {
  const [hasWebcam, setHasWebcam] = useState<boolean>(false);

  useEffect(() => {
    const checkWebcamAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasWebcam(videoDevices.length > 0);
      } catch (err) {
        console.error("Error checking for webcam:", err);
        setHasWebcam(false);
      }
    };

    checkWebcamAvailability();

    // Set up device change listener to detect when webcams are connected or disconnected
    const handleDeviceChange = () => {
      checkWebcamAvailability();
    };

    // Add event listener for device changes
    if (
      navigator.mediaDevices &&
      "addEventListener" in navigator.mediaDevices
    ) {
      navigator.mediaDevices.addEventListener(
        "devicechange",
        handleDeviceChange
      );
    }

    // Clean up the event listener when component unmounts
    return () => {
      if (
        navigator.mediaDevices &&
        "removeEventListener" in navigator.mediaDevices
      ) {
        navigator.mediaDevices.removeEventListener(
          "devicechange",
          handleDeviceChange
        );
      }
    };
  }, []);

  return hasWebcam;
}
