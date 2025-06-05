import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankVisualization = () => {
  const { translate } = useLanguage();

  // --- REPAIRED LOGIC: Use a clear material limit (max surface area) ---
  const [maxAllowedSurfaceArea] = useState(() => Math.floor(Math.random() * (400 - 100 + 1)) + 100);
  
  // Set independent sliders for radius and height
  const [radius, setRadius] = useState(5);
  const [height, setHeight] = useState(10);
  
  const minDimension = 0.5;
  const maxDimension = 20; // A generous slider max; the real limit is surface area

  // --- DERIVED VALUES (calculated on every render) ---
  const calculateVolume = (r, h) => Math.PI * r * r * h;
  const calculateSurfaceArea = (r, h) => 2 * Math.PI * r * (r + h);

  const volume = calculateVolume(radius, height);
  const currentSurfaceArea = calculateSurfaceArea(radius, height);

  const isOverLimit = currentSurfaceArea > maxAllowedSurfaceArea;

  const formatNumber = (num) => {
    return num.toFixed(2).replace('.', ',');
  };

  // --- VISUALIZATION STYLING ---
  const scaleFactor = 10; // Controls the overall size of the visualization
  const cylinderStyle = {
    '--radius-px': `${radius * scaleFactor}px`,
    '--height-px': `${height * scaleFactor * 0.7}px`, // Scale height less for better perspective
    '--border-color': '#9ca3af', // gray-400
  };

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {translate('waterTankExploration')}
      </h3>

      {/* Visualization Container - given a fixed height to prevent layout shifts */}
      <div className="mb-12 mt-8 flex justify-center items-center h-64" style={{ perspective: '1000px' }}>
        <div
          className="relative transition-all duration-200"
          style={{ ...cylinderStyle, transform: 'rotateX(70deg)', transformStyle: 'preserve-3d' }}
        >
          {/* Cylinder Body */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-300 to-gray-500"
            style={{
              width: 'var(--radius-px)',
              height: 'var(--height-px)',
              transform: 'rotateX(-90deg) translateY(calc(var(--height-px) / -2)) translateZ(calc(var(--radius-px) / 2))',
              borderLeft: '2px solid var(--border-color)',
              borderRight: '2px solid var(--border-color)',
            }}
          >
            {/* Height Indicator */}
             <div className="absolute top-1/2 right-full mr-4 transform -translate-y-1/2 flex items-center gap-2 -rotate-90 origin-bottom-left">
                <span className="text-sm text-text-color whitespace-nowrap">h = {formatNumber(height)}m</span>
            </div>
          </div>

          {/* Top Ellipse (Lid) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--border-color)] bg-gradient-to-b from-gray-200 to-gray-300"
            style={{
              width: 'var(--radius-px)',
              height: 'var(--radius-px)',
              transform: 'translateZ(calc(var(--height-px) / 2))',
            }}
          >
             {/* Radius Line */}
             <div className="absolute top-1/2 left-1/2 bg-nav-bg/50 h-0.5"
                style={{
                  width: '50%',
                  transformOrigin: 'left center',
                }}>
                <span className="absolute -top-5 right-0 text-sm text-text-color whitespace-nowrap">
                  r = {formatNumber(radius)}m
                </span>
              </div>
          </div>

          {/* Bottom Ellipse (Base) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--border-color)] bg-gradient-to-t from-gray-400 to-gray-500"
            style={{
              width: 'var(--radius-px)',
              height: 'var(--radius-px)',
              transform: 'translateZ(calc(var(--height-px) / -2))',
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('tankRadius')}: {formatNumber(radius)}m
          </label>
          <input
            type="range" min={minDimension} max={maxDimension} step="0.1"
            value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-accent-primary"
          />
        </div>
        {/* --- HEIGHT SLIDER IS RESTORED HERE --- */}
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('tankHeight')}: {formatNumber(height)}m
          </label>
          <input
            type="range" min={minDimension} max={maxDimension} step="0.1"
            value={height} onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-accent-primary"
          />
        </div>
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`bg-bg-light p-3 rounded-md border ${isOverLimit ? 'border-red-500/50' : 'border-transparent'}`}>
          <div className="text-sm text-text-color/70">{translate('surfaceArea')}</div>
          <div className={`text-lg font-semibold ${isOverLimit ? 'text-red-500' : 'text-text-color'}`}>
            {formatNumber(currentSurfaceArea)} / {formatNumber(maxAllowedSurfaceArea)} m²
          </div>
        </div>
        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">{translate('tankVolume')}</div>
          <div className="text-lg font-semibold text-text-color">{formatNumber(volume)} m³</div>
        </div>
      </div>

      {/* Informational Message */}
      <div className={`rounded-md p-3 text-center ${isOverLimit ? 'bg-red-500/20 border border-red-500/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        <p className="text-sm font-medium text-text-color">
          {isOverLimit ? "Material limit exceeded!" : "Try to maximize the volume within the material limit."}
        </p>
      </div>
    </div>
  );
};

export default WaterTankVisualization;