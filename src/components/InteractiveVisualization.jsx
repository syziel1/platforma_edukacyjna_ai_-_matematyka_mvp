import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const InteractiveVisualization = () => {
  const { t } = useLanguage();
  
  // Generate random fence length between 10 and 100
  const [maxFence] = useState(() => Math.floor(Math.random() * (100 - 10 + 1)) + 10);
  const minSide = 0.5;
  const maxSide = maxFence / 2 - minSide;

  // Function to generate random initial sides
  const generateRandomInitialSides = () => {
    let initialSideA;
    let initialSideB;

    do {
      const numPossibleValues = (maxSide - minSide) / 0.5 + 1;
      const randomIndex = Math.floor(Math.random() * numPossibleValues);
      initialSideA = minSide + randomIndex * 0.5;
      initialSideB = maxFence / 2 - initialSideA;
      initialSideB = Math.round(initialSideB * 2) / 2;
    } while (initialSideA === initialSideB);

    return { initialSideA, initialSideB };
  };

  const { initialSideA, initialSideB } = generateRandomInitialSides();
  const [sideA, setSideA] = useState(initialSideA);
  const [sideB, setSideB] = useState(initialSideB);

  useEffect(() => {
    const newSideB = maxFence / 2 - sideA;
    const roundedNewSideB = Math.round(newSideB * 2) / 2;

    if (roundedNewSideB >= minSide && roundedNewSideB <= maxSide) {
      setSideB(roundedNewSideB);
    } else if (roundedNewSideB < minSide) {
      setSideB(minSide);
    } else if (roundedNewSideB > maxSide) {
      setSideB(maxSide);
    }
  }, [sideA, maxFence]);

  const perimeter = 2 * (sideA + sideB);
  const area = sideA * sideB;
  const maxArea = Math.pow(maxFence / 4, 2);
  const isNearMax = area > maxArea * 0.95;

  const formatNumber = (num) => {
    return num.toFixed(1).replace('.', ',');
  };

  const scale = 8;
  const textThresholdPx = 60;
  const widthPx = sideA * scale;
  const heightPx = sideB * scale;
  const isTextInside = widthPx >= textThresholdPx && heightPx >= textThresholdPx;

  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {t('step3Title')}
      </h3>

      <div className="mb-6 flex justify-center">
        <div
          className="relative bg-nav-bg/20 border-2 border-nav-bg rounded-lg"
          style={{
            width: `${widthPx}px`,
            height: `${heightPx}px`,
            maxWidth: '250px',
            maxHeight: '250px',
            minWidth: '1px',
            minHeight: '1px'
          }}
        >
          <div className="bg-nav-bg/40 border border-nav-bg w-full h-full">
          </div>

          <div className={`absolute text-xs text-text-color font-medium ${
              isTextInside
                ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2'
            }`}>
            Kurnik
          </div>

          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-text-color">
            {formatNumber(sideA)}m
          </div>
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 rotate-90 origin-left text-sm text-text-color">
            {formatNumber(sideB)}m
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {t('sideA')}: {formatNumber(sideA)}m
          </label>
          <input
            type="range"
            min={minSide}
            max={maxSide}
            step="0.5"
            value={sideA}
            onChange={(e) => setSideA(parseFloat(e.target.value))}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {t('sideB')}: {formatNumber(sideB)}m
          </label>
          <input
            type="range"
            min={minSide}
            max={maxSide}
            step="0.5"
            value={sideB}
            onChange={(e) => {
              const newSideB = parseFloat(e.target.value);
              const newSideA = maxFence / 2 - newSideB;
              const roundedNewSideA = Math.round(newSideA * 2) / 2;

              if (roundedNewSideA >= minSide && roundedNewSideA <= maxSide) {
                setSideB(newSideB);
                setSideA(roundedNewSideA);
              } else if (roundedNewSideA < minSide) {
                setSideA(minSide);
                setSideB(maxFence / 2 - minSide);
              } else if (roundedNewSideA > maxSide) {
                setSideA(maxSide);
                setSideB(maxFence / 2 - maxSide);
              }
            }}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {t('usedFence')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(perimeter)} / {maxFence} m
          </div>
        </div>

        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {t('chickenArea')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(area)} m&sup2;
          </div>
        </div>
      </div>

      <div className={`rounded-md p-3 ${isNearMax ? 'bg-accent-secondary/20 border border-accent-secondary/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        <p className="text-sm font-medium text-text-color">
          {isNearMax ? t('isMaximum') : t('tryMaximize')}
        </p>
      </div>
    </div>
  );
};

export default InteractiveVisualization;