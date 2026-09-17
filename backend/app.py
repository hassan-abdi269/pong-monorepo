from pathlib import Path
import sqlite3

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE = Path(__file__).with_name("pong.db")


def connection():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    with connection() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS games (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_score INTEGER NOT NULL,
                computer_score INTEGER NOT NULL,
                winner TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/api/games")
def games():
    with connection() as db:
        rows = db.execute(
            "SELECT * FROM games ORDER BY created_at DESC LIMIT 25"
        ).fetchall()
    return jsonify([dict(row) for row in rows])


@app.post("/api/games")
def save_game():
    payload = request.get_json(silent=True) or {}
    try:
        player_score = int(payload.get("player_score", 0))
        computer_score = int(payload.get("computer_score", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Scores must be integers"}), 400

    winner = "player" if player_score > computer_score else "computer"
    with connection() as db:
        cursor = db.execute(
            "INSERT INTO games (player_score, computer_score, winner) VALUES (?, ?, ?)",
            (player_score, computer_score, winner),
        )
        game_id = cursor.lastrowid

    return jsonify({
        "id": game_id,
        "player_score": player_score,
        "computer_score": computer_score,
        "winner": winner,
    }), 201


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
