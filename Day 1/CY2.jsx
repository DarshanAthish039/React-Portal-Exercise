import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

const Rarr = () => {
  return (
    <div>
      <ul className="ul">
        <li>North</li>
        <li>East</li>
        <li>West</li>
        <li>South</li>
      </ul>
    </div>
  );
};

const Arr = () => {
  return (
    <div>
      <p>North news, East News, West News, South News</p>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/arr">Array</Link>
            </li>
            <li>
              <Link to="/rarr">Refresh Array</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/rarr" element={<Rarr />} />
          <Route path="/arr" element={<Arr />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
