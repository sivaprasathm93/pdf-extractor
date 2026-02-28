"""
analytics.py — Lightweight event tracking using SQLite.
Tracks page visits, extract clicks, and export clicks.
"""

import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "analytics.db")


def _get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create the analytics table if it doesn't exist."""
    conn = _get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT
        )
    """)
    conn.commit()
    conn.close()


def track_event(event_type: str, ip_address: str = None, user_agent: str = None):
    """Record a single analytics event."""
    conn = _get_conn()
    conn.execute(
        "INSERT INTO events (event_type, timestamp, ip_address, user_agent) VALUES (?, ?, ?, ?)",
        (event_type, datetime.utcnow().isoformat(), ip_address, user_agent),
    )
    conn.commit()
    conn.close()


def get_stats() -> dict:
    """Return aggregate counts for each event type."""
    conn = _get_conn()
    cursor = conn.execute("""
        SELECT event_type, COUNT(*) as count
        FROM events
        GROUP BY event_type
    """)
    stats = {row["event_type"]: row["count"] for row in cursor.fetchall()}
    conn.close()

    return {
        "page_visit": stats.get("page_visit", 0),
        "extract_click": stats.get("extract_click", 0),
        "export_click": stats.get("export_click", 0),
        "preview_click": stats.get("preview_click", 0),
        "total_events": sum(stats.values()),
    }


def get_recent_events(limit: int = 50) -> list:
    """Return the most recent events."""
    conn = _get_conn()
    cursor = conn.execute(
        "SELECT event_type, timestamp, ip_address FROM events ORDER BY id DESC LIMIT ?",
        (limit,),
    )
    events = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return events


# Initialize DB on import
init_db()
