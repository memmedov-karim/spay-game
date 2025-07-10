import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
// import Game from "./pages/Game/Game.jsx";
import Footer from "./components/footer/Footer.js";
import About from "./pages/About/About.jsx";
import { useState, useEffect } from "react";
import SpySound from "./assets/spy.mp3";

import "./App.css";
import Game from "./components/player/PlayerCard.jsx";
function App() {
  const [audio] = useState(new Audio(SpySound));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('preferredLanguage') || 'en');
  const [gameMode, setGameMode] = useState(() => localStorage.getItem('gameMode') || 'classic');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    audio.loop = true;
    audio.oncanplaythrough = () => console.log('Audio loaded successfully');
    audio.onerror = (e) => console.error('Error loading audio:', e);
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const clearLocal = () => {
    localStorage.removeItem('usedWords');
    window.location.reload();
  };

  const openModal = () => {
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  const handleGameModeChange = (event) => {
    const newMode = event.target.value;
    setGameMode(newMode);
    localStorage.setItem('gameMode', newMode);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home
            language={language}
            gameMode={gameMode}
            handleLanguageChange={handleLanguageChange}
            handleGameModeChange={handleGameModeChange}
            openModal={openModal}
            toggleMusic={toggleMusic}
            isPlaying={isPlaying}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen} />}
          />
          <Route path="/game/:playercount/:spaycount" element={<Game />} />
          <Route path="/about" element={<About language={language}
            gameMode={gameMode}
            handleLanguageChange={handleLanguageChange}
            handleGameModeChange={handleGameModeChange}
            openModal={openModal}
            toggleMusic={toggleMusic}
            isPlaying={isPlaying}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen} />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
