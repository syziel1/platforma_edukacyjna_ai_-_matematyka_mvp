import React from 'react';
import { Volume2, VolumeX, X, RotateCcw, Eye, EyeOff, Globe, Target, Mic, MicOff } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const SettingsModal = ({ isOpen, onClose }) => {
  const { 
    settings, 
    toggleSound, 
    setVolume, 
    toggleGrassPercentage, 
    setDailyLearningGoal, 
    toggleTextToSpeech,
    setTextToSpeechVoice,
    setTextToSpeechSpeed,
    resetGameState 
  } = useSettings();
  const { t, currentLanguage, switchLanguage } = useLanguage();
  const { speak } = useTextToSpeech();

  const handleResetGameState = () => {
    if (confirm(t('resetGameStateConfirm'))) {
      resetGameState();
      alert(t('gameStateReset'));
    }
  };

  const learningGoalOptions = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' }
  ];

  // Voice options filtered by current platform language
  const getVoiceOptionsForLanguage = () => {
    if (currentLanguage === 'pl') {
      return [
        { id: 'zzBTsLBFM6AOJtkr1e9b', name: 'Paweł', isDefault: false },
        { id: 'MFYIqIc5gZiNnuySA5V7', name: 'Groki', isDefault: true }
      ];
    } else {
      return [
        { id: 'ZT9u07TYPVl83ejeLakq', name: 'Rachelle', isDefault: false },
        { id: 'MFYIqIc5gZiNnuySA5V7', name: 'Groky', isDefault: true }
      ];
    }
  };

  const voiceOptions = getVoiceOptionsForLanguage();

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1.0x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' }
  ];

  // Function to play voice sample
  const playVoiceSample = () => {
    const sampleText = currentLanguage === 'pl' 
      ? 'Witaj w Edu-Future! To jest próbka głosu w nowych ustawieniach.'
      : 'Welcome to Edu-Future! This is a voice sample with your new settings.';
    
    // Use speak directly to bypass the enabled check since we want to test the voice
    speak(sampleText);
  };

  // Handle voice change with automatic sample
  const handleVoiceChange = (voiceId) => {
    setTextToSpeechVoice(voiceId);
    // Play sample after a short delay to ensure settings are updated
    setTimeout(() => {
      playVoiceSample();
    }, 200);
  };

  // Handle speed change with automatic sample
  const handleSpeedChange = (speed) => {
    setTextToSpeechSpeed(speed);
    // Play sample after a short delay to ensure settings are updated
    //setTimeout(() => {
      //playVoiceSample();
    //}, 200);
  };

  // Handle TTS toggle with automatic sample when enabled
  const handleToggleTextToSpeech = () => {
    const wasEnabled = settings.textToSpeechEnabled;
    toggleTextToSpeech();
    
    // If we're enabling TTS, play a sample after a short delay
    if (!wasEnabled) {
//      setTimeout(() => {
//        playVoiceSample();
//      }, 200);
    }
  };

  // Check if current voice is available for current language, if not set default
  React.useEffect(() => {
    const currentVoiceAvailable = voiceOptions.some(voice => voice.id === settings.textToSpeechVoice);
    if (!currentVoiceAvailable) {
      const defaultVoice = voiceOptions.find(voice => voice.isDefault);
      if (defaultVoice) {
        setTextToSpeechVoice(defaultVoice.id);
      }
    }
  }, [currentLanguage, voiceOptions, settings.textToSpeechVoice, setTextToSpeechVoice]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div className="bg-bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
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

          {/* Daily Learning Goal */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-nav-bg" />
              <span className="font-medium text-text-color">
                {t('dailyLearningGoal')}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {learningGoalOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDailyLearningGoal(option.value)}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    settings.dailyLearningGoal === option.value
                      ? 'bg-nav-bg text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-color/60 mt-2">
              {t('dailyLearningGoalDesc')}
            </p>
          </div>

          {/* Text-to-Speech Settings */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {settings.textToSpeechEnabled ? (
                  <Mic className="w-5 h-5 text-accent-primary" />
                ) : (
                  <MicOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <span className="font-medium text-text-color block">
                    {t('textToSpeech')}
                  </span>
                  <span className="text-xs text-text-color/60">
                    {t('textToSpeechDesc')}
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleTextToSpeech}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.textToSpeechEnabled ? 'bg-accent-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.textToSpeechEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Voice Selection */}
            {settings.textToSpeechEnabled && (
              <div className="space-y-4 ml-8">
                <div>
                  <label className="block text-sm font-medium text-text-color mb-2">
                    {t('voiceSelection')} ({currentLanguage === 'pl' ? 'Polski' : 'English'})
                  </label>
                  <select
                    value={settings.textToSpeechVoice}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="w-full p-2 border border-bg-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-text-color bg-white"
                  >
                    {voiceOptions.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-text-color/60 mt-1">
                    {currentLanguage === 'pl' 
                      ? 'Głosy dostępne dla języka polskiego'
                      : 'Voices available for English language'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-color mb-2">
                    {t('speechSpeed')}: {settings.textToSpeechSpeed}x
                  </label>
                  <div className="grid grid-cols-5 gap-1">
                    {speedOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSpeedChange(option.value)}
                        className={`py-1 px-2 rounded text-xs font-medium transition-colors ${
                          settings.textToSpeechSpeed === option.value
                            ? 'bg-accent-primary text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Voice Button */}
                <div>
                  <button
                    onClick={playVoiceSample}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    {currentLanguage === 'pl' ? 'Przetestuj głos' : 'Test Voice'}
                  </button>
                </div>
              </div>
            )}
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