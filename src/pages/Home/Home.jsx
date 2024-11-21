import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from '../../components/form/Form';
import { getLocalUsedWords } from '../../utils';
import { words } from '../../data/words';
import SpySound from "../../assets/spy.mp3";
import SpyLogo from "../../assets/spy-logo.png"; // Import the logo image
import './Home.css';

export default function Home() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    audio.loop = true; // Loop the music for continuous play
    audio.oncanplaythrough = () => console.log('Audio loaded successfully');
    audio.onerror = (e) => console.error('Error loading audio:', e);
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const clearLocal = () => {
    localStorage.removeItem('usedWords');
    window.location.reload();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="spy-home">
      <div className="spy-header">
        {/* Logo Section */}
        <div className="spy-logo-container">
          <img src={SpyLogo} alt="Spy Game Logo" className="spy-logo" />
        </div>

        {/* Title and Subtitle */}
        <div className="spy-header-text">
          <h1 className="spy-title">Spy Game</h1>
          <p className="spy-subtitle">No one should know that you are a spy!</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="spy-menu">
        <button className="spy-menu-item" onClick={openModal}>What Our Aim</button>
      </div>

      {/* Music Toggle Button */}
      <button className="spy-music-button" onClick={toggleMusic}>
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>

      {/* Game Status Section */}
      {getLocalUsedWords()?.length > 0 && (
        <div className="spy-status">
          <p>
            Used words: <strong>{getLocalUsedWords()?.length}</strong>
          </p>
          <p>
            Remaining words: <strong>{words?.length - getLocalUsedWords()?.length}</strong>
          </p>
          <button className="spy-clear-button" onClick={clearLocal}>
            Reset Game
          </button>
        </div>
      )}

      {/* Game Setup Form */}
      <div className="spy-game-setup">
        <Form />
      </div>

      {/* Modal for "What Our Aim" */}
      {isModalOpen && (
        <div className="spy-modal-overlay">
          <div className="spy-modal-content">
            <h2>What Our Aim Is</h2>
            <p>The "Spy" game was created with a simple yet powerful goal: to bring people together through an engaging and fun experience. After a long day of work, it's important to have moments of joy and relaxation. "Spy" offers a perfect opportunity to unwind, enjoy, and bond with others.
              This game is not just about solving puzzles or completing missions; it’s about creating connections. By playing together, people can communicate, collaborate, and build camaraderie in a lighthearted, interactive setting. Whether you’re with friends, family, or colleagues, "Spy" fosters an environment where everyone can have fun, laugh, and connect—ultimately making each interaction more enjoyable.
              We believe that through games like "Spy," we can make people’s lives more enjoyable and fulfilling by providing a shared space for communication, excitement, and happiness after a productive day.</p>
            <button className="spy-close-modal" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
