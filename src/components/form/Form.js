import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserSecret, FaUsers, FaPlay } from 'react-icons/fa';
import './Form.css';
import { formTranslations } from '../../data/words';
export default function Form({ language, gameMode }) {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(number1) - parseInt(number2) >= 0) {
      navigate(`/game/${number1}/${number2}?mode=${gameMode}`);
    }
  };

  return (
    <div className="super-center">
      <div className="spy-form-container">
        <div className="spy-form-header">
          <div className="spy-logo-animation"></div>
          <h1 className="spy-form-title">{formTranslations[language].title}</h1>
          <p className="spy-form-subtitle">{formTranslations[language].subtitle}</p>
        </div>
        <form className="spy-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <FaUsers className="icon" />
              <input
                type="number"
                id="number1"
                min={1}
                value={number1}
                onChange={(e) => setNumber1(e.target.value === "0" ? "1" : e.target.value)}
                placeholder={formTranslations[language].participantsPlaceholder}
                className="spy-input"
              />
            </div>
            <label htmlFor="number1">{formTranslations[language].participants}</label>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaUserSecret className="icon" />
              <input
                type="number"
                id="number2"
                min={0}
                value={number2}
                onChange={(e) => setNumber2(e.target.value)}
                placeholder={formTranslations[language].spiesPlaceholder}
                className="spy-input"
              />
            </div>
            <label htmlFor="number2">{formTranslations[language].spies}</label>
          </div>

          <button 
            type="submit" 
            className={`start-game-button ${!(parseInt(number1) - parseInt(number2) >= 0) ? 'disabled' : ''}`}
            disabled={!(parseInt(number1) - parseInt(number2) >= 0)}
          >
            <FaPlay className="play-icon" />
            <span>{formTranslations[language].startGame}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
