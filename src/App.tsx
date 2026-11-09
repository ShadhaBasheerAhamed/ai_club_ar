import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GiftExperience } from './pages/GiftExperience';
import { GiftAdmin } from './pages/GiftAdmin';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/gift-admin" replace />} />
      <Route path="/gift/:slug" element={<GiftExperience />} />
      <Route path="/gift-admin" element={<GiftAdmin />} />
      <Route path="*" element={<Navigate to="/gift-admin" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;