import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicSearch from './pages/PublicSearch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Herkese açık sorgulama ekranı ana sayfa olacak */}
        <Route path="/" element={<PublicSearch />} />
        
        {/* İleride ekleyeceğimiz diğer rotalar buraya gelecek */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;