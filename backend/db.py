import sqlite3
from flask import g

DB_PATH = "users.db"

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH, check_same_thread=False)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    """)
    db.commit()

def create_user(email, password):
    db = get_db()
    db.execute("INSERT INTO users(email, password) VALUES(?,?)", (email, password))
    db.commit()

def verify_user(email, password):
    db = get_db()
    row = db.execute("SELECT id FROM users WHERE email=? AND password=?", (email, password)).fetchone()
    return row is not None
