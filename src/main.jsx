import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SessionCreate from "./SessionCreate";
import SessionJoin from "./SessionJoin";

ReactDOM.createRoot(document.getElementById("root")).render(
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


