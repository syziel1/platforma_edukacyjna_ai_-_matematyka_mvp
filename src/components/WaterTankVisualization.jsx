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

  // --- ENHANCED VISUALIZATION STYLING ---
  const scaleFactor = 12; // Increased scale for better visibility
  const cylinderStyle = {
    '--radius-px': `${Math.max(60, radius * scaleFactor)}px`,
    '--height-px': `${Math.max(80, height * scaleFactor * 0.8)}px`,
    '--radius-display': `${radius * scaleFactor}px`,
    '--height-display': `${height * scaleFactor * 0.8}px`,
  };

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {translate('waterTankExploration')}
      </h3>

      {/* Enhanced 3D Visualization Container */}
      <div className="mb-12 mt-8 flex justify-center items-center h-80 relative" style={{ perspective: '1200px' }}>
        <div
          className="relative transition-all duration-300 ease-in-out"
          style={{ 
            ...cylinderStyle, 
            transform: 'rotateX(75deg) rotateY(-15deg)', 
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
          }}
        >
          {/* Cylinder Body with metallic gradient */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-sm"
            style={{
              width: 'var(--radius-px)',
              height: 'var(--height-px)',
              background: `linear-gradient(135deg, 
                #e8e8e8 0%, 
                #c0c0c0 15%, 
                #a8a8a8 30%, 
                #d4d4d4 45%, 
                #b8b8b8 60%, 
                #9c9c9c 75%, 
                #c8c8c8 90%, 
                #e0e0e0 100%)`,
              transform: 'rotateX(-90deg) translateY(calc(var(--height-px) / -2)) translateZ(calc(var(--radius-px) / 2))',
              border: '2px solid #888',
              borderLeft: '3px solid #666',
              borderRight: '3px solid #aaa',
              boxShadow: `
                inset 0 0 20px rgba(255,255,255,0.3),
                inset 0 0 40px rgba(0,0,0,0.1),
                0 0 30px rgba(0,0,0,0.2)
              `,
              position: 'relative'
            }}
          >
            {/* Metallic surface details */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent 0px,
                  rgba(255,255,255,0.4) 2px,
                  transparent 4px,
                  transparent 12px
                )`
              }}
            />
            
            {/* Height measurement line and label */}
            <div 
              className="absolute left-full ml-6 top-0 bottom-0 flex items-center"
              style={{ transform: 'rotateX(90deg) rotateZ(90deg)' }}
            >
              {/* Vertical measurement line */}
              <div className="relative">
                <div 
                  className="bg-red-500 w-0.5 absolute left-0"
                  style={{ height: 'var(--height-display)' }}
                />
                {/* Top arrow */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-500 transform rotate-45" />
                {/* Bottom arrow */}
                <div 
                  className="absolute -left-1 w-2 h-2 border-b-2 border-r-2 border-red-500 transform rotate-45"
                  style={{ bottom: '-4px' }}
                />
                {/* Height label */}
                <div 
                  className="absolute left-4 bg-white px-2 py-1 rounded shadow-md border text-sm font-bold text-red-600 whitespace-nowrap"
                  style={{ 
                    top: '50%', 
                    transform: 'translateY(-50%) rotateZ(-90deg) rotateX(-90deg)',
                    transformOrigin: 'left center'
                  }}
                >
                  h = {formatNumber(height)}m
                </div>
              </div>
            </div>
          </div>

          {/* Top Ellipse (Lid) with enhanced metallic look */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-4"
            style={{
              width: 'var(--radius-px)',
              height: 'calc(var(--radius-px) * 0.3)',
              background: `radial-gradient(ellipse at center, 
                #f0f0f0 0%, 
                #d8d8d8 20%, 
                #c0c0c0 40%, 
                #a8a8a8 60%, 
                #909090 80%, 
                #808080 100%)`,
              borderColor: '#666',
              transform: 'translateZ(calc(var(--height-px) / 2))',
              boxShadow: `
                0 -5px 15px rgba(0,0,0,0.3),
                inset 0 0 20px rgba(255,255,255,0.4),
                inset 0 0 40px rgba(0,0,0,0.1)
              `,
              position: 'relative'
            }}
          >
            {/* Radius line and measurement */}
            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2">
              {/* Radius line */}
              <div 
                className="bg-blue-500 h-1 relative"
                style={{ 
                  width: 'calc(var(--radius-px) / 2)',
                  transformOrigin: 'left center'
                }}
              >
                {/* Center dot */}
                <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-600 rounded-full" />
                {/* End arrow */}
                <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-blue-500 transform rotate-45" />
              </div>
              
              {/* Radius label */}
              <div 
                className="absolute top-4 bg-white px-2 py-1 rounded shadow-md border text-sm font-bold text-blue-600 whitespace-nowrap"
                style={{ 
                  left: 'calc(var(--radius-px) / 4)',
                  transform: 'translateX(-50%)'
                }}
              >
                r = {formatNumber(radius)}m
              </div>
            </div>

            {/* Metallic surface reflection */}
            <div 
              className="absolute inset-0 rounded-full opacity-40"
              style={{
                background: `linear-gradient(45deg, 
                  transparent 0%, 
                  rgba(255,255,255,0.6) 30%, 
                  transparent 60%)`
              }}
            />
          </div>

          {/* Bottom Ellipse (Base) with enhanced depth */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full border-4"
            style={{
              width: 'var(--radius-px)',
              height: 'calc(var(--radius-px) * 0.3)',
              background: `radial-gradient(ellipse at center, 
                #808080 0%, 
                #909090 20%, 
                #a8a8a8 40%, 
                #c0c0c0 60%, 
                #d8d8d8 80%, 
                #f0f0f0 100%)`,
              borderColor: '#555',
              transform: 'translateZ(calc(var(--height-px) / -2))',
              boxShadow: `
                0 5px 25px rgba(0,0,0,0.5),
                inset 0 0 20px rgba(0,0,0,0.2),
                inset 0 0 40px rgba(255,255,255,0.1)
              `
            }}
          >
            {/* Base shadow effect */}
            <div 
              className="absolute inset-0 rounded-full opacity-60"
              style={{
                background: `radial-gradient(ellipse at 30% 30%, 
                  rgba(0,0,0,0.3) 0%, 
                  transparent 70%)`
              }}
            />
          </div>

          {/* Volume indicator (water level) */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: 'calc(var(--radius-px) * 0.9)',
              height: 'calc(var(--height-px) * 0.7)',
              background: `linear-gradient(180deg, 
                rgba(64, 164, 223, 0.7) 0%, 
                rgba(32, 132, 191, 0.8) 50%, 
                rgba(16, 100, 159, 0.9) 100%)`,
              transform: 'rotateX(-90deg) translateY(calc(var(--height-px) / -4)) translateZ(calc(var(--radius-px) / 2.2))',
              borderRadius: '0 0 8px 8px',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)'
            }}
          >
            {/* Water surface waves */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 opacity-50"
              style={{
                background: `repeating-linear-gradient(
                  90deg,
                  rgba(255,255,255,0.3) 0px,
                  transparent 4px,
                  rgba(255,255,255,0.3) 8px
                )`
              }}
            />
          </div>
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
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('tankHeight')}: {formatNumber(height)}m
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
          {isOverLimit ? "Przekroczono limit materiału!" : "Spróbuj zmaksymalizować objętość w ramach limitu materiału."}
        </p>
      </div>
    </div>
  );
};

export default WaterTankVisualization;