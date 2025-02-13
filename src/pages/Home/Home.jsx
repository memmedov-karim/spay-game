import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Form from '../../components/form/Form';
import { getLocalUsedWords } from '../../utils';
import { words } from '../../data/words';
import SpySound from "../../assets/spy.mp3";
import SpyLogo from "../../assets/spy-logo.png";
import { translations } from '../../data/words';
import './Home.css';

export default function Home() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const [gameMode, setGameMode] = useState(() => localStorage.getItem('gameMode') || 'classic');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && 
          !menuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(prevState => !prevState);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={SpyLogo} alt="Spy Game Logo" className="navbar-logo" />
          <h1 className="navbar-title">{translations[language].title}</h1>
        </div>
        
        <div className="navbar-desktop">
          <div className="navbar-item mode-selector">
            <select 
              id="gameModeDesktop" 
              value={gameMode} 
              onChange={handleGameModeChange}
              className="navbar-select"
              title={translations[language].gameMode}
            >
              <option value="classic">{translations[language].classicMode}</option>
              <option value="related">{translations[language].relatedWordsMode}</option>
            </select>
          </div>

          <select 
            className="navbar-item language-select" 
            value={language} 
            onChange={handleLanguageChange}
            title="Select Language"
          >
            <option value="en">English</option>
            <option value="az">Azerbaijani</option>
            <option value="tr">Turkish</option>
          </select>

          <button 
            className="navbar-item info-btn" 
            onClick={openModal}
            title={translations[language].whatOurAim}
          >
            <span className="material-icons">info</span>
          </button>

          <button 
            className="navbar-item music-btn" 
            onClick={toggleMusic}
            title={isPlaying ? translations[language].pauseMusic : translations[language].playMusic}
          >
            <span className="material-icons">
              {isPlaying ? 'music_off' : 'music_note'}
            </span>
          </button>
        </div>
        
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div 
          ref={menuRef}
          className={`navbar-mobile ${isMenuOpen ? 'open' : ''}`}
        >
          <div className="navbar-item mode-selector">
            <label htmlFor="gameMode">{translations[language].gameMode}</label>
            <select 
              id="gameMode" 
              value={gameMode} 
              onChange={(e) => {
                handleGameModeChange(e);
                handleMenuItemClick();
              }}
              className="navbar-select"
            >
              <option value="classic">{translations[language].classicMode}</option>
              <option value="related">{translations[language].relatedWordsMode}</option>
            </select>
          </div>

          <div className="navbar-actions">
            <button 
              className="navbar-item music-toggle" 
              onClick={() => {
                toggleMusic();
                handleMenuItemClick();
              }}
            >
              <span className="material-icons">
                {isPlaying ? 'music_off' : 'music_note'}
              </span>
              <span className="button-text">
                {isPlaying ? translations[language].pauseMusic : translations[language].playMusic}
              </span>
            </button>

            <button 
              className="navbar-item about-btn" 
              onClick={() => {
                openModal();
                handleMenuItemClick();
              }}
            >
              <span className="material-icons">info</span>
              <span className="button-text">{translations[language].whatOurAim}</span>
            </button>

            <select 
              className="navbar-item language-select" 
              value={language} 
              onChange={(e) => {
                handleLanguageChange(e);
                handleMenuItemClick();
              }}
              title="Select Language"
            >
              <option value="en">English</option>
              <option value="az">Azerbaijani</option>
              <option value="tr">Turkish</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="home-content">
        <section className="game-setup">
          <Form language={language} gameMode={gameMode} />
        </section>

        {getLocalUsedWords()?.length > 0 && (
          <section className="game-stats">
            <div className="stat-card">
              <span className="stat-label">{translations[language].usedWords}</span>
              <span className="stat-value">{getLocalUsedWords()?.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">{translations[language].remainingWords}</span>
              <span className="stat-value">{words?.length - getLocalUsedWords()?.length}</span>
            </div>
            <button className="reset-button" onClick={clearLocal}>
              {translations[language].resetGame}
            </button>
          </section>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{translations[language].modalTitle}</h2>
            <p>{translations[language].modalContent}</p>
            <button className="modal-close" onClick={closeModal}>
              {translations[language].close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
