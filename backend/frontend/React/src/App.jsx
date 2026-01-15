import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import Background from "./components/Background.jsx";
import Topbar from "./components/Topbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LibraryPage from "./pages/LibraryPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import RecommendPage from "./pages/RecommendPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("light");
  }, []);

  return (
    <Router>
      <Background />
      {token ? (
        <div className="app">
          <div className="sidebar"><Sidebar /></div>
          <div className="main">
            <Topbar title={window.location.pathname === '/' ? 'Dashboard' : ''} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}
