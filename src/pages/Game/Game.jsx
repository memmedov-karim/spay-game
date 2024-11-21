import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card/Card';
import './Game.css';
import { words } from '../../data/words';
import { addToLocal, filterWords } from '../../utils';

const Game = () => {
  const params = useParams();
  const { playercount, spaycount } = params;
  const playerCount = parseInt(playercount, 10);
  const spayCount = parseInt(spaycount, 10);
  console.log(params)
  const [combinedWords, setCombinedWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(240);

  useEffect(() => {
    const randomWord = filterWords(words)[Math.floor(Math.random() * words.length)];
    addToLocal(randomWord);
    const spayWords = Array(spayCount).fill("😎");
    const randomWords = Array(playerCount - spayCount).fill(randomWord);
    const shuffledWords = [...spayWords, ...randomWords].sort(() => Math.random() - 0.5);
    setCombinedWords(shuffledWords);
  }, [playerCount, spayCount]);

  const handleCardClick = () => {
    if (showWord) {
      setShowWord(false);
      if (currentWordIndex + 1 === combinedWords.length) {
        setGameStarted(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    } else {
      setShowWord(true);
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

  useEffect(() => {
    if (timerSeconds === 0) {
      setShowWord(true);
    }
  }, [timerSeconds]);

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
          <div className="spy-card-container" onClick={handleCardClick}>
            <strong className="spy-card-text">
              {showWord
                ? combinedWords[currentWordIndex]
                : `Player ${currentWordIndex + 1}: Open Word`}
            </strong>
          </div>
        ) : (
          <div className="spy-timer-container">
            <h2 className="spy-title">Game Started!</h2>
            <p className="spy-timer">Time Remaining: {formatTime()}</p>
            <div className="spy-card-grid">
              {combinedWords.map((word, index) => (
                <Card key={index} word={showWord ? word : "Open Word"} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
