import React, { useState, useEffect } from 'react';
import Form from '../../components/form/Form';
import { getLocalUsedWords } from '../../utils';
import { words } from '../../data/words';
import SpySound from "../../assets/spy.mp3";
import { translations } from '../../data/words';
import Navbar from '../../components/Navbar';
import './Home.css';

export default function Home() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const [gameMode, setGameMode] = useState(() => localStorage.getItem('gameMode') || 'classic');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    audio.loop = true;
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
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const handleGameModeChange = (event) => {
    const newMode = event.target.value;
    setGameMode(newMode);
    localStorage.setItem('gameMode', newMode);
  };

  return (
    <div className="super-home-container">
      <div className="super-bg-effect"></div>
      <Navbar
        language={language}
        gameMode={gameMode}
        onLanguageChange={handleLanguageChange}
        onGameModeChange={handleGameModeChange}
        onOpenModal={openModal}
        onToggleMusic={toggleMusic}
        isPlaying={isPlaying}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className="super-home-content">
        <section className="super-game-setup glassmorph">
          <Form language={language} gameMode={gameMode} />
        </section>
        {getLocalUsedWords()?.length > 0 && (
          <section className="super-game-stats glassmorph">
            <div className="super-stat-card">
              <span className="super-stat-label">{translations[language].usedWords}</span>
              <span className="super-stat-value">{getLocalUsedWords()?.length}</span>
            </div>
            <div className="super-stat-card">
              <span className="super-stat-label">{translations[language].remainingWords}</span>
              <span className="super-stat-value">{words?.length - getLocalUsedWords()?.length}</span>
            </div>
            <button className="super-reset-button" onClick={clearLocal}>
              {translations[language].resetGame}
            </button>
          </section>
        )}
      </main>
      {isModalOpen && (
        <div className="super-modal-backdrop" onClick={closeModal}>
          <div className="super-modal glassmorph" onClick={e => e.stopPropagation()}>
            <h2>{translations[language].modalTitle}</h2>
            <p>{translations[language].modalContent}</p>
            <button className="super-modal-close" onClick={closeModal}>
              {translations[language].close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
