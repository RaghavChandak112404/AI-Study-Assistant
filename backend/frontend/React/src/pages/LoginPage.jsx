import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    try {
      if (isSignUp) {
        await api.post("/signup", { email, password });
        setMsg("Account created. Please log in.");
        setIsSignUp(false);
        return;
      }
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("userEmail", email);
      nav("/"); window.location.reload();
    } catch (e) {
      setMsg(e.response?.data?.error || "Failed.");
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh"}}>
      <div className="glass auth-panel">
        <h2 style={{marginTop:0, marginBottom:6}}>{isSignUp?"Create account":"Welcome back"}</h2>

        <div style={{marginTop:6, display:'grid', gap:10}}>
          <input className="input" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {msg && <div style={{fontSize:12,color:"#ff9b9b",marginTop:2}}>{msg}</div>}

          <button className="btn btn-primary" onClick={submit} style={{width:"100%",marginTop:4}}>{isSignUp?"Sign Up":"Sign In"}</button>

          <div className="auth-cta" onClick={()=>{setIsSignUp(v=>!v);setMsg("");}}>
            {isSignUp?"Already have an account? Log in":"New user? Create account"}
          </div>
        </div>
      </div>
    </div>
  );
}
