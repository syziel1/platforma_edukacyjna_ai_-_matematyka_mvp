import React from 'react';
import { Volume2, VolumeX, X, RotateCcw, Eye, EyeOff, Globe } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { settings, toggleSound, setVolume, toggleGrassPercentage, resetGameState } = useSettings();
  const { t, currentLanguage, switchLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleResetGameState = () => {
    if (confirm(t('resetGameStateConfirm'))) {
      resetGameState();
      alert(t('gameStateReset'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-yellow p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-color">
            {t('settings')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Language Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-accent-primary" />
              <span className="font-medium text-text-color">
                {t('language')}
              </span>
            </div>
            <button
              onClick={switchLanguage}
              className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-primary/90 transition-colors font-medium"
            >
              {currentLanguage.toUpperCase()}
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-accent-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium text-text-color">
                {t('soundEffects')}
              </span>
            </div>
            <button
              onClick={toggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-accent-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume Slider */}
          {settings.soundEnabled && (
            <div>
              <label className="block text-sm font-medium text-text-color mb-2">
                {t('volume')}: {Math.round(settings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-neutral rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-accent-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-accent-primary [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          )}

          {/* Grass Percentage Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.showGrassPercentage ? (
                <Eye className="w-5 h-5 text-accent-primary" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <span className="font-medium text-text-color block">
                  {t('showGrassPercentage')}
                </span>
                <span className="text-xs text-text-color/60">
                  {t('showGrassPercentageDesc')}
                </span>
              </div>
            </div>
            <button
              onClick={toggleGrassPercentage}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showGrassPercentage ? 'bg-accent-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showGrassPercentage ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reset Game State */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-red-500" />
                <div>
                  <span className="font-medium text-text-color block">
                    {t('resetGameState')}
                  </span>
                  <span className="text-xs text-text-color/60">
                    {t('resetGameStateDesc')}
                  </span>
                </div>
              </div>
              <button
                onClick={handleResetGameState}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-primary/90 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;