import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const InteractiveVisualization = () => {
  const { translate } = useLanguage();

  const maxFence = 40;
  const minSide = 0.5;
  // Max side length is half the total length available for two sides (40/2 = 20),
  // minus the minimum length for the other side (0.5), considering the step.
  const maxSide = maxFence / 2 - minSide; // 19.5

  // Function to generate random initial sides
  const generateRandomInitialSides = () => {
    let initialSideA;
    let initialSideB;

    // Loop until sideA and sideB are not equal (i.e., sideA is not 10)
    do {
      // Calculate the number of possible values for sideA (from 0.5 to 19.5, step 0.5)
      // (19.5 - 0.5) / 0.5 + 1 = 19 / 0.5 + 1 = 38 + 1 = 39 possible values
      const numPossibleValues = (maxSide - minSide) / 0.5 + 1;

      // Generate a random index from 0 to numPossibleValues - 1
      const randomIndex = Math.floor(Math.random() * numPossibleValues);

      // Calculate the random sideA value
      initialSideA = minSide + randomIndex * 0.5;

      // Calculate the corresponding sideB
      initialSideB = maxFence / 2 - initialSideA;

      // Ensure initialSideB is also a multiple of 0.5 (should be if initialSideA is)
      initialSideB = Math.round(initialSideB * 2) / 2;

    } while (initialSideA === initialSideB); // Repeat if sideA is exactly 10 (making sideB also 10)

    return { initialSideA, initialSideB };
  };

  // Generate initial sides when the component mounts
  const { initialSideA, initialSideB } = generateRandomInitialSides();

  // Initialize state with random values
  const [sideA, setSideA] = useState(initialSideA);
  const [sideB, setSideB] = useState(initialSideB);


  // Effect to synchronize sideB when sideA changes (e.g., via its slider)
  useEffect(() => {
    const newSideB = maxFence / 2 - sideA;
    const roundedNewSideB = Math.round(newSideB * 2) / 2;

    // Update sideB only if the calculated value is within valid range
    // This prevents issues when sideA is at its min/max and calculation results in values slightly outside bounds due to floating point or rounding
    if (roundedNewSideB >= minSide && roundedNewSideB <= maxSide) {
      setSideB(roundedNewSideB);
    } else if (roundedNewSideB < minSide) {
       setSideB(minSide);
    } else if (roundedNewSideB > maxSide) {
       setSideB(maxSide);
    }

  }, [sideA]); // Recalculate sideB whenever sideA changes


  // Calculate perimeter and area
  const perimeter = 2 * (sideA + sideB);
  const area = sideA * sideB;
  const maxArea = Math.pow(maxFence / 4, 2); // Maximum area for a fixed perimeter is a square (side = perimeter/4)
  const isNearMax = area > maxArea * 0.95; // Check if area is within 5% of the theoretical maximum

  // Helper function to format number with comma as decimal separator
  const formatNumber = (num) => {
    return num.toFixed(1).replace('.', ',');
  };

  // Scaling factor for visualization (e.g., 1 meter = 8 pixels)
  const scale = 8;
  // Threshold in pixels below which "Kurnik" text moves outside
  const textThresholdPx = 60; // Adjust this value if needed

  // Calculate scaled dimensions in pixels
  const widthPx = sideA * scale;
  const heightPx = sideB * scale;

  // Determine if "Kurnik" text should be inside or outside
  const isTextInside = widthPx >= textThresholdPx && heightPx >= textThresholdPx;


  return (
    <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
      <h3 className="text-lg font-semibold text-text-color mb-4">
        {translate('step3Title')}
      </h3>

      {/* Visualization */}
      <div className="mb-6 flex justify-center">
        {/* Outer div: represents the kurnik dimensions, scaled */}
        <div
          className="relative bg-nav-bg/20 border-2 border-nav-bg rounded-lg"
          style={{
            // Scale dimensions based on sideA and sideB - removed minPixelSize
            width: `${widthPx}px`,
            height: `${heightPx}px`,
            // Apply max size constraints to the outer div (optional, keeps it from getting too big)
            maxWidth: '250px',
            maxHeight: '250px',
            // Add a minimum size using CSS min-width/min-height to prevent div from collapsing completely
            minWidth: '1px',
            minHeight: '1px'
          }}
        >
          {/* Inner div: fills the outer div completely - provides background/border */}
          <div className="bg-nav-bg/40 border border-nav-bg w-full h-full">
            {/* "Kurnik" text is now positioned absolutely relative to the outer div */}
          </div>

          {/* "Kurnik" text element - positioned absolutely based on size */}
          <div className={`absolute text-xs text-text-color font-medium ${
              isTextInside
                ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' // Centered inside
                : 'top-full left-1/2 transform -translate-x-1/2 mt-2' // Centered below
            }`}>
            Kurnik
          </div>

          {/* Side labels - positioned relative to the outer div */}
          {/* Position Side A label above */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-text-color">
            {formatNumber(sideA)}m
          </div>
           {/* Position Side B label to the right - Increased negative right margin */}
           <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 rotate-90 origin-left text-sm text-text-color">
            {formatNumber(sideB)}m
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-text-color mb-2">
            {translate('sideA')}: {formatNumber(sideA)}m
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
            {translate('sideB')}: {formatNumber(sideB)}m
          </label>
           <input
            type="range"
            min={minSide}
            max={maxSide}
            step="0.5"
            value={sideB}
             onChange={(e) => {
               const newSideB = parseFloat(e.target.value);
               // Calculate the required sideA based on sideB
               const newSideA = maxFence / 2 - newSideB;
               // Ensure newSideA is within bounds and a multiple of 0.5
               const roundedNewSideA = Math.round(newSideA * 2) / 2;

               // Update sideA and sideB together
               if (roundedNewSideA >= minSide && roundedNewSideA <= maxSide) {
                 setSideB(newSideB);
                 setSideA(roundedNewSideA); // Update sideA based on sideB change
               } else if (roundedNewSideA < minSide) {
                  // If calculated sideA is too small, set sideA to min and calculate corresponding sideB
                  setSideA(minSide);
                  setSideB(maxFence / 2 - minSide);
               } else if (roundedNewSideA > maxSide) {
                  // If calculated sideA is too large, set sideA to max and calculate corresponding sideB
                  setSideA(maxSide);
                  setSideB(maxFence / 2 - maxSide);
               }
             }}
            className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {translate('usedFence')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(perimeter)} / {maxFence} m
          </div>
        </div>

        <div className="bg-bg-light p-3 rounded-md">
          <div className="text-sm text-text-color/70">
            {translate('chickenArea')}
          </div>
          <div className="text-lg font-semibold text-text-color">
            {formatNumber(area)} m&sup2;
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className={`rounded-md p-3 ${isNearMax ? 'bg-accent-secondary/20 border border-accent-secondary/50' : 'bg-accent-primary/10 border border-accent-primary/30'}`}>
        {/* Changed text color to text-text-color for better contrast */}
        <p className="text-sm font-medium text-text-color">
          {isNearMax ? translate('isMaximum') : translate('tryMaximize')}
        </p>
      </div>
    </div>
  );
};

export default InteractiveVisualization;