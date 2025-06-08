import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankVisualization = () => {
  const { t } = useLanguage();

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

  // --- SIMPLE 2D SIDE VIEW STYLING ---
  const scaleFactor = 15; // Scale for visualization
  const tankWidth = radius * 2 * scaleFactor; // Diameter
  const tankHeight = height * scaleFactor;
  const maxDisplayWidth = 200; // Maximum width for display
  const maxDisplayHeight = 150; // Maximum height for display
  
  // Scale down if too large
  const scaleDown = Math.min(
    maxDisplayWidth / tankWidth,
    maxDisplayHeight / tankHeight,
    1
  );
  
  const displayWidth = tankWidth * scaleDown;
  const displayHeight = tankHeight * scaleDown;

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {t('waterTankExploration')}
      </h3>

      {/* Simple 2D Side View Visualization */}
      <div className="mb-12 mt-8 flex justify-center items-center h-64">
        <div className="relative">
          {/* Tank Body (Rectangle) */}
          <div
            className="relative border-4 border-gray-600 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400"
            style={{
              width: `${displayWidth}px`,
              height: `${displayHeight}px`,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            {/* Water inside tank */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 opacity-70"
              style={{ height: '75%' }}
            >
              {/* Water surface lines */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-200 opacity-50" />
            </div>

            {/* Tank label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 bg-white/80 px-2 py-1 rounded">
              Zbiornik
            </div>
          </div>

          {/* Height measurement (left side) */}
          <div className="absolute left-0 top-0 bottom-0 -ml-12 flex items-center">
            <div className="relative h-full flex items-center">
              {/* Vertical line */}
              <div 
                className="w-0.5 bg-red-500"
                style={{ height: `${displayHeight}px` }}
              />
              {/* Top arrow */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-500 transform rotate-45" />
              {/* Bottom arrow */}
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-r-2 border-red-500 transform rotate-45" />
              {/* Height label */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-bold text-red-600 whitespace-nowrap">
                h = {formatNumber(height)}m
              </div>
            </div>
          </div>

          {/* Width/Diameter measurement (bottom) */}
          <div className="absolute left-0 right-0 -bottom-12 flex justify-center">
            <div className="relative flex items-center" style={{ width: `${displayWidth}px` }}>
              {/* Horizontal line */}
              <div 
                className="h-0.5 bg-blue-500"
                style={{ width: `${displayWidth}px` }}
              />
              {/* Left arrow */}
              <div className="absolute -left-1 -top-1 w-2 h-2 border-l-2 border-b-2 border-blue-500 transform rotate-45" />
              {/* Right arrow */}
              <div className="absolute -right-1 -top-1 w-2 h-2 border-r-2 border-t-2 border-blue-500 transform rotate-45" />
              {/* Diameter label */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-600 whitespace-nowrap">
                d = {formatNumber(radius * 2)}m
              </div>
            </div>
          </div>

          {/* Radius measurement (from center to edge) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-8">
            <div className="relative flex items-center">
              {/* Radius line */}
              <div 
                className="h-0.5 bg-green-500"
                style={{ width: `${displayWidth / 2}px` }}
              />
              {/* Center dot */}
              <div className="absolute -left-1 -top-1 w-2 h-2 bg-green-600 rounded-full" />
              {/* End arrow */}
              <div className="absolute -right-1 -top-1 w-2 h-2 border-r-2 border-t-2 border-green-500 transform rotate-45" />
              {/* Radius label */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-600 whitespace-nowrap">
                r = {formatNumber(radius)}m
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {t('tankRadius')}: {formatNumber(radius)}m
          </label>
          <input
            type="range" min={minDimension} max={maxDimension} step="0.1"
            value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {t('tankHeight')}: {formatNumber(height)}m
          </label>
          <input
            type="range" min={minDimension} max={maxDimension} step="0.1"
            value={height} onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`bg-bg-light p-3 rounded-md border ${isOverLimit ? 'border-red-500/50' : 'border-transparent'}`}>
          <div className="text-sm text-text-color/70">{t('surfaceArea')}</div>
          <div className={`text-lg font-semibold ${isOverLimit ? 'text-red-500' : 'text-text-color'}`}>
            {formatNumber(currentSurfaceArea)} / {formatNumber(maxAllowedSurfaceArea)} m²
          </div>
        </div>
        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">{t('tankVolume')}</div>
          <div className="text-lg font-semibold text-text-color">{formatNumber(volume)} m³</div>
        </div>
      </div>

      {/* Informational Message */}
      <div className={`rounded-md p-3 text-center ${isOverLimit ? 'bg-red-500/20 border border-red-500/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        <p className="text-sm font-medium text-text-color">
          {isOverLimit ? "Przekroczono limit materiału!" : "Spróbuj zmaksymalizować objętość w ramach limitu materiału."}
        </p>
      </div>
    </div>
  );
};

export default WaterTankVisualization;