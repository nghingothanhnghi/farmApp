// src/components/ARDetectionPage/ARDetectionPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import ARCamera from '../ARCamera';
import PageTitle from '../common/PageTitle';
import Button from '../common/Button';
import './ARDetectionPage.css';

const ARDetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [streamMode, setStreamMode] = useState<'websocket' | 'http'>('http');
  const [captureInterval, setCaptureInterval] = useState<number>(500);
  const [modelName, setModelName] = useState<string>('default');
  const [showAnnotatedImage, setShowAnnotatedImage] = useState<boolean>(true);
  const [showModelSelector, setShowModelSelector] = useState<boolean>(false);

  const handleDetection = (results: any) => {
    setDetectionResults(results);
  };

  const handleStreamModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStreamMode(e.target.value as 'websocket' | 'http');
  };

  const handleCaptureIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptureInterval(parseInt(e.target.value));
  };

  const handleModelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModelName(e.target.value);
  };

  const handleShowAnnotatedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAnnotatedImage(e.target.checked);
  };

  const toggleModelSelector = () => {
    setShowModelSelector(!showModelSelector);
  };

  return (
    <div className="ar-detection-page">
      <PageTitle
        title="AR Object Detection"
        actions={
          <>
            <Button
              label="Train Custom Model"
              onClick={() => navigate('/model-training')}
              variant="secondary"
            />
            <Button
              label={showModelSelector ? 'Hide Model Options' : 'Show Model Options'}
              onClick={toggleModelSelector}
              variant="secondary"
            />
          </>
        }
      />

      {showModelSelector && (
        <div className="settings-panel expanded">
          <div className="setting-group">
            <label htmlFor="streamMode">Stream Mode:</label>
            <select
              id="streamMode"
              value={streamMode}
              onChange={handleStreamModeChange}
            >
              <option value="http">HTTP</option>
              <option value="websocket">WebSocket</option>
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="captureInterval">Capture Interval (ms):</label>
            <input
              type="number"
              id="captureInterval"
              value={captureInterval}
              onChange={handleCaptureIntervalChange}
              min="100"
              max="2000"
              step="100"
            />
          </div>

          <div className="setting-group">
            <label htmlFor="modelName">Model Name:</label>
            <input
              type="text"
              id="modelName"
              value={modelName}
              onChange={handleModelNameChange}
              placeholder="default"
            />
            <small className="model-hint">
              Enter "default" for built-in model or the name of your trained model
            </small>
          </div>

          <div className="setting-group checkbox">
            <label htmlFor="showAnnotatedImage">
              <input
                type="checkbox"
                id="showAnnotatedImage"
                checked={showAnnotatedImage}
                onChange={handleShowAnnotatedImageChange}
              />
              Show Annotated Image
            </label>
          </div>
        </div>
      )}

      <div className="camera-container">
        <ARCamera
          modelName={modelName}
          captureInterval={captureInterval}
          onDetection={handleDetection}
          streamMode={streamMode}
          showAnnotatedImage={showAnnotatedImage}
        />
      </div>

      {detectionResults && (
        <div className="detection-results">
          <h2>Detection Results</h2>
          <div className="results-container">
            {detectionResults.detections.map((detection: any, index: number) => (
              <div key={index} className="detection-item">
                <div className="detection-class">{detection.class}</div>
                <div className="detection-confidence">
                  Confidence: {(detection.confidence * 100).toFixed(2)}%
                </div>
                <div className="detection-bbox">
                  Bounding Box: [{detection.bbox.map((val: number) => val.toFixed(1)).join(', ')}]
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ARDetectionPage;