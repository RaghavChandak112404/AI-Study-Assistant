import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = localStorage.getItem("userEmail");

  const go = (p) => navigate(p);
  const is = (p) => location.pathname === p;

  const toggleTheme = () => {
    const isLight = document.documentElement.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  };

  return (
      <div className="sidebar">
      <div className="sidebar-inner">
        <h1>📘 Study Assistant</h1>

        <div>
          <button className={`nav-item ${is("/")?"active":""}`} onClick={()=>go("/")}>📄 Dashboard</button>
          <button className={`nav-item ${is("/chat")?"active":""}`} onClick={()=>go("/chat")}>💬 Ask AI</button>
          <button className={`nav-item ${is("/library")?"active":""}`} onClick={()=>go("/library")}>📚 My Library</button>
          <button className={`nav-item ${is("/recommend")?"active":""}`} onClick={()=>go("/recommend")}>🎓 Recommendations</button>
        </div>

        <div style={{marginTop: 14}}>
          <button className="btn" onClick={toggleTheme}>🌗 Toggle Theme</button>
        </div>

        <div className="sidebar-bottom">
          <div onClick={()=>go("/account")} className="profile-row" style={{marginBottom:12}}>
            <div className="avatar">{(email || "G")[0].toUpperCase()}</div>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:14,fontWeight:600}}>{email || "Guest User"}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{email ? email : "Not Logged In"}</div>
            </div>
          </div>

          <button className="btn" style={{width:"100%", background:"linear-gradient(90deg,#ff7a7a,#ff5a5a)", borderColor:"rgba(255,80,80,.22)"}}
            onClick={()=>{ localStorage.clear(); window.location.href="/login"; }}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
