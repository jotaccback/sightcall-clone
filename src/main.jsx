// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import SessionCreate from './SessionCreate.jsx';
import SessionJoin from './SessionJoin.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<SessionCreate />} />
        <Route path="/join" element={<SessionJoin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

