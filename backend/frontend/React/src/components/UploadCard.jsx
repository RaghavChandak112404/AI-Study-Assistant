import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadCard() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cleanAIText = (t = "") => {
    let x = t.replace(/\*\*([^*]+)\*\*/g, "$1");
    x = x.replace(/^[\s]*[\*\-]\s+/gm, "• ");
    x = x.replace(/\n{3,}/g, "\n\n");
    return x.trim();
  };

const saveToLibrary = (data) => {
  const email = localStorage.getItem("userEmail") || "guest";
  const existing = JSON.parse(localStorage.getItem(`library_${email}`) || "[]");

  existing.push({
    id: Date.now(),
    fileName: data.fileName,
    summary: data.summary,
    raw_text: data.raw_text,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem(`library_${email}`, JSON.stringify(existing));
};


  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    if (!file) return setError("Please choose a PDF first.");

    const formData = new FormData();
    formData.append("file", file);

    setError("");

    try {
const res = await axios.post("http://127.0.0.1:5000/upload_pdf", formData, {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "multipart/form-data"
  }
});


      const cleanSummary = cleanAIText(res.data.summary);
      const cleanKeywords = cleanAIText(res.data.keywords);

      setSummary(cleanSummary);
      setKeywords(cleanKeywords);

      // ✅ store context for chat
      localStorage.setItem("currentContext", res.data.raw_text);

      // ✅ store keywords for Recommendation Page
      localStorage.setItem("last_keywords", cleanKeywords);

      // ✅ save to library
      saveToLibrary({
        id: Date.now(),
        fileName: file.name,
        summary: cleanSummary,
        keywords: cleanKeywords,
        raw_text: res.data.raw_text,
        date: new Date().toLocaleString(),
      });

    } catch (err) {
      setError("Upload failed. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div className="fade-in p-6">
      <div className="glass p-8 rounded-2xl max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Upload a PDF</h2>
        <p className="text-gray-300/80 mb-6 text-sm">
          PDF text will be extracted and summarized for studying & Q&A.
        </p>

        <div className="flex items-center gap-3">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} className="btn">Upload & Summarize</button>
        </div>

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {summary && (
          <>
            <h3 className="font-semibold mt-6 mb-1">Summary</h3>
            <pre className="glass p-4 rounded-xl whitespace-pre-wrap text-sm">{summary}</pre>

            <h3 className="font-semibold mt-6 mb-1">Keywords</h3>
            <pre className="glass p-4 rounded-xl whitespace-pre-wrap text-sm">{keywords}</pre>
          </>
        )}
      </div>

      {summary && (
        <button
          onClick={() => navigate("/chat")}
          className="fixed bottom-8 right-8 glass px-5 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          💬 Ask AI About This
        </button>
      )}
    </div>
  );
}
