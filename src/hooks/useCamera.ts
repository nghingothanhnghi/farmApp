// src/hooks/useCamera.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import type { RefObject } from "react";

interface UseCameraOptions {
  videoRef?: RefObject<HTMLVideoElement | null>;
  location?: string; // Optional: for logging or future device mapping
  facingMode?: 'user' | 'environment'; // Optional: default is 'environment'
  autoStart?: boolean;
}

// export const useCamera = ({
//   videoRef,
//   location,
//   facingMode = 'environment',
// }: UseCameraOptions) => {
//   const internalRef = useRef<HTMLVideoElement | null>(null);
//   const targetRef = videoRef ?? internalRef;
//   const [isStreaming, setIsStreaming] = useState(false);

//   useEffect(() => {
//     const setupCamera = async () => {
//       try {
//         const constraints = {
//           video: {
//             facingMode,
//             width: { ideal: 640 },
//             height: { ideal: 480 },
//           },
//         };

//         // Optional: could use `location` to filter/select specific devices here
//         console.log(`Setting up camera for location: ${location ?? 'unknown'}`);

//         const stream = await navigator.mediaDevices.getUserMedia(constraints);

//         console.log("Got stream:", stream);
//         console.log("Tracks:", stream.getVideoTracks());
//         if (targetRef.current) {
//           targetRef.current.srcObject = stream;
//           targetRef.current.onloadedmetadata = async () => {
//             try {
//               await targetRef.current?.play();
//               setIsStreaming(true);
//             } catch (err) {
//               console.error("Video play failed:", err);
//             }
//           };
//         }
//       } catch (err) {
//         console.error("Camera setup failed:", err);
//         setIsStreaming(false);
//       }
//     };

//     setupCamera();

//     return () => {
//       const tracks =
//         targetRef.current?.srcObject instanceof MediaStream
//           ? targetRef.current.srcObject.getTracks()
//           : [];

//       tracks.forEach((track) => track.stop());
//     };
//   }, [targetRef, location, facingMode]);

//   return { isStreaming, videoRef: targetRef };
// };

export const useCamera = ({
  videoRef,
  location,
  facingMode = 'environment',
  autoStart = false,
}: UseCameraOptions) => {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const targetRef = videoRef ?? internalRef;
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const constraints = {
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      };

      console.log(`Starting camera for location: ${location ?? 'unknown'}`);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // if (targetRef.current) {
      //   targetRef.current.srcObject = stream;
      //   await targetRef.current.play();
      // }
    if (targetRef.current) {
        targetRef.current.srcObject = stream;
        // Play must be called inside the same click gesture
        targetRef.current.muted = true; // ensure autoplay allowed
        await targetRef.current.play();
      }


      setIsStreaming(true);
    } catch (err) {
      console.error("Camera setup failed:", err);
      setIsStreaming(false);
    }
  }, [facingMode, location, targetRef]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (targetRef.current) {
      targetRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, [targetRef]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) startCamera();
    return () => stopCamera();
  }, [autoStart, startCamera, stopCamera]);

  return { isStreaming, videoRef: targetRef, startCamera, stopCamera };
};

