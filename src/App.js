import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Game from "./pages/Game/Game.jsx";
import Footer from "./components/footer/Footer.js";
import "./App.css";
function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:playercount/:spaycount" element={<Game />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
