import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useSoundEffects = () => {
  const { settings } = useSettings();

  // Simple sound generation using Web Audio API
  const playSound = useCallback((type) => {
    if (!settings.soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set volume
      gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);

      // Different sounds for different actions
      switch (type) {
        case 'correct':
          // Happy ascending notes
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;

        case 'wrong':
          // Descending sad notes
          oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime); // G4
          oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.15); // E4
          oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime + 0.3); // C4
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;

        case 'move':
          // Short click sound
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'bonus':
          // Magical sparkle sound
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
          oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.1); // E6
          oscillator.frequency.setValueAtTime(1567.98, audioContext.currentTime + 0.2); // G6
          oscillator.frequency.setValueAtTime(2093.00, audioContext.currentTime + 0.3); // C7
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.6);
          break;

        case 'question':
          // Gentle notification
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.1); // C5
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'owl':
          // Wise owl hoot
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;

        case 'error':
          // Error buzz
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
          oscillator.type = 'sawtooth';
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        default:
          // Default beep
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [settings.soundEnabled, settings.volume]);

  return { playSound };
};