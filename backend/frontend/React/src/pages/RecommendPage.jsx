import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function RecommendPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto-fill keywords from latest library item OR chat context
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "guest";
    const key = `library_${email}`;
    const library = JSON.parse(localStorage.getItem(key) || "[]");

    // 1) Try most recent library summary keywords
    if (library.length > 0) {
      const latest = library[library.length - 1];
      if (latest.keywords) {
        setQuery(latest.keywords.split(",").slice(0, 4).join(" ").trim());
        return;
      }
    }

    // 2) If chatting context exists → use that instead
    const context = localStorage.getItem("currentContext");
    if (context && context.length > 60) {
      setQuery(context.split(" ").slice(0, 6).join(" "));
    }
  }, []);

  const findResources = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/recommend", { keywords: query });
      setResults(data.results || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in">
      <h2 style={{ marginTop: 0 }}>🎓 Course & Learning Recommendations</h2>

      <div className="glass" style={{ padding: 20, borderRadius: 14, maxWidth: 600 }}>
        <input
          className="input"
          placeholder="Keywords will auto-fill from your study context…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn" onClick={findResources} style={{ marginTop: 12 }}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
        {results.map((r, i) => (
          <a
            key={i}
            className="glass"
            href={r.url}
            target="_blank"
            rel="noreferrer"
            style={{ padding: 14, borderRadius: 12, textDecoration: "none", color: "var(--fg)" }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {r.source === "YouTube" && "▶️YouTube "}
              {r.source === "Coursera" && "🎓Coursera"}
              {r.source === "Udemy" && "🧑‍🏫Udemy"}
              {r.source === "Web" && "🌐Web Search"}
              {r.title || "Untitled"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{r.snippet}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
