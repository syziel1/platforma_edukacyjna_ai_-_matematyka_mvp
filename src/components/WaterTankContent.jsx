import React from 'react';
import { Play, ArrowRight, CheckCircle } from 'lucide-react';
import WaterTankVisualization from './WaterTankVisualization';
import { useLanguage } from '../contexts/LanguageContext';

const WaterTankContent = ({ currentStep, setCurrentStep }) => {
  const { translate } = useLanguage();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('waterTankIntro')}
            </h3>
            <div className="bg-text-color/90 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-2 opacity-70" />
                <p className="text-sm opacity-70">Video placeholder</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              {translate('continue')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('waterTankProblem')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed">
                {translate('waterTankDescription')}
              </p>
              <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 mt-4">
                <p className="text-sm text-accent-secondary">
                  💡 <strong>{translate('hint')}:</strong> {translate('waterTankHint')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              {translate('startExploration')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <WaterTankVisualization />
            <div className="text-center">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2 mx-auto"
              >
                {translate('endExploration')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('waterTankTheory')}
            </h3>
            <div className="prose prose-sm max-w-none mb-6 text-text-color">
              <p className="leading-relaxed mb-4">
                {translate('waterTankTheoryText')}
              </p>
              <div className="bg-bg-light p-4 rounded-md mb-4">
                <p className="font-mono text-sm text-text-color">
                  V(r, h) = πr²h<br/>
                  A(r, h) = 2πrh + 2πr²<br/>
                  {translate('whereFormula')}
                </p>
              </div>
              <p className="leading-relaxed">
                {translate('waterTankOptimization')}
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(5)}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
            >
              {translate('goToFormal')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 5:
        return (
          <div className="bg-bg-card rounded-lg p-6 shadow-sm border border-bg-neutral">
            <h3 className="text-lg font-semibold text-text-color mb-4">
              {translate('waterTankSolution')}
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  {translate('step1WaterTank')}
                </label>
                <input
                  type="text"
                  placeholder="∂V/∂r = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  {translate('step2WaterTank')}
                </label>
                <input
                  type="text"
                  placeholder="∂V/∂h = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-color mb-2">
                  {translate('step3WaterTank')}
                </label>
                <input
                  type="text"
                  placeholder="r = h = ..."
                  className="w-full p-3 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color"
                />
              </div>
            </div>
            <button
              className="bg-nav-bg text-white px-6 py-2 rounded-md hover:bg-nav-bg/90 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {translate('checkAnswer')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {renderStep()}
    </div>
  );
};

export default WaterTankContent;