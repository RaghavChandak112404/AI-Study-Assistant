import React from "react";

export default function Topbar({ title }) {
  const email = localStorage.getItem("userEmail");

  return (
    <div className="topbar">
      <div className="page-title">{title}</div>

      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <input className="input search" placeholder="Search notes or keywords…" />
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize:12,color:'var(--muted)'}}>{email ? email.split('@')[0] : 'Guest'}</div>
        </div>
      </div>
    </div>
  );
}
