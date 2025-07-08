import React, { useState, useEffect } from 'react';
import { aboutContent } from '../../data/words';
import './About.css';
import { Link } from 'react-router-dom';

const About = () => {
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const t = aboutContent[language];

  console.log(t)
  useEffect(() => {
    const onStorage = () => setLanguage(localStorage.getItem('preferredLanguage') || 'en');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="about-container">
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem', color: '#00bcd4', textDecoration: 'underline', fontWeight: 'bold' }}>
        ← Home
      </Link>
      <h2>{t.title}</h2>
      <ul>
        {t.steps.map((step, idx) => <li key={idx}>{step}</li>)}
      </ul>
      <p className="about-winner"><strong>{t.winner}</strong></p>
      <p className="about-note">{t.note}</p>
    </div>
  );
};

export default About; 