import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankVisualization = () => {
  const { translate } = useLanguage();

  // --- REPAIRED LOGIC: Use a fixed surface area as the constraint ---
  const [fixedSurfaceArea] = useState(() => Math.floor(Math.random() * (500 - 50 + 1)) + 50);
  
  // The user can only control the radius.
  // The max radius possible is when height is 0 (A = 2πr² => r = sqrt(A/2π)).
  const minRadius = 0.5;
  const maxRadius = Math.sqrt(fixedSurfaceArea / (2 * Math.PI));

  // Set initial radius to a reasonable value.
  const [radius, setRadius] = useState(maxRadius / 2);

  // --- DERIVED VALUES (calculated on every render) ---

  // Height is now calculated based on radius to keep surface area constant.
  // A = 2πrh + 2πr²  =>  h = (A - 2πr²) / (2πr)
  const calculatedHeight = (fixedSurfaceArea - 2 * Math.PI * radius * radius) / (2 * Math.PI * radius);
  // Ensure height doesn't become negative or zero, which can cause visual glitches.
  const height = Math.max(calculatedHeight, 0.1);

  const calculateVolume = (r, h) => Math.PI * r * r * h;
  const volume = calculateVolume(radius, height);

  // Calculate the true maximum possible volume for the given surface area.
  // This occurs when height = 2 * radius.
  const optimalRadius = Math.sqrt(fixedSurfaceArea / (6 * Math.PI));
  const optimalHeight = 2 * optimalRadius;
  const maxVolume = calculateVolume(optimalRadius, optimalHeight);
  
  const isAtMax = Math.abs(volume - maxVolume) < maxVolume * 0.01;

  const formatNumber = (num) => {
    return num.toFixed(2).replace('.', ',');
  };

  // --- REPAIRED VISUALIZATION STYLING ---
  const scaleFactor = 12; // Controls the overall size of the visualization
  const cylinderStyle = {
    '--radius-px': `${radius * scaleFactor}px`,
    '--height-px': `${height * (scaleFactor / 2)}px`, // Scale height less for better perspective
    '--border-color': '#9ca3af', // gray-400
  };

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {translate('waterTankExploration')}
      </h3>

      {/* Visualization Container */}
      <div className="mb-12 mt-8 flex justify-center items-center h-48" style={{ perspective: '1000px' }}>
        <div
          className="relative"
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
             <div className="absolute top-1/2 left-[calc(var(--radius-px)/2+20px)] transform -translate-y-1/2 flex items-center gap-2 -rotate-90 origin-bottom-left">
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

          {/* Bottom Ellipse (Base) - The key visual fix */}
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
            type="range"
            min={minRadius}
            max={maxRadius}
            step="0.05"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Data Display */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-bg-light p-3 rounded-md text-center">
          <div className="text-sm text-text-color/70">{translate('surfaceArea')}</div>
          <div className="text-lg font-semibold text-text-color">{formatNumber(fixedSurfaceArea)} m²</div>
        </div>
        <div className="bg-bg-light p-3 rounded-md text-center">
          <div className="text-sm text-text-color/70">{translate('tankHeight')}</div>
          <div className="text-lg font-semibold text-text-color">{formatNumber(height)} m</div>
        </div>
        <div className="bg-bg-light p-3 rounded-md text-center">
          <div className="text-sm text-text-color/70">{translate('tankVolume')}</div>
          <div className="text-lg font-semibold text-text-color">{formatNumber(volume)} m³</div>
        </div>
      </div>

      {/* Informational Message */}
      <div className={`rounded-md p-3 text-center ${isAtMax ? 'bg-accent-secondary/20 border border-accent-secondary/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        <p className="text-sm font-medium text-text-color">
          {isAtMax ? translate('isMaximumVolume') : translate('tryMaximizeVolume')}
        </p>
      </div>
    </div>
  );
};

export default WaterTankVisualization;