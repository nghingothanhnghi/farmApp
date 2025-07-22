export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}
export interface DetectionResult {
  detections?: Detection[];
  annotated_image?: string;
  error?: string;
}
export interface ARCameraProps {
  modelName?: string;
  captureInterval?: number;
  streamMode?: 'websocket' | 'http';
  showAnnotatedImage?: boolean;
  onDetection?: (result: DetectionResult) => void;
  onError?: (message: string) => void;
}