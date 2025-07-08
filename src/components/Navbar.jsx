import React, { useRef, useEffect, useState } from 'react';
import SpyLogo from "../assets/spy-logo.png";
import { translations } from '../data/words';
import './Navbar.css';

export default function Navbar({
  language,
  gameMode,
  onLanguageChange,
  onGameModeChange,
  onOpenModal,
  onToggleMusic,
  isPlaying,
  isMenuOpen,
  setIsMenuOpen
}) {
  const menuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !event.target.closest('.super-hamburger')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsMenuOpen]);

  // Config array for navbar items
  const navbarItems = [
    {
      key: 'gameMode',
      type: 'select',
      icon: 'sports_esports',
      value: gameMode,
      onChange: onGameModeChange,
      options: [
        { value: 'classic', label: translations[language].classicMode },
        { value: 'related', label: translations[language].relatedWordsMode }
      ],
      label: translations[language].gameMode
    },
    {
      key: 'language',
      type: 'select',
      icon: 'language',
      value: language,
      onChange: onLanguageChange,
      options: [
        { value: 'en', label: 'English' },
        { value: 'az', label: 'Azerbaijani' },
        { value: 'tr', label: 'Turkish' }
      ],
      label: translations[language].language
    },
    {
      key: 'info',
      type: 'button',
      icon: 'info',
      onClick: onOpenModal,
      label: translations[language].whatOurAim
    },
    {
      key: 'music',
      type: 'button',
      icon: isPlaying ? 'music_off' : 'music_note',
      onClick: onToggleMusic,
      label: isPlaying ? translations[language].pauseMusic : translations[language].playMusic
    },
    {
      key: 'about',
      type: 'link',
      icon: 'help_outline',
      href: '/about', // Example internal link
      label: translations[language].about || 'About'
    }
    // Add more items here easily
  ];

  const renderItem = (item, isMobile = false) => {
    if (item.type === 'select') {
      return (
        <div className="super-navbar-item" key={item.key}>
          <span className="material-icons">{item.icon}</span>
          <select
            className="super-navbar-select"
            value={item.value}
            onChange={item.onChange}
            title={item.label}
          >
            {item.options.map(opt => (
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }
    if (item.type === 'button') {
      return (
        <button
          className="super-navbar-icon-btn"
          onClick={item.onClick}
          key={item.key}
          title={item.label}
        >
          <span className="material-icons">{item.icon}</span>
          {isMobile && <span className="button-text">{item.label}</span>}
        </button>
      );
    }
    if (item.type === 'link') {
      return (
        <a
          className="super-navbar-icon-btn super-navbar-link"
          href={item.href}
          key={item.key}
          title={item.label}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          <span className="material-icons">{item.icon}</span>
          {isMobile && <span className="button-text">{item.label}</span>}
        </a>
      );
    }
    // Add more types as needed
    return null;
  };

  return (
    <nav className="super-navbar glassmorph">
      <div className="super-navbar-left">
        <img src={SpyLogo} alt="Spy Game Logo" className="super-navbar-logo" />
        <h1 className="super-navbar-title neon-text">{translations[language].title}</h1>
      </div>
      {!isMobile && (
        <div className="super-navbar-center">
          {navbarItems.map(item => renderItem(item))}
        </div>
      )}
      <div className="super-navbar-right">
        {isMobile ? (
          <button
            className={`super-hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        ) : null}
      </div>
      {isMobile && (
        <div
          ref={menuRef}
          className={`super-navbar-mobile glassmorph ${isMenuOpen ? 'open' : ''}`}
        >
          <div className="super-navbar-mobile-content">
            {navbarItems.map(item => renderItem(item, true))}
          </div>
        </div>
      )}
    </nav>
  );
} 