import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankVisualization = () => {
  const { translate } = useLanguage();
  
  const [maxMaterial] = useState(() => Math.floor(Math.random() * (100 - 10 + 1)) + 10);
  const minDimension = 0.5;
  const maxDimension = maxMaterial / 2;

  const [radius, setRadius] = useState(maxMaterial / 6);
  const [height, setHeight] = useState(maxMaterial / 3);

  const calculateVolume = (r, h) => Math.PI * r * r * h;
  const calculateSurfaceArea = (r, h) => 2 * Math.PI * r * h + 2 * Math.PI * r * r;

  const volume = calculateVolume(radius, height);
  const surfaceArea = calculateSurfaceArea(radius, height);
  const maxVolume = calculateVolume(maxMaterial / 4, maxMaterial / 2);
  const isNearMax = volume > maxVolume * 0.95;

  const formatNumber = (num) => {
    return num.toFixed(1).replace('.', ',');
  };

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {translate('waterTankExploration')}
      </h3>

      <div className="mb-6 flex justify-center">
        <div className="relative" style={{ perspective: '800px' }}>
          {/* Container for 3D cylinder */}
          <div className="relative" style={{ transform: 'rotateX(45deg) rotateZ(-45deg)' }}>
            {/* Top circle (lid) */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border-2 border-gray-400 bg-gradient-to-br from-gray-200 to-gray-300"
              style={{
                width: `${radius * 16}px`,
                height: `${radius * 16}px`,
                transform: 'rotateX(-25deg)',
              }}
            >
              {/* Radius line */}
              <div className="absolute top-1/2 left-1/2 bg-nav-bg/50 h-0.5"
                style={{
                  width: '50%',
                  transformOrigin: 'left center',
                }}>
                <span className="absolute -top-6 right-0 transform rotate-45 text-sm text-text-color whitespace-nowrap">
                  r = {formatNumber(radius)}m
                </span>
              </div>
            </div>

            {/* Cylinder body */}
            <div
              className="relative bg-gradient-to-r from-gray-300 to-gray-400 border-2 border-gray-400"
              style={{
                width: `${radius * 16}px`,
                height: `${height * 8}px`,
                transform: 'translateY(2px)',
                borderRadius: '0',
              }}
            >
              {/* Height indicator */}
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 rotate-90 origin-left text-sm text-text-color">
                h = {formatNumber(height)}m
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('tankRadius')}: {formatNumber(radius)}m
          </label>
          <input
            type="range"
            min={minDimension}
            max={maxDimension}
            step="0.1"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('tankHeight')}: {formatNumber(height)}m
          </label>
          <input
            type="range"
            min={minDimension}
            max={maxDimension}
            step="0.1"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {translate('surfaceArea')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(surfaceArea)} m²
          </div>
        </div>

        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {translate('tankVolume')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(volume)} m³
          </div>
        </div>
      </div>

      <div className={`rounded-md p-3 ${isNearMax ? 'bg-accent-secondary/20 border border-accent-secondary/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        <p className="text-sm font-medium text-text-color">
          {isNearMax ? translate('isMaximumVolume') : translate('tryMaximizeVolume')}
        </p>
      </div>
    </div>
  );
};

export default WaterTankVisualization;