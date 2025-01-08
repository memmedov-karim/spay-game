import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card/Card';
import './Game.css';
import * as wordSets from '../../data/words';
import { addToLocal, filterWords } from '../../utils';

const SpyWordDisplay = ({ relatedWords }) => {
  const [gameMode, setGameMode] = useState(() => {
    return localStorage.getItem('gameMode') || 'classic';
  });
  return (
    <div className="spy-role-container">
      <div className="spy-badge">
        <span className="spy-emoji">😎</span>
        <span className="spy-label">You are a Spy!</span>
      </div>
      { gameMode === "related" && <div className="related-words">
        <div className="related-words-title">Related Words:</div>
        <div className="related-words-list">
          {relatedWords.map((word, index) => (
            <span key={index} className="related-word-chip">
              {word.trim()}
            </span>
          ))}
        </div>
      </div>}
    </div>
  );
};

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
  const lng = localStorage.getItem('preferredLanguage') || 'az';
const [randomWord, setRandomWord] = useState("");
  useEffect(() => {
    const language = localStorage.getItem('preferredLanguage') || 'az';
    const wordList = language === 'az' ? wordSets.words : wordSets.englishWords;
    
    const randomWord = filterWords(wordList)[Math.floor(Math.random() * wordList.length)];
    setRandomWord(randomWord)
    addToLocal(randomWord);

    const positions = Array(playerCount).fill().map((_, index) => index);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Use first spayCount positions for spies
    const words = Array(playerCount).fill(randomWord);
    for (let i = 0; i < spayCount; i++) {
      words[positions[i]] = "😎";
    }

    setCombinedWords(words);
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
              {showWord ? (
                combinedWords[currentWordIndex] === "😎" ? (
                  <SpyWordDisplay 
                    relatedWords={wordSets.getRelatedWords(randomWord, lng)}
                  />
                ) : (
                  <div className="regular-player-word">
                    {combinedWords[currentWordIndex]}
                  </div>
                )
              ) : (
                <div className="player-prompt">
                  <span className="player-number">Player {currentWordIndex + 1}</span>
                  <span className="tap-instruction">Tap to reveal your word</span>
                </div>
              )}
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
