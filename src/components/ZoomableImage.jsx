import React, { useState, useRef } from 'react';
import { FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';

const ZoomableImage = ({ imgUrl, maxHeight = '65vh', showDragHint = true }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  const handleZoomReset = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }));
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const imageStyles = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
    transformOrigin: 'center center',
    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-0.5">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
            title="Zoom Out"
          >
            <FaSearchMinus className="text-gray-600 text-xs" />
          </button>
          <span className="text-xs text-gray-600 px-0.5">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
            title="Zoom In"
          >
            <FaSearchPlus className="text-gray-600 text-xs" />
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
            title="Reset"
          >
            <FaUndo className="text-gray-600 text-xs" />
          </button>
        </div>
      </div>

      <div
        className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center relative"
        style={{ height: maxHeight }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imgUrl}
          alt="Zoomable content"
          className="max-w-full max-h-full object-contain transition-transform duration-300"
          style={imageStyles}
          draggable={false}
        />
        {zoomLevel > 1 && showDragHint && (
          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xxs px-1 py-0.5 rounded">
            Drag to move
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoomableImage;