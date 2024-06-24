import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/card/Card'; // Assuming Card component path is correct
import './Game.css';
import { words } from '../../data/words';

const Game = () => {
  const params = useParams();
  const { playercount, spaycount } = params;
  const playerCount = parseInt(playercount, 10);
  const spayCount = parseInt(spaycount, 10);
  console.log(playerCount,spayCount)
  // Select one random word from the words array
  const [combinedWords,setcombinedWords] = useState([]);
  useEffect(()=>{
    if(playerCount===0 || spayCount===0){
        window.location = '/';
        return;
      }
  },[])
  
  // Combine and shuffle the array
  useEffect(()=>{
    const randomWord =words[Math.floor(Math.random() * words.length)];

  // Generate the array with the required words
  const spayWords = Array(spayCount).fill("spay");
  const randomWords = Array(playerCount - spayCount).fill(randomWord);
    const combinedWords = [...spayWords, ...randomWords];
  //console.log(combinedWords)
  for (let i = combinedWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedWords[i], combinedWords[j]] = [combinedWords[j], combinedWords[i]];
  }
  setcombinedWords(combinedWords)
  },[playerCount,spayCount])

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(240); // 4 minutes in seconds

  // Function to handle card click
  const handleCardClick = () => {
    if (showWord) {
      setShowWord(false);
      if (currentWordIndex + 1 === combinedWords.length) {
        // All words revealed, start the game
        setGameStarted(true);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    } else {
      setShowWord(true);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, timerSeconds]);

  // Function to format remaining time as mm:ss
  const formatTime = () => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to open all cards when time is up
  const openAllCards = () => {
    setShowWord(true);
  };

  // Trigger opening all cards when timer reaches zero
  useEffect(() => {
    if (timerSeconds === 0) {
      openAllCards();
    }
  }, [timerSeconds]);
  const restartgame = () => {
    window.location = '/'
  }
  // Render conditionally based on game state
  return (
    <>
    <button onClick={restartgame}>Oyunu sıfırla!</button>
    <div className='game'>
      {!gameStarted && (
        <>
        <span>Oyunçu {currentWordIndex+1}</span>
        <div className='card' onClick={handleCardClick}>
          {showWord ? combinedWords[currentWordIndex] : "Sözü aç"}
        </div>
        </>
      )}

      {gameStarted && (
        <div>
          <h2>Oyun Başladı!</h2>
          <p>Vaxt qalıb: {formatTime()}</p>
          {combinedWords.map((word, index) => (
            <Card key={index} word={showWord ? word : "Sözü aç"} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Game;