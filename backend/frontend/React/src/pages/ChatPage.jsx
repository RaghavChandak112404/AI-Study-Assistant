import React, { useState } from "react";
import api from "../api";

export default function ChatPage() {
  const [msgs, setMsgs] = useState([
    { role:"system", content:"Ask any doubt. I will use your last PDF as context if available." }
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const q = text.trim();
    if (!q) return;
    const context = localStorage.getItem("currentContext") || "";
    setMsgs(m => [...m, {role:"user", content:q}]); setText(""); setBusy(true);
    try {
      const { data } = await api.post("/ask", { question:q, context });
      const clean = data.answer.replace(/\*\*([^*]+)\*\*/g,"$1").replace(/^[\s]*[\*\-]\s+/gm,"• ");
      setMsgs(m=>[...m, {role:"assistant", content:clean}]);
    } catch {
      setMsgs(m=>[...m, {role:"system", content:"Error while asking AI."}]);
    } finally { setBusy(false); }
  };

  return (
    <div>
      <h2 style={{marginTop:0}}>Ask AI</h2>
      <div className="glass" style={{padding:16,borderRadius:14, height:"70vh", display:"flex", flexDirection:"column"}}>
        <div style={{flex:1, overflowY:"auto", display:"grid", gap:10}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{
              alignSelf: m.role==="user"?"end":"start",
              background: m.role==="user"?"rgba(106,165,255,.18)":"rgba(255,255,255,.10)",
              border:"1px solid var(--card-border)",
              borderRadius:12, padding:"8px 12px", maxWidth:"70%"
            }}>
              <div style={{fontSize:12, color:"var(--muted)", marginBottom:4}}>
                {m.role==="user"?"You":m.role==="assistant"?"AI":"Info"}
              </div>
              <div style={{whiteSpace:"pre-wrap"}}>{m.content}</div>
            </div>
          ))}
          {busy && <div style={{fontSize:12,color:"var(--muted)"}}>AI is typing…</div>}
        </div>

        <div style={{display:"flex", gap:8, marginTop:12}}>
          <textarea className="input" style={{resize:"vertical"}} rows={2}
            placeholder="Type your question…" value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); } }} />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
