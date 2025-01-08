import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Form from '../../components/form/Form';
import { getLocalUsedWords } from '../../utils';
import { words } from '../../data/words';
import SpySound from "../../assets/spy.mp3";
import SpyLogo from "../../assets/spy-logo.png";
import './Home.css';

export default function Home() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  // Initialize language state from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  // Add new state for game mode
  const [gameMode, setGameMode] = useState(() => {
    return localStorage.getItem('gameMode') || 'classic';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    // Close the mobile menu when opening modal
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update language toggle function to persist in localStorage
  const toggleLanguage = () => {
    setLanguage(prevLang => {
      const newLang = prevLang === 'en' ? 'az' : 'en';
      localStorage.setItem('preferredLanguage', newLang);
      return newLang;
    });
  };

  // Add function to handle game mode change
  const handleGameModeChange = (event) => {
    const newMode = event.target.value;
    setGameMode(newMode);
    localStorage.setItem('gameMode', newMode);
  };

  // Update translations object with Azerbaijani
  const translations = {
    en: {
      title: 'Spy Game',
      subtitle: 'No one should know that you are a spy!',
      whatOurAim: 'What Our Aim',
      playMusic: 'Play Music',
      pauseMusic: 'Pause Music',
      usedWords: 'Used words',
      remainingWords: 'Remaining words',
      resetGame: 'Reset Game',
      modalTitle: 'What Our Aim Is',
      modalContent: 'The "Spy" game was created with a simple yet powerful goal: to bring people together through an engaging and fun experience...',
      close: 'Close',
      gameMode: 'Game Mode',
      classicMode: 'Classic Mode',
      relatedWordsMode: 'Related Words Mode',
      classicModeDescription: 'Classic spy game with single word per player',
      relatedWordsDescription: 'Spy game with related words shown under spy word'
    },
    az: {
      title: 'Casus Oyunu',
      subtitle: 'Heç kim bilməməlidir ki, sən casussan!',
      whatOurAim: 'Məqsədimiz Nədir',
      playMusic: 'Musiqini Başlat',
      pauseMusic: 'Musiqini Dayandır',
      usedWords: 'İstifadə edilmiş sözlər',
      remainingWords: 'Qalan sözlər',
      resetGame: 'Oyunu Sıfırla',
      modalTitle: 'Məqsədimiz Nədir',
      modalContent: '"Casus" oyunu insanları maraqlı və əyləncəli bir təcrübə ilə bir araya gətirmək üçün sadə, lakin güclü bir məqsədlə yaradılıb...',
      close: 'Bağla',
      gameMode: 'Oyun Rejimi',
      classicMode: 'Klassik Rejim',
      relatedWordsMode: 'Əlaqəli Sözlər Rejimi',
      classicModeDescription: 'Hər oyunçu üçün tək söz olan klassik casus oyunu',
      relatedWordsDescription: 'Casus sözün altında əlaqəli sözlərin göstərildiyi oyun'
    }
  };

  // Close menu when clicking outside
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

  // Handle clicks on menu items
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
        
        {/* Desktop Navigation */}
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

          <button 
            className="navbar-item language-btn" 
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to Azerbaijani' : 'Switch to English'}
          >
            {language === 'en' ? 'AZ' : 'EN'}
          </button>

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
        
        {/* Mobile Hamburger Button */}
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

        {/* Mobile Menu */}
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

            <button 
              className="navbar-item language-toggle" 
              onClick={() => {
                toggleLanguage();
                handleMenuItemClick();
              }}
            >
              <span className="button-text">
                {language === 'en' ? 'Switch to Azerbaijani' : 'Switch to English'}
              </span>
              <span className="language-code">{language === 'en' ? 'AZ' : 'EN'}</span>
            </button>
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
