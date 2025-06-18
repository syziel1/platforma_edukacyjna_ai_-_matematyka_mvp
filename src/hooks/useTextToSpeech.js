import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useTextToSpeech = () => {
  const { settings } = useSettings();

  const speak = useCallback(async (text) => {
    if (!settings.textToSpeechEnabled || !text) return;

    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        console.warn('ElevenLabs API key not found. Text-to-speech disabled.');
        return;
      }

      // Clean text from HTML tags and special characters
      const cleanText = text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^\w\s.,!?;:-]/g, '') // Keep only basic punctuation
        .trim();

      if (!cleanText) return;

      console.log('Generating speech for:', cleanText);

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
        // Handle specific error cases with user-friendly messages
        if (response.status === 401) {
          console.warn('Text-to-speech service unavailable: Account limitations detected. Consider disabling text-to-speech in settings or upgrading your ElevenLabs subscription.');
          return;
        }
        
        if (response.status === 429) {
          console.warn('Text-to-speech service busy: Too many requests. Please wait a moment before trying again or consider disabling text-to-speech in settings.');
          return;
        }

        // For other errors, still log but don't throw
        const errorText = await response.text();
        console.warn(`Text-to-speech service error (${response.status}): Service temporarily unavailable. You may want to disable text-to-speech in settings.`);
        return;
      }

      // Convert response to blob and play
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.volume = settings.volume || 0.5;
      
      // Clean up URL after playback
      audioPlayer.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });

      audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
      });

      await audioPlayer.play();
      console.log('Speech playback started');

    } catch (error) {
      console.warn('Text-to-speech temporarily unavailable:', error.message);
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