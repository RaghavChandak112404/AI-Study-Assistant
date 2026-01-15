import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LibraryPage() {
  const [list, setList] = useState([]);
  const nav = useNavigate();

  const key = () => `library_${localStorage.getItem("userEmail") || "guest"}`;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key()) || "[]");
    setList(data.slice().reverse());
  }, []);

  const useForChat = (it) => {
    localStorage.setItem("currentContext", it.raw_text || "");
    nav("/chat");
  };

  const del = (id) => {
    const updated = list.filter(x => x.id !== id);
    setList(updated);
    localStorage.setItem(key(), JSON.stringify(updated.slice().reverse()));
  };

  return (
    <div>
      <h2 style={{marginTop:0}}>My Library</h2>
      {list.length === 0 ? (
        <div style={{color:"var(--muted)"}}>No saved summaries yet.</div>
      ) : (
        <div style={{display:"grid", gap:16}}>
          {list.map(it => (
            <div key={it.id} className="glass" style={{padding:16, borderRadius:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>📄 {it.fileName}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>{it.date}</div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn" onClick={()=>useForChat(it)}>Ask AI</button>
                  <button className="btn" style={{background:"rgba(255,80,80,.25)",borderColor:"rgba(255,80,80,.4)"}}
                          onClick={()=>del(it.id)}>Delete</button>
                </div>
              </div>
              <div style={{whiteSpace:"pre-wrap", fontSize:14}}>{it.summary}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
