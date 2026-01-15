import os, io, requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from dotenv import load_dotenv
import fitz  # PyMuPDF
import google.generativeai as genai

from db import init_db, close_db, create_user, verify_user

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "secret")
jwt = JWTManager(app)

# DB lifecycle
with app.app_context():
    init_db()
app.teardown_appcontext(close_db)

# Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-2.5-flash"  
model = genai.GenerativeModel(MODEL_NAME)

# ---------- Auth ----------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    try:
        create_user(data.get("email"), data.get("password"))
        return jsonify({"msg": "user created"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if verify_user(data.get("email"), data.get("password")):
        token = create_access_token(identity=data.get("email"))
        return jsonify({"access_token": token}), 200
    return jsonify({"error": "invalid credentials"}), 401

# ---------- Helpers ----------
def extract_text_from_pdf_stream(buf: bytes) -> str:
    doc = fitz.open(stream=buf, filetype="pdf")
    return "\n".join([p.get_text("text") for p in doc])

def ai_summarize(text: str) -> str:
    prompt = f"Summarize into clean bullet points. No markdown syntax like ** or *.\n\n{text[:15000]}"
    return model.generate_content(prompt).text.strip()

def ai_keywords(text: str) -> str:
    prompt = f"Give 10 comma-separated keywords only:\n\n{text[:8000]}"
    return model.generate_content(prompt).text.strip()

# ---------- PDF Upload ----------
@app.route("/upload_pdf", methods=["POST"])
@jwt_required()
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "no file"}), 400
    f = request.files["file"]
    pdf_bytes = f.read()
    try:
        text = extract_text_from_pdf_stream(pdf_bytes)
    except Exception as e:
        return jsonify({"error": f"pdf extract failed: {e}"}), 500

    summary = ai_summarize(text)
    keywords = ai_keywords(text)

    return jsonify({
        "summary": summary,
        "keywords": keywords,
        "raw_text": text[:20000]
    })

# ---------- Ask AI ----------
@app.route("/ask", methods=["POST"])
@jwt_required()
def ask():
    data = request.get_json()
    context = data.get("context", "")
    question = data.get("question", "")
    prompt = (
        "Answer concisely using the given context. "
        "Use plain text bullets (•) if needed. No markdown bold.\n\n"
        f"Context:\n{context[:15000]}\n\nQuestion: {question}"
    )
    ans = model.generate_content(prompt).text.strip()
    return jsonify({"answer": ans})

# ---------- Recommend ----------
YOUTUBE_KEY = os.getenv("YOUTUBE_API_KEY")
GOOGLE_CSE_KEY = os.getenv("GOOGLE_CSE_KEY")
GOOGLE_CSE_CX = os.getenv("GOOGLE_CSE_CX")

def youtube_search(q, n=5):
    r = requests.get(
        "https://www.googleapis.com/youtube/v3/search",
        params={"part": "snippet", "q": q, "type": "video", "key": YOUTUBE_KEY, "maxResults": n}
    ).json()
    out = []
    for it in r.get("items", []):
        vid = it.get("id", {}).get("videoId")
        sn = it.get("snippet", {})
        if vid:
            out.append({
                "source": "YouTube",
                "title": sn.get("title"),
                "snippet": sn.get("description"),
                "url": f"https://www.youtube.com/watch?v={vid}"
            })
    return out

def web_search(q, n=5):
    r = requests.get(
        "https://www.googleapis.com/customsearch/v1",
        params={"key": GOOGLE_CSE_KEY, "cx": GOOGLE_CSE_CX, "q": q, "num": n}
    ).json()
    return [{"source": "Web", "title": i.get("title"), "snippet": i.get("snippet"), "url": i.get("link")}
            for i in r.get("items", [])]

@app.route("/recommend", methods=["POST"])
@jwt_required()
def recommend():
    data = request.get_json()
    q = data.get("keywords", "")

    # Base searches
    yt = youtube_search(q, 6)            # YouTube videos
    web = web_search(q, 6)               # General article/notes/web results

    # Explicit Coursera courses
    coursera = web_search(f"{q} course site:coursera.org", 5)
    for c in coursera:
        c["source"] = "Coursera"

    # Explicit Udemy courses
    udemy = web_search(f"{q} course site:udemy.com", 5)
    for u in udemy:
        u["source"] = "Udemy"

    results = yt + coursera + udemy + web
    return jsonify({"results": results})


if __name__ == "__main__":
    # Allow PORT env var and default to 5000. Bind to all interfaces for local dev.
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
