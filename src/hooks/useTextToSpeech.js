import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { callSecureApi } from '../lib/apiClient';

// Module-level lock to prevent multiple simultaneous speech requests
let isCurrentlySpeaking = false;
let speechTimeoutId = null;

export const useTextToSpeech = () => {
  const { settings } = useSettings();

  const speak = useCallback(async (text) => {
    // Block if speech is disabled, no text is provided, or another speech is in progress.
    if (!settings.textToSpeechEnabled || !text || isCurrentlySpeaking) {
      return;
    }

    try {
      // Set the lock
      isCurrentlySpeaking = true;
      
      // Safety timeout to release the lock after 15 seconds in case of an issue
      speechTimeoutId = setTimeout(() => {
        isCurrentlySpeaking = false;
      }, 15000);

      // Format mathematical expressions for speech
      const formattedText = text
        // First, clean HTML tags
        .replace(/<[^>]*>/g, '')
        // Format mathematical operations for speech
        .replace(/(\d+)\s*\*\s*(\d+)/g, '$1 times $2')
        .replace(/(\d+)\s*×\s*(\d+)/g, '$1 times $2')
        .replace(/(\d+)\s*\+\s*(\d+)/g, '$1 plus $2')
        .replace(/(\d+)\s*\-\s*(\d+)/g, '$1 minus $2')
        .replace(/(\d+)\s*\/\s*(\d+)/g, '$1 divided by $2')
        .replace(/(\d+)\s*÷\s*(\d+)/g, '$1 divided by $2')
        .replace(/(\d+)\s*\^\s*(\d+)/g, '$1 to the power of $2')
        .replace(/(\d+)\^(\d+)/g, '$1 to the power of $2')
        .replace(/√\s*(\d+)/g, 'square root of $1')
        .replace(/=\s*(\d+)/g, 'equals $1')
        // Remove any remaining special characters
        .replace(/[^\w\s.,!?;:\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ()]/g, ' ')
        .trim();

      if (!formattedText) {
        throw new Error("Cleaned text is empty.");
      }

      const response = await callSecureApi('/tts/speak', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: formattedText,
          voice: settings.textToSpeechVoice,
          model: 'eleven_multilingual_v2',
          speed: settings.textToSpeechSpeed || 1.0
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Text-to-speech service error (${response.status}): ${errorText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.volume = settings.volume || 0.5;
      
      // Function to release the lock and clean up resources
      const releaseLock = () => {
        isCurrentlySpeaking = false;
        clearTimeout(speechTimeoutId);
        URL.revokeObjectURL(audioUrl);
      };

      // Release lock on 'ended' or 'error' events
      audioPlayer.addEventListener('ended', releaseLock);
      audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        releaseLock();
      });

      await audioPlayer.play();

    } catch (error) {
      console.warn('Text-to-speech failed:', error.message);
      // Ensure lock is released on any exception
      isCurrentlySpeaking = false;
      if (speechTimeoutId) clearTimeout(speechTimeoutId);
    }
  }, [settings.textToSpeechEnabled, settings.textToSpeechVoice, settings.textToSpeechSpeed, settings.volume]);

  const speakIfEnabled = useCallback((text) => {
    if (settings.textToSpeechEnabled) {
      speak(text);
    }
  }, [settings.textToSpeechEnabled, speak]);

  return {
    speak,
    speakIfEnabled,
    isEnabled: settings.textToSpeechEnabled
  };
};