import React from 'react';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GoalDetailsPage from './pages/GoalDetailsPage';
import GoalsPage from './pages/GoalsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goal/:id" element={<GoalDetailsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
