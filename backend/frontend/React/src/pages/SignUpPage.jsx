import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/signup", { email, password });
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Try another email.");
    }
  };

  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh"}}>
      <div className="glass auth-panel">
        <h2 style={{marginTop:0}}>Create Account</h2>

        <div style={{display:'grid',gap:10,marginTop:8}}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p style={{color:'#ff9b9b',fontSize:13}}>{error}</p>}

          <button className="btn btn-primary" onClick={handleSignup} style={{padding:'10px 14px'}}>Sign Up</button>

          <p className="auth-cta" onClick={() => navigate("/login")}>Already have an account? Login →</p>
        </div>
      </div>
    </div>
  );
}
