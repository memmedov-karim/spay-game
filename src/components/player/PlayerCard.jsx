import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card/Card'; // Used only after the game starts
import './Game.css';
import { words } from '../../data/words';
import { addToLocal, filterWords } from '../../utils';

const PlayerCard = ({ word, onClick, isFlipped }) => {
  return (
    <div className={`player-card ${isFlipped ? 'flipped' : ''}`} onClick={onClick}>
      <div className="card-front">Open Word</div>
      <div className="card-back">{word}</div>
    </div>
  );
};

const Game = () => {
  const params = useParams();
  const { playercount, spaycount } = params;
  const playerCount = parseInt(playercount, 10);
  const spayCount = parseInt(spaycount, 10);

  const [combinedWords, setCombinedWords] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 minutes in seconds

  useEffect(() => {
    const randomWord = filterWords(words)[Math.floor(Math.random() * words.length)];
    addToLocal(randomWord);
    const spayWords = Array(spayCount).fill("😎");
    const randomWords = Array(playerCount - spayCount).fill(randomWord);
    const shuffledWords = [...spayWords, ...randomWords].sort(() => Math.random() - 0.5);
    setCombinedWords(shuffledWords);
  }, [playerCount, spayCount]);

  const handlePlayerCardClick = () => {
    if (flipped) {
      setFlipped(false);
      if (currentPlayerIndex + 1 < combinedWords.length) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        setGameStarted(true);
      }
    } else {
      setFlipped(true);
    }
  };

  useEffect(() => {
    let interval;
    if (gameStarted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timerSeconds]);

  const formatTime = () => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const restartGame = () => {
    window.location = '/';
  };

  return (
    <div className="spy-game">
      <button className="spy-reset-button" onClick={restartGame}>
        Restart Game
      </button>

      <div className="spy-game-content">
        {!gameStarted ? (
          <div className="spy-card-container">
            <h2>Player {currentPlayerIndex + 1}'s Turn</h2>
            <PlayerCard
              word={combinedWords[currentPlayerIndex]}
              onClick={handlePlayerCardClick}
              isFlipped={flipped}
            />
          </div>
        ) : (
          <div className="spy-timer-container">
            <h2 className="spy-title">Game Started!</h2>
            <p className="spy-timer">Time Remaining: {formatTime()}</p>
            <div className="spy-card-grid">
              {combinedWords.map((word, index) => (
                <Card key={index} word={word} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
