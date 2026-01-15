import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const nav = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear(); nav("/login");
  };

  if (!token || !email) {
    return (
      <div className="glass" style={{padding:16,borderRadius:14}}>
        <div>You are not logged in.</div>
        <button className="btn" style={{marginTop:10}} onClick={()=>nav("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="glass" style={{padding:16,borderRadius:14,maxWidth:500}}>
      <h3>Account</h3>
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        <div style={{width:44,height:44,background:"#3b82f6",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>
          {email[0].toUpperCase()}
        </div>
        <div>
          <div style={{fontWeight:600}}>{email.split("@")[0]}</div>
          <div style={{color:"var(--muted)", fontSize:14}}>{email}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <button className="btn" onClick={()=>nav("/")}>Back to Dashboard</button>
        <button className="btn" style={{background:"rgba(255,80,80,.25)",borderColor:"rgba(255,80,80,.4)"}} onClick={logout}>Log Out</button>
      </div>
    </div>
  );
}
