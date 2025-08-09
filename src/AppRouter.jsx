import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PaintDetail from './pages/PaintDetails';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/paints/:id" element={<PaintDetail />} />
    </Routes>
  </Router>
);

export default AppRouter;