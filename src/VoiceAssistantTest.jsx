import React, { useState } from 'react';
import { ElevenLabsClient } from 'elevenlabs';

const VoiceAssistantTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlayAudio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("Nie znaleziono klucza API dla ElevenLabs.");
      }

      const elevenlabs = new ElevenLabsClient({
        apiKey: apiKey,
      });
      
      const audio = await elevenlabs.generate({
        voice: "ZT9u07TYPVl83ejeLakq", // Możesz tu wybrać dowolny głos, np. "Rachel" lub "Adam"
        text: "Witaj w Edu Future! Czas na naukę matematyki.",
        model_id: "eleven_multilingual_v2"
      });
      
      // Odtwarzanie audio
      const audioBlob = new Blob([audio], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = new Audio(audioUrl);
      audioPlayer.play();

    } catch (err) {
      console.error("Błąd podczas generowania audio:", err);
      setError("Nie udało się wygenerować dźwięku. Sprawdź konsolę, aby zobaczyć szczegóły.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h4>Test Asystenta Głosowego</h4>
      <button onClick={handlePlayAudio} disabled={isLoading}>
        {isLoading ? 'Generowanie...' : 'Odtwórz dźwięk testowy'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default VoiceAssistantTest;