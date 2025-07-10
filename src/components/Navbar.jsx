import React, { useState, useRef, useEffect } from 'react';
import SpyLogo from "../assets/spy-logo.png";
import { translations } from '../data/words';
import './Navbar.css';

const MOBILE_MAX_VISIBLE = 4;

export default function Navbar({
  language = 'en',
  gameMode = 'classic',
  onLanguageChange = () => {},
  onGameModeChange = () => {},
  onOpenModal = () => {},
  onToggleMusic = () => {},
  isPlaying = false,
  translations: t = translations,
  ...props
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDrawerOpen]);

  // Dynamic menu config
  const MENU_ITEMS = [
    {
      key: 'gameMode',
      type: 'select',
      icon: 'sports_esports',
      value: gameMode,
      onChange: onGameModeChange,
      options: [
        { value: 'classic', label: t[language].classicMode },
        { value: 'related', label: t[language].relatedWordsMode }
      ],
      label: t[language].gameMode
    },
    {
      key: 'language',
      type: 'select',
      icon: 'language',
      value: language,
      onChange: onLanguageChange,
      options: [
        { value: 'en', label: 'Eng' },
        { value: 'az', label: 'Az' },
        { value: 'tr', label: 'Tr' }
      ],
      label: t[language].language || 'Language'
    },
    {
      key: 'info',
      type: 'button',
      icon: 'info',
      onClick: onOpenModal,
      label: t[language].whatOurAim
    },
    {
      key: 'music',
      type: 'button',
      icon: isPlaying ? 'music_off' : 'music_note',
      onClick: onToggleMusic,
      label: isPlaying ? t[language].pauseMusic : t[language].playMusic
    },
    {
      key: 'about',
      type: 'link',
      icon: 'help_outline',
      href: '/about',
      label: t[language].about || 'About'
    },
    {
      key: 'reset',
      type: 'button',
      icon: 'delete_forever',
      onClick: () => {
        localStorage.removeItem('usedWords');
        window.location.reload();
      },
      label: t[language].resetGame || 'Reset Game',
      mobileOnly: true
    }
    // Add more items here easily
  ];

  // Only show first two items (game mode and language) in mobile bar, rest in More
  const visibleMobileItems = isMobile ? MENU_ITEMS.slice(0, 2) : MENU_ITEMS;
  const overflowMobileItems = isMobile ? MENU_ITEMS.slice(2).filter(item => !item.mobileOnly) : [];
  const mobileOnlyItems = isMobile ? MENU_ITEMS.filter(item => item.mobileOnly) : [];

  // Render a single menu item
  const renderMenuItem = (item, { isOverflow = false } = {}) => {
    if (item.type === 'select') {
      return (
        <div className="spy-navbar-item" key={item.key}>
          <span className="material-icons spy-navbar-icon">{item.icon}</span>
          <select
            className="spy-navbar-select"
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
          className="spy-navbar-item"
          onClick={item.onClick}
          key={item.key}
          title={item.label}
        >
          <span className="material-icons spy-navbar-icon">{item.icon}</span>
          <span className="spy-navbar-label">{item.label}</span>
        </button>
      );
    }
    if (item.type === 'link') {
      return (
        <a
          className="spy-navbar-item"
          href={item.href}
          key={item.key}
          title={item.label}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
        >
          <span className="material-icons spy-navbar-icon">{item.icon}</span>
          <span className="spy-navbar-label">{item.label}</span>
        </a>
      );
    }
    return null;
  };

  // Desktop Navbar
  const renderDesktop = () => (
    <nav className="spy-navbar glassmorph">
      <div className="spy-navbar-left">
        <img src={SpyLogo} alt="Spy Game Logo" className="spy-navbar-logo" />
        <h1 className="spy-navbar-title neon-text">{t[language].title}</h1>
      </div>
      <div className="spy-navbar-center">
        {MENU_ITEMS.map(item => renderMenuItem(item))}
      </div>
    </nav>
  );

  // Mobile Navbar (bottom bar)
  const renderMobile = () => (
    <>
      <nav className="spy-navbar-mobile glassmorph">
        {visibleMobileItems.map(item => renderMenuItem(item))}
        {overflowMobileItems.length > 0 && (
          <button
            className="spy-navbar-item spy-navbar-more-btn"
            onClick={() => setIsDrawerOpen(true)}
            tabIndex={0}
            aria-label="More"
          >
            <span className="material-icons spy-navbar-icon">more_horiz</span>
            <span className="spy-navbar-label">More</span>
          </button>
        )}
      </nav>
      {/* Drawer/Modal for overflow */}
      <div className={`spy-navbar-drawer-backdrop${isDrawerOpen ? ' open' : ''}`}></div>
      <div
        className={`spy-navbar-drawer glassmorph${isDrawerOpen ? ' open' : ''}`}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="spy-navbar-drawer-close"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close"
        >
          <span className="material-icons">close</span>
        </button>
        <div className="spy-navbar-drawer-content">
          {overflowMobileItems.map(item => renderMenuItem(item, { isOverflow: true }))}
          {mobileOnlyItems.map(item => renderMenuItem(item, { isOverflow: true }))}
        </div>
      </div>
    </>
  );

  return isMobile ? renderMobile() : renderDesktop();
} 