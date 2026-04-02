import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Vehicles from './pages/Vehicles';
import Booking from './pages/Booking';
import NotFound from './pages/NotFound';
import Landing from './component/landing';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Landing />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
