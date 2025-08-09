// src/hooks/useCamera.ts

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from "react";

interface UseCameraOptions {
  videoRef?: RefObject<HTMLVideoElement | null>;
  location?: string; // Optional: for logging or future device mapping
  facingMode?: 'user' | 'environment'; // Optional: default is 'environment'
}

export const useCamera = ({
  videoRef,
  location,
  facingMode = 'environment',
}: UseCameraOptions) => {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const targetRef = videoRef ?? internalRef;
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode,
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };

        // Optional: could use `location` to filter/select specific devices here
        console.log(`Setting up camera for location: ${location ?? 'unknown'}`);

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (targetRef.current) {
          targetRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (err) {
        console.error(`Camera setup failed${location ? ` for ${location}` : ''}:`, err);
        setIsStreaming(false);
      }
    };

    setupCamera();

    return () => {
      const tracks =
        targetRef.current?.srcObject instanceof MediaStream
          ? targetRef.current.srcObject.getTracks()
          : [];

      tracks.forEach((track) => track.stop());
    };
  }, [targetRef, location, facingMode]);

  return { isStreaming, videoRef: targetRef };
};

