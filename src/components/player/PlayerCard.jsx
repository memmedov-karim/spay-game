import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Card from '../../components/card/Card'; // Used only after the game starts
import './PlayerCard.css';
import * as wordSets from '../../data/words';
import { addToLocal, filterWords } from '../../utils';
import spySound from '../../assets/flip-card.mp3';

// Fisher-Yates shuffle for better randomness
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Redesign PlayerCard for immersive spy dossier look
const PlayerCard = ({ word, onClick, isFlipped, avatar, username, role, stats, liveStatus, variant, mode, relatedWords, isSpy, cardIndex, avatarSeed }) => {
  // Card variant classes for rare/legendary
  const variantClass = variant ? `player-card-variant-${variant}` : '';
  // Live status color
  const statusColor = liveStatus === 'online' ? '#39ff14' : liveStatus === 'in-mission' ? '#ffae00' : '#ff1744';

  // Only click-to-flip
  const handleCardClick = (e) => {
    onClick();
  };

  // Generate a random avatar URL based on username or cardIndex
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(avatarSeed || username || cardIndex || Math.random())}`;

  return (
    <div
      className={`player-card spy-glassmorph ${isFlipped ? 'flipped' : ''} ${variantClass}`}
      tabIndex={0}
      aria-pressed={isFlipped}
      role="button"
      onClick={handleCardClick}
    >
      {/* Card front: dossier cover */}
      <div className="card-front">
        <div className="spy-card-header">
          <div className="spy-avatar-wrapper">
            <img
              src={avatarUrl}
              alt="Agent Avatar"
              className="spy-avatar"
            />
            <span className="spy-status-indicator" style={{ background: statusColor }} />
          </div>
          <div className="spy-meta">
            <span className="spy-username">{username || 'Agent X'}</span>
            <span className="spy-role">{role || 'Unknown Role'}</span>
          </div>
        </div>
        {/* Replace stats with avatar image */}
        <div className="spy-card-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* Avatar already shown above, so leave this empty or add a subtle divider if needed */}
        </div>
        <div className="spy-card-footer">
          <span className="spy-card-action-icon" title="View dossier">
            <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#39ff14" strokeWidth="2" fill="none" /><path d="M6 10a4 4 0 0 1 8 0" stroke="#39ff14" strokeWidth="2" fill="none" /></svg>
          </span>
          <span className="spy-card-action-icon" title="Message agent">
            <svg width="20" height="20" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#00eaff" strokeWidth="2" fill="none" /><path d="M3 5l7 6 7-6" stroke="#00eaff" strokeWidth="2" fill="none" /></svg>
          </span>
        </div>
        <div className="spy-card-micro fx-radar" />
        <div className="spy-card-micro fx-scanlines" />
        <div className="spy-flip-hint">
          <span className="spy-flip-label">Click to Flip</span>
        </div>
        <div className="spy-card-title">Tap to Reveal</div>
      </div>
      {/* Card back: secret word and agent bio */}
      <div className="card-back">
        <div className="spy-card-back-content">
          <div className="spy-card-back-title">Agent Code Name</div>
          <div className="spy-card-back-word">
            {mode === 'related' && isSpy && Array.isArray(relatedWords) && relatedWords.length > 0 ? (
              <>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.3em' }}>😎</span>
                <div className="spy-related-words-chips">
                  {relatedWords.map((w, i) => (
                    <span key={i} className="spy-related-chip">{w}</span>
                  ))}
                </div>
              </>
            ) : (
              word
            )}
          </div>
          <div className="spy-card-back-bio">Bio: {stats?.bio || 'Classified'}</div>
        </div>
        <div className="spy-card-micro fx-radar" />
        <div className="spy-card-micro fx-scanlines" />
      </div>
    </div>
  );
};



const Game = () => {
  const params = useParams();
  const { playercount, spaycount } = params;
  const playerCount = parseInt(playercount, 10);
  const spayCount = parseInt(spaycount, 10);

  // Get mode and language from localStorage
  const mode = localStorage.getItem('gameMode') || 'classic';
  const language = localStorage.getItem('preferredLanguage') || 'az';

  // Select correct word list
  const wordList = language === 'az' ? wordSets.words
    : language === 'tr' ? wordSets.turkishWords
    : wordSets.englishWords;

  const [combinedWords, setCombinedWords] = useState([]);
  const [usernames, setUsernames] = useState([]); // Store random usernames
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 minutes in seconds
  const [isTransitioning, setIsTransitioning] = useState(false); // Prevent fast double-clicks
  const [randomWord, setRandomWord] = useState(null); // The selected word object
  const [avatarSeeds, setAvatarSeeds] = useState([]);

  useEffect(() => {
    // Pick a random word object from filtered list
    const filtered = filterWords(wordList);
    const randomWordObj = filtered[Math.floor(Math.random() * filtered.length)];
    setRandomWord(randomWordObj);
    addToLocal(randomWordObj);

    // Shuffle player positions
    const positions = Array(playerCount).fill().map((_, idx) => idx);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Assign spies and regulars
    const wordsArr = Array(playerCount).fill(randomWordObj);
    for (let i = 0; i < spayCount; i++) {
      wordsArr[positions[i]] = '😎';
    }
    setCombinedWords(wordsArr);

    // Generate random usernames for each card
    const shuffledNames = shuffleArray([...wordSets.spyNames]);
    const names = Array(wordsArr.length)
      .fill(null)
      .map((_, i) => shuffledNames[i % shuffledNames.length] + ' #' + (Math.floor(Math.random()*900)+100));
    setUsernames(names);

    // Generate random avatar seeds for each card
    const seeds = Array(wordsArr.length)
      .fill(null)
      .map(() => Math.random().toString(36).substring(2, 12));
    setAvatarSeeds(seeds);
  }, [playerCount, spayCount, mode, language]);

  const handlePlayerCardClick = () => {
    if (isTransitioning) return; // Prevent action during animation
    // Play flip sound
    const audio = new Audio(spySound);
    audio.currentTime = 0;
    audio.play();
    setIsTransitioning(true);
    if (flipped) {
      setFlipped(false);
      setTimeout(() => {
        if (currentPlayerIndex + 1 < combinedWords.length) {
          setCurrentPlayerIndex(currentPlayerIndex + 1);
        } else {
          setGameStarted(true);
        }
        setIsTransitioning(false);
      }, 700); // Match CSS flip duration
    } else {
      setFlipped(true);
      setTimeout(() => setIsTransitioning(false), 700); // Match CSS flip duration
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
    <div className="spy-game spy-game-bg">
      <button className="spy-reset-button spy-btn-premium" onClick={restartGame}>
        <span className="spy-btn-icon">&#8634;</span> Restart Game
      </button>

      <div className="spy-game-content">
        {!gameStarted ? (
          <div className="spy-card-container">
            <div className="spy-turn-banner">
              <span className="spy-turn-label">Current Agent</span>
              <span className="spy-turn-player">Player <span className="spy-turn-number">{currentPlayerIndex + 1}</span>'s Turn</span>
            </div>
            <PlayerCard
              word={combinedWords[currentPlayerIndex] === '😎' ? '😎' : (combinedWords[currentPlayerIndex]?.mainWord || combinedWords[currentPlayerIndex])}
              onClick={handlePlayerCardClick}
              isFlipped={flipped}
              username={usernames[currentPlayerIndex]}
              mode={mode}
              isSpy={combinedWords[currentPlayerIndex] === '😎'}
              relatedWords={
                mode === 'related' && combinedWords[currentPlayerIndex] === '😎' && randomWord
                  ? wordSets.getRelatedWords(randomWord, language, 2)
                  : undefined
              }
              cardIndex={currentPlayerIndex}
              avatarSeed={avatarSeeds[currentPlayerIndex]}
            />
          </div>
        ) : (
          <div className="spy-timer-container spy-game-started">
            <h2 className="spy-title spy-game-started-title">
              <span className="spy-title-icon">&#128274;</span> Mission In Progress
            </h2>
            <div className="spy-timer-box">
              <span className="spy-timer-label">Time Remaining</span>
              <span className={`spy-timer spy-timer-countdown${timerSeconds <= 10 ? ' spy-timer-danger' : ''}`}>{formatTime()}</span>
            </div>
            <div className="spy-card-grid spy-card-grid-premium">
              {combinedWords.map((word, index) => {
                let isSpy = word === '😎';
                let relatedWords = undefined;
                if (mode === 'related' && isSpy && randomWord) {
                  relatedWords = wordSets.getRelatedWords(randomWord, language, 2);
                }
                return (
                  <Card
                    key={index}
                    word={timerSeconds === 0 ? (word === '😎' ? '😎' : (word?.mainWord || word)) : ''}
                    relatedWords={timerSeconds === 0 ? relatedWords : undefined}
                    isSpy={isSpy}
                    mode={mode}
                  />
                );
              })}
            </div>
            {timerSeconds === 0 && (
              <div className="spy-reveal-banner">All Agent Cards Revealed!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
