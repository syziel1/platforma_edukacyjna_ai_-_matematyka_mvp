import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

// Module-level lock to prevent multiple simultaneous speech requests
let isCurrentlySpeaking = false;
let speechTimeoutId = null;

export const useTextToSpeech = () => {
  const { settings } = useSettings();

  const speak = useCallback(async (text) => {
    // Block if speech is disabled, no text is provided, or another speech is in progress.
    if (!settings.textToSpeechEnabled || !text || isCurrentlySpeaking) {
      if (isCurrentlySpeaking) {
        console.log('TTS request blocked: another speech is already in progress.');
      }
      return;
    }

    try {
      // Set the lock
      isCurrentlySpeaking = true;
      
      // Safety timeout to release the lock after 15 seconds in case of an issue
      speechTimeoutId = setTimeout(() => {
        console.warn('TTS lock released by timeout.');
        isCurrentlySpeaking = false;
      }, 15000);

      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error('ElevenLabs API key not found. Text-to-speech disabled.');
      }

      // Clean text to prevent issues
      const cleanText = text
        .replace(/<[^>]*>/g, '')
        .replace(/[^\w\s.,!?;:\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ+\-×÷=^√%()]/g, '')
        .trim();

      if (!cleanText) {
        throw new Error("Cleaned text is empty.");
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.textToSpeechVoice}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            speed: settings.textToSpeechSpeed || 1.0
          }
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