import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Form.css';

export default function Form() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');

  return (
    <div className="spy-form-container">
      <h1 className="spy-form-title">Spy Game Setup</h1>
      <p className="spy-form-subtitle">Prepare the game by entering participant and spy counts!</p>
      <form className="spy-form">
        <div className="form-group">
          <label htmlFor="number1">Total Participants</label>
          <input
            type="number"
            id="number1"
            min={0}
            value={number1}
            onChange={(e) => setNumber1(e.target.value)}
            placeholder="Enter the number of players..."
            className="spy-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="number2">Spy Count</label>
          <input
            type="number"
            id="number2"
            min={0}
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
            placeholder="Enter the number of spies..."
            className="spy-input"
          />
        </div>
        {parseInt(number1) - parseInt(number2) >= 0 && (
          <Link className="start-game-button" to={`/game/${number1 || 0}/${number2 || 0}`}>
            Start Game
          </Link>
        )}
      </form>
    </div>
  );
}
