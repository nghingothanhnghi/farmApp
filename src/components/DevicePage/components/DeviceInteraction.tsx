import React, { useState, useRef } from 'react';
import { useDevices } from '../../../hooks/useDevices';
import { useAlert } from '../../../contexts/alertContext';

interface DeviceInteractionProps {
  deviceSerial: string;
  imageWidth: number;
  imageHeight: number;
}

const DeviceInteraction: React.FC<DeviceInteractionProps> = ({ 
  deviceSerial, 
  imageWidth, 
  imageHeight 
}) => {
  const { tapAllDevices, swipeDevice } = useDevices();
  const { setAlert } = useAlert();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for tracking swipe
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeStart, setSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [swipeEnd, setSwipeEnd] = useState<{ x: number; y: number } | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
    visible: boolean;
  } | null>(null);

  // Handle mouse down (start of potential swipe)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    setIsSwiping(true);
    setSwipeStart({ x, y });
    setSwipeEnd({ x, y }); // Initialize end to same as start
  };

  // Handle mouse move (update swipe end position)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSwiping || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    setSwipeEnd({ x, y });
  };

  // Handle mouse up (end of swipe)
  const handleMouseUp = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSwiping || !swipeStart || !containerRef.current) {
      setIsSwiping(false);
      return;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    
    setSwipeEnd({ x, y });
    setIsSwiping(false);
    
    // Calculate distance of swipe
    const distance = Math.sqrt(
      Math.pow(x - swipeStart.x, 2) + Math.pow(y - swipeStart.y, 2)
    );
    
    // If distance is very small, treat as a tap
    if (distance < 10) {
      try {
        await tapAllDevices(swipeStart.x, swipeStart.y);
        setAlert({ message: `Tapped at (${swipeStart.x}, ${swipeStart.y})`, type: 'success' });
      } catch (err) {
        setAlert({ message: 'Failed to send tap command', type: 'error' });
      }
      return;
    }
    
    // Otherwise, it's a swipe
    try {
      await swipeDevice(deviceSerial, swipeStart.x, swipeStart.y, x, y, 300);
      
      // Show swipe feedback
      setSwipeFeedback({
        start: swipeStart,
        end: { x, y },
        visible: true
      });
      
      // Hide feedback after 2 seconds
      setTimeout(() => {
        setSwipeFeedback(null);
      }, 2000);
      
      setAlert({ 
        message: `Swiped from (${swipeStart.x}, ${swipeStart.y}) to (${x}, ${y})`, 
        type: 'success' 
      });
    } catch (err) {
      setAlert({ message: 'Failed to send swipe command', type: 'error' });
    }
  };

  // Handle mouse leave (cancel swipe)
  const handleMouseLeave = () => {
    setIsSwiping(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cursor-pointer"
      style={{ width: imageWidth, height: imageHeight }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Swipe visualization during active swipe */}
      {isSwiping && swipeStart && swipeEnd && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <line
            x1={swipeStart.x}
            y1={swipeStart.y}
            x2={swipeEnd.x}
            y2={swipeEnd.y}
            stroke="rgba(255, 0, 0, 0.7)"
            strokeWidth="3"
          />
          <circle
            cx={swipeStart.x}
            cy={swipeStart.y}
            r="5"
            fill="rgba(0, 255, 0, 0.7)"
          />
          <circle
            cx={swipeEnd.x}
            cy={swipeEnd.y}
            r="5"
            fill="rgba(255, 0, 255, 0.7)"
          />
        </svg>
      )}
      
      {/* Swipe feedback after swipe is complete */}
      {swipeFeedback && swipeFeedback.visible && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 0, 255, 0.7)" />
            </marker>
          </defs>
          <line
            x1={swipeFeedback.start.x}
            y1={swipeFeedback.start.y}
            x2={swipeFeedback.end.x}
            y2={swipeFeedback.end.y}
            stroke="rgba(0, 0, 255, 0.7)"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          <circle
            cx={swipeFeedback.start.x}
            cy={swipeFeedback.start.y}
            r="8"
            fill="rgba(0, 255, 0, 0.7)"
          />
          <circle
            cx={swipeFeedback.end.x}
            cy={swipeFeedback.end.y}
            r="8"
            fill="rgba(255, 0, 255, 0.7)"
          />
          <text
            x={(swipeFeedback.start.x + swipeFeedback.end.x) / 2}
            y={(swipeFeedback.start.y + swipeFeedback.end.y) / 2 - 10}
            fill="rgba(0, 0, 255, 0.9)"
            fontSize="12"
            textAnchor="middle"
          >
            Swipe
          </text>
        </svg>
      )}
    </div>
  );
};

export default DeviceInteraction;