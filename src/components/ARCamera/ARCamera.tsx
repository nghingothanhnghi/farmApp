// src/components/ARCamera/ARCamera.tsx
// It provides a React component for augmented reality camera functionality,
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { objectDetectionApi } from '../../api/endpoints/objectDetectionApi';
import { useAlert } from '../../contexts/alertContext';
import type { Detection, DetectionResult, ARCameraProps } from '../../models/interfaces/Camera';
import ListLink from '../common/ListLink';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { IconMinus, IconAlertCircle } from '@tabler/icons-react';
import './ARCamera.css';

const ARCamera: React.FC<ARCameraProps> = ({
  modelName = 'default',
  captureInterval = 500,
  onDetection,
  streamMode = 'http',
  showAnnotatedImage = true,
}) => {
  const { setAlert } = useAlert();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const annotatedImageRef = useRef<HTMLImageElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamIntervalRef = useRef<number | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [annotatedImageSrc, setAnnotatedImageSrc] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(modelName);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);



  // Setup camera on mount
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
        // Fetch model list
        const models = await objectDetectionApi.listAvailableModels();
        setAvailableModels(models);
        setAlert(null);
      } catch (err) {
        console.error('Camera error:', err);
        setAlert({ message: 'Could not access camera. Please ensure permissions are granted.', type: 'error' });
      }
    };

    setupCamera();

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }

      const tracks = videoRef.current?.srcObject instanceof MediaStream
        ? videoRef.current.srcObject.getTracks()
        : [];

      tracks.forEach((track) => track.stop());
    };
  }, []);

  // Manage streaming mode (WebSocket or HTTP)
  useEffect(() => {
    if (!isStreaming) return;

    if (streamMode === 'websocket') {
      initWebSocketStream();
    } else {
      initHttpStream();
    }

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isStreaming, streamMode, captureInterval, selectedModel]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!video || !canvas || !context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1] || null;
  }, []);

  const processDetectionResults = (results: DetectionResult) => {
    if (results.detections) {
      setDetections(results.detections);
    }
    if (results.annotated_image && showAnnotatedImage) {
      setAnnotatedImageSrc(`data:image/jpeg;base64,${results.annotated_image}`);
    }
    onDetection?.(results);
  };

  const initWebSocketStream = () => {
    try {
      wsRef.current = objectDetectionApi.createWebSocketConnection();

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        streamIntervalRef.current = setInterval(() => {
          const imageBase64 = captureFrame();
          if (imageBase64 && wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ image: imageBase64, model_name: selectedModel }));
          }
        }, captureInterval);
      };

      wsRef.current.onmessage = (event) => {
        const data: DetectionResult = JSON.parse(event.data);
        if (data.error) {
          console.error('Detection error:', data.error);
          setAlert({ message: `Detection error: ${data.error}`, type: 'warning' });
        } else {
          processDetectionResults(data);
        }
      };

      wsRef.current.onerror = (e) => {
        console.error('WebSocket error:', e);
        setAlert({ message: 'WebSocket connection failed', type: 'error' });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (err) {
      console.error('WebSocket init failed:', err);
      setAlert({ message: 'Failed to open WebSocket', type: 'error' });
    }
  };

  const initHttpStream = () => {
    streamIntervalRef.current = setInterval(async () => {
      try {
        const imageBase64 = captureFrame();
        if (imageBase64) {
          const results = await objectDetectionApi.detectObjectsBase64(imageBase64, selectedModel);
          processDetectionResults(results);
        }
      } catch (err) {
        console.error('HTTP stream error:', err);
        setAlert({ message: 'HTTP stream error occurred', type: 'error' });
      }
    }, captureInterval);
  };

  const renderBoundingBoxes = () => {
    return detections.map((detection, index) => {
      const [x1, y1, x2, y2] = detection.bbox;
      const width = x2 - x1;
      const height = y2 - y1;

      return (
        <div
          key={index}
          className="bounding-box"
          style={{
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          <div className="label">
            {detection.class} ({Math.round(detection.confidence * 100)}%)
          </div>
        </div>
      );
    });
  };

  const confirmDeleteModel = (modelName: string) => {
    setModelToDelete(modelName);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      await objectDetectionApi.deleteModelByName(modelToDelete);
      setAlert({ message: `Model '${modelToDelete}' deleted successfully`, type: 'success' });

      const models = await objectDetectionApi.listAvailableModels();
      setAvailableModels(models);

      // Reset to default if deleted model was selected
      if (selectedModel === modelToDelete) {
        setSelectedModel('default');
      }
    } catch (error) {
      setAlert({ message: `Failed to delete model '${modelToDelete}'`, type: 'error' });
    } finally {
      setConfirmModalOpen(false);
      setModelToDelete(null);
    }
  };


  return (
    <div className="ar-camera-container">
      {availableModels.length > 0 && (
        <div className="model-selector space-y-2 mt-4">
          <h3 className="font-semibold text-sm mb-1">Available Models</h3>
          {availableModels.map((model) => (
            <div key={model} className="flex items-center justify-between">
              <ListLink
                to="#"
                label={model}
                icon={<span className="w-4 h-4 rounded-full bg-blue-500" />}
                active={selectedModel === model}
                onClick={() => setSelectedModel(model)}
              />
              {model !== 'default' && (
                <button
                  onClick={() => confirmDeleteModel(model)}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title={`Delete ${model}`}
                >
                  <IconMinus size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="camera-view">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={() => setIsStreaming(true)}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div className="detection-overlay">{renderBoundingBoxes()}</div>
      </div>

      {showAnnotatedImage && annotatedImageSrc && (
        <div className="annotated-image">
          <h3>Processed Image</h3>
          <img
            ref={annotatedImageRef}
            src={annotatedImageSrc}
            alt="Annotated detection"
          />
        </div>
      )}
      {availableModels.length > 0 && (
        <div className="model-selector">
          <label htmlFor="model-select">Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}
      <Modal
        showCloseButton={false}
        size="xsmall"
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setModelToDelete(null);
        }}
        content={
          <div className="text-sm px-10 pt-6 pb-10 text-center">
            <IconAlertCircle size={64} className="text-red-500 mb-4 mx-auto" />
            Are you sure you want to delete model{' '}
            <strong>{modelToDelete}</strong>?
          </div>
        }
        actions={
          <div className="flex gap-4 justify-center">
            <Button
              label="Yes, Delete"
              variant="danger"
              onClick={handleConfirmDelete}
              className="min-w-[150px]"
            />
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => {
                setConfirmModalOpen(false);
                setModelToDelete(null);
              }}
              className="min-w-[150px]"
            />
          </div>
        }
      />


    </div>
  );
};

export default ARCamera;
