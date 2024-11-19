import React, { useState, useEffect } from 'react';
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import { words } from '../../data/words';
import Form from '../../components/form/Form';
import './Home.css';
import { getLocalUsedWords } from '../../utils';
import SpySound from "../../assets/spy.mp3";
export default function Home() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if audio file is valid
    audio.oncanplaythrough = () => {
      console.log('Audio file loaded successfully');
    };
    audio.onerror = (e) => {
      console.error('Error loading audio file:', e);
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  function clearLocal() {
    localStorage.removeItem('usedWords');
    window.location.reload();
  }

  return (
    <div style={{ backgroundColor: 'black' }}>
      <h1 style={{ textAlign: 'center', color: 'white' }}>
        Spy production təqdimmm edirrr....
      </h1>

      {/* Play/Pause button for background music */}
      <button
        onClick={toggleMusic}
        style={{
          display: 'block',
          margin: '20px auto',
          padding: '10px 20px',
          backgroundColor: '#ff0066',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>

      {getLocalUsedWords()?.length > 0 && (
        <h2
          onClick={clearLocal}
          style={{
            textAlign: 'center', color: 'white'
          }}
        >
          İstifadə olunan: {getLocalUsedWords()?.length} söz var, click edərək oyunu təmizlə
          <br />
          Açılmayan söz sayı: {words?.length - getLocalUsedWords()?.length}
        </h2>
      )}

      <div className="home">
        <Form />
      </div>
    </div>
  );
}
