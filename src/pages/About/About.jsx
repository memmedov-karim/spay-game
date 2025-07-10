import React, { useState, useEffect, useRef } from 'react';
import { aboutContent, howToPlay } from '../../data/words';
import './About.css';
import { Link } from 'react-router-dom';
import { FaUserSecret } from 'react-icons/fa';
import Navbar from '../../components/Navbar';

const About = ({language, gameMode, handleLanguageChange, handleGameModeChange, openModal, toggleMusic, isPlaying, isMenuOpen, setIsMenuOpen}) => {
//   const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const t = aboutContent[language];
  const how = howToPlay[language];
  const [showSecret, setShowSecret] = useState(false);
  const typewriterRef = useRef(null);
  const [typedText, setTypedText] = useState('');

  // Animation state for How to Play steps
  const [showHow, setShowHow] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const intervalRef = useRef();

  // Typewriter effect for headline
  useEffect(() => {
    setTypedText('');
    let i = 0;
    const text = t.heroTitle;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [t.heroTitle]);

  // Reset animation when language changes
  useEffect(() => {
    setShowHow(false);
    setVisibleSteps(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [language]);

  // Animate steps one by one
  useEffect(() => {
    if (!showHow) {
      setVisibleSteps(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setVisibleSteps(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setVisibleSteps(i);
      if (i >= how.steps.length) {
        clearInterval(intervalRef.current);
      }
    }, 400);
    return () => clearInterval(intervalRef.current);
  }, [showHow, how.steps.length, language]);

  // Replay handler
  const handleReplay = () => {
    setShowHow(false);
    setTimeout(() => setShowHow(true), 100);
  };

  return (
    <div className="about-root">
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
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <Link to="/" className="about-home-link">← Home</Link>
          <h1 className="about-hero-title">{t.heroTitle}</h1>
          {/* <p className="about-hero-sub">{t.heroSub}</p> */}
        </div>
      </section>

      {/* How to Play Section */}
      <section className="about-howtoplay glass-card">
        <h2 className="how-title"><span role="img" aria-label="mission">🗂️</span> {how.title}</h2>
        <button className="briefing-btn" onClick={() => setShowHow(true)} disabled={showHow}>
          {showHow ? 'Briefing in Progress...' : 'Start Briefing'}
        </button>
        <ul className="how-steps">
          {how.steps.map((step, idx) => (
            <li
              key={idx}
              className={`how-step${showHow && idx < visibleSteps ? ' how-step-visible' : ''}`}
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              <span className="how-step-index">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.</span> {step.replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ul>
        {showHow && visibleSteps >= how.steps.length && (
          <div className="how-summary">
            <p className="how-winner"><strong>{how.winner}</strong></p>
            <p className="how-note">{how.note}</p>
            <button className="briefing-btn" onClick={handleReplay} style={{marginTop: 12}}>
              Replay Briefing
            </button>
          </div>
        )}
      </section>

      {/* Mission Section */}
      {/* <section className="about-mission glass-card">
        <h2>{t.missionTitle}</h2>
        <p>{t.missionText}</p>
      </section> */}

      {/* Team Section (optional) */}
      {/* {t.team && t.team.length > 0 && (
        <section className="about-team">
          <h2>{t.teamTitle}</h2>
          <div className="about-team-cards">
            {t.team.map((agent, idx) => (
              <div className="agent-card" key={idx}>
                <div className="agent-img-blur">
                  <FaUserSecret size={48} />
                </div>
                <div className="agent-info">
                  <div className="agent-codename">{agent.codename}</div>
                  <div className="agent-role">{agent.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )} */}
      {/* Contact / CTA Section */}
      <section className="about-contact">
        <h2>{t.contactTitle}</h2>
        <p>{t.contactText}</p>
        <div className="about-contact-details">
          <div className="about-contact-row">
            <span className="material-icons" style={{verticalAlign: 'middle', marginRight: 8}}>phone</span>
            <a href={`tel:${t.contactPhone || '+994702388838'}`} className="about-contact-link">
              {t.contactPhone || '070-238-88-38'}
            </a>
          </div>
          <div className="about-contact-row">
            <span className="material-icons" style={{verticalAlign: 'middle', marginRight: 8, color: '#0A66C2'}}>public</span>
            <a
              href={t.contactLinkedin || 'https://www.linkedin.com/in/shikhkarim/'}
              className="about-contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contactLinkedinLabel || 'LinkedIn Profile'}
            </a>
          </div>
          <div className="about-contact-row">
            <span className="material-icons" style={{verticalAlign: 'middle', marginRight: 8}}>email</span>
            <a href={`mailto:${t.contactEmail || 'sixkerimmemmedov2001@gmail.com'}`} className="about-contact-link">
              {t.contactEmail || 'sixkerimmemmedov2001@gmail.com'}
            </a>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default About; 