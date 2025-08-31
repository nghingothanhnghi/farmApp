// src/services/objectDetectionService.ts
import apiClient from '../api/client';
import { API_BASE_URL } from '../config/constants';

/**
 * API service for object detection functionality
 */
export const objectDetectionService = {
  /**
   * Download YOLO format training labels for a specific model
   * @param modelName - Name of the model to download labels for
   * @returns Blob containing a zip file with the training labels
   */
  async downloadTrainingLabels(modelName: string = 'default'): Promise<Blob> {
    try {
      const response = await apiClient.get(
        `/object-detection/download-training-labels`, {
        params: { model_name: modelName },
        responseType: 'blob'
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading training labels:', error);
      throw error;
    }
  },

  /**
   * Detect objects in an image using base64 encoding
   * @param imageBase64 - Base64 encoded image string
   * @param modelName - Optional model name to use for detection
   * @returns Detection results including bounding boxes and annotated image
   */
  async detectObjectsBase64(imageBase64: string, modelName: string = 'default') {
    try {
      const response = await apiClient.post(`/object-detection/detect-base64`, {
        image: imageBase64,
        model_name: modelName,
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting objects:', error);
      throw error;
    }
  },

  /**
   * Upload an image file for object detection
   * @param imageFile - Image file to upload
   * @param modelName - Optional model name to use for detection
   * @returns Detection results including bounding boxes and annotated image
   */
  async detectObjectsFile(imageFile: File, modelName: string = 'default') {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('model_name', modelName);

      const response = await apiClient.post(
        `/object-detection/detect`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error detecting objects:', error);
      throw error;
    }
  },

  /**
 * Fetch a list of available object detection models
 * @returns Array of model names (strings)
 */
  async listAvailableModels(): Promise<string[]> {
    try {
      const response = await apiClient.get(`/object-detection/models/list`);
      return response.data.models;
    } catch (error) {
      console.error('Error fetching available models:', error);
      throw error;
    }
  },

  /**
 * Delete a specific model by name (excluding '.pt')
 * @param modelName - Name of the model (e.g., 'my_model')
 * @returns A success message from the backend
 */
  async deleteModelByName(modelName: string): Promise<{ detail: string }> {
    try {
      const response = await apiClient.delete(`/object-detection/models/${modelName}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting model '${modelName}':`, error);
      throw error;
    }
  },


  /**
   * Create a WebSocket connection for real-time object detection
   * @returns WebSocket instance
   */
  createWebSocketConnection() {
    // Convert HTTP(S) URL to WS(S) URL and normalize trailing slash
    const wsBaseUrl = (API_BASE_URL || 'http://localhost:8000')
      .replace(/^http/, 'ws')
      .replace(/\/$/, '');
    const wsUrl = `${wsBaseUrl}/object-detection/ws`;
    console.log('[ObjectDetection WS] Connecting to', wsUrl);
    return new WebSocket(wsUrl);
  },

  /**
   * Train a custom object detection model
   * @param modelName - Name for the new model
   * @param epochs - Number of training epochs
   * @param imgsz - Image size for training
   * @param trainImages - Array of training image files
   * @param trainLabels - Array of training label files
   * @param valImages - Optional array of validation image files
   * @param valLabels - Optional array of validation label files
   * @returns Training result message
   */
  async trainModel(
    modelName: string,
    epochs: number,
    imgsz: number,
    trainImages: File[],
    trainLabels: File[],
    valImages?: File[],
    valLabels?: File[]
  ) {
    try {
      const formData = new FormData();
      formData.append('model_name', modelName);
      formData.append('epochs', epochs.toString());
      formData.append('imgsz', imgsz.toString());

      // Add training images
      trainImages.forEach(image => {
        formData.append('train_images', image);
      });

      // Add training labels
      trainLabels.forEach(label => {
        formData.append('train_labels', label);
      });

      // Add validation images if provided
      if (valImages && valImages.length > 0) {
        valImages.forEach(image => {
          formData.append('val_images', image);
        });
      }

      // Add validation labels if provided
      if (valLabels && valLabels.length > 0) {
        valLabels.forEach(label => {
          formData.append('val_labels', label);
        });
      }

      const response = await apiClient.post(
        `/object-detection/train`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error training model:', error);
      throw error;
    }
  },
};
