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
        const errorText = await response.text();
        throw new Error(`ElevenLabs API Error: ${response.status} - ${errorText}`);
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
      console.error('Text-to-speech error:', error);
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