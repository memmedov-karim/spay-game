import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Game from './pages/Game/Game.jsx';
function App() {
  return (
    <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game/:playercount/:spaycount" element={<Game />} />
                </Routes>
            </div>
        </Router>
  );
}

export default App;
