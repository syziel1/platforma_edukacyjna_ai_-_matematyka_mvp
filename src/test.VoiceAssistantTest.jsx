import React, { useState } from 'react';

const VoiceAssistantTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handlePlayAudio = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      if (!apiKey) {
        throw new Error("Nie znaleziono klucza API dla ElevenLabs. Sprawdź plik .env");
      }

      console.log("Rozpoczynam generowanie audio...");

      // Używamy fetch API zamiast biblioteki ElevenLabs
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/ZT9u07TYPVl83ejeLakq', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: "Witaj w Edu Future! Czas na naukę matematyki.",
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      console.log("Audio wygenerowane, odtwarzam...");

      // Konwertuj odpowiedź na blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Stwórz element audio i odtwórz
      const audioPlayer = new Audio(audioUrl);
      
      // Dodaj event listenery dla debugowania
      audioPlayer.addEventListener('loadstart', () => console.log('Audio loading started'));
      audioPlayer.addEventListener('canplay', () => console.log('Audio can play'));
      audioPlayer.addEventListener('play', () => console.log('Audio started playing'));
      audioPlayer.addEventListener('ended', () => {
        console.log('Audio finished playing');
        URL.revokeObjectURL(audioUrl); // Zwolnij pamięć
      });
      audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setError('Błąd podczas odtwarzania audio');
      });

      // Ustaw głośność na maksimum
      audioPlayer.volume = 1.0;
      
      // Odtwórz audio
      await audioPlayer.play();
      setSuccess("Audio zostało pomyślnie odtworzone!");

    } catch (err) {
      console.error("Błąd podczas generowania audio:", err);
      setError(`Błąd: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja testowa z prostym dźwiękiem systemowym
  const handlePlayTestBeep = () => {
    try {
      // Stwórz prosty dźwięk testowy używając Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      setSuccess("Test dźwięku systemowego zakończony!");
    } catch (err) {
      console.error("Błąd testu dźwięku:", err);
      setError("Błąd podczas testu dźwięku systemowego");
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h4 style={{ marginBottom: '15px', color: '#333' }}>🔊 Test Asystenta Głosowego</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={handlePlayTestBeep} 
          style={{
            padding: '10px 15px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎵 Test dźwięku systemowego
        </button>
        
        <button 
          onClick={handlePlayAudio} 
          disabled={isLoading}
          style={{
            padding: '10px 15px',
            backgroundColor: isLoading ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '⏳ Generowanie...' : '🎤 Odtwórz dźwięk ElevenLabs'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px', 
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #f44336'
        }}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          color: 'green', 
          marginTop: '10px', 
          padding: '10px',
          backgroundColor: '#e8f5e9',
          borderRadius: '4px',
          border: '1px solid #4caf50'
        }}>
          ✅ {success}
        </div>
      )}

      <div style={{ 
        marginTop: '15px', 
        fontSize: '12px', 
        color: '#666',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '4px'
      }}>
        <strong>Instrukcje debugowania:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Sprawdź konsolę przeglądarki (F12) dla szczegółowych logów</li>
          <li>Upewnij się, że głośność systemu jest włączona</li>
          <li>Sprawdź czy przeglądarka ma pozwolenie na odtwarzanie audio</li>
          <li>Przetestuj najpierw dźwięk systemowy, potem ElevenLabs</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceAssistantTest;