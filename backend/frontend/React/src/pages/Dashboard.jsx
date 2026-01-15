import React, { useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type === "application/pdf") setFile(f);
  };

  const onUpload = async () => {
    if (!file) return alert("Select a PDF");
    setBusy(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await api.post("/upload_pdf", fd, { headers: { "Content-Type": "multipart/form-data" } });
      // store per-user library
      const email = localStorage.getItem("userEmail") || "guest";
      const libKey = `library_${email}`;
      const cur = JSON.parse(localStorage.getItem(libKey) || "[]");
      cur.push({
        id: Date.now(),
        date: new Date().toLocaleString(),
        fileName: file.name,
        summary: clean(data.summary),
        keywords: clean(data.keywords),
        raw_text: data.raw_text
      });
      localStorage.setItem(libKey, JSON.stringify(cur));
      // set context for chat
      localStorage.setItem("currentContext", data.raw_text || "");
      window.location.href = "/library";
    } catch (e) {
      alert(e.response?.data?.error || "Upload failed");
    } finally { setBusy(false); }
  };

  const clean = (t="") => t.replace(/\*\*([^*]+)\*\*/g,"$1").replace(/^[\s]*[\*\-]\s+/gm,"• ").trim();

  return (
    <div>
      <h2 style={{marginTop:0}}>Dashboard</h2>

      <div
        className={`glass dropzone ${drag ? "drag" : ""}`}
        onDragEnter={(e)=>{e.preventDefault();setDrag(true);}}
        onDragOver={(e)=>{e.preventDefault();setDrag(true);}}
        onDragLeave={(e)=>{e.preventDefault();setDrag(false);}}
        onDrop={onDrop}
      >
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:600, marginBottom:8}}>Upload a PDF</div>
          <div style={{color:"var(--muted)", fontSize:14, marginBottom:12}}>
            Drag & drop here or choose a file
          </div>
          <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          <div style={{marginTop:10, fontSize:12, color:"var(--muted)"}}>
            {file ? `Selected: ${file.name}` : "No file chosen"}
          </div>
          <button className="btn" style={{marginTop:16}} onClick={onUpload} disabled={busy}>
            {busy ? "Processing…" : "Upload & Summarize"}
          </button>
        </div>
      </div>
    </div>
  );
}
