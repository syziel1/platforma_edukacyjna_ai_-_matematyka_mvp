import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-bg-neutral rounded-full h-2">
        <div
          className="bg-accent-secondary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-text-color font-medium">
        {currentStep}/{totalSteps}
      </span>
    </div>
  );
};

export default ProgressIndicator;