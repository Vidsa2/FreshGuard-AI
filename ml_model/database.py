import sqlite3
import os
import json
import hashlib
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'freshguard.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. users
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        org_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL, -- 'donor', 'charity', 'volunteer', 'buyer'
        created_at TEXT NOT NULL
    )
    ''')

    # 2. food_items
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS food_items (
        id TEXT PRIMARY KEY,
        donor_id TEXT,
        food_name TEXT NOT NULL,
        category TEXT NOT NULL,
        batch_quantity TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        storage_condition TEXT NOT NULL,
        storage_temp REAL NOT NULL,
        is_opened INTEGER NOT NULL DEFAULT 0,
        image_url TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        cnn_freshness_score REAL NOT NULL,
        listing_type TEXT NOT NULL, -- 'SALE' or 'DONATION'
        original_price REAL DEFAULT 0.0,
        sale_price REAL DEFAULT 0.0,
        discount_percent REAL DEFAULT 0.0,
        shelf_location TEXT,
        status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'RESERVED', 'CLAIMED', 'DELIVERED'
        created_at TEXT NOT NULL,
        FOREIGN KEY (donor_id) REFERENCES users(id)
    )
    ''')

    # 3. orders_and_claims
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders_and_claims (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        transaction_type TEXT NOT NULL, -- 'PURCHASE' or 'CHARITY_CLAIM'
        status TEXT NOT NULL, -- 'PENDING', 'CONFIRMED', 'COMPLETED'
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES food_items(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    ''')

    # 4. volunteer_deliveries
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS volunteer_deliveries (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        volunteer_id TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        dropoff_address TEXT NOT NULL,
        delivery_status TEXT NOT NULL DEFAULT 'ASSIGNED', -- 'ASSIGNED', 'PICKED_UP', 'DELIVERED'
        temp_log TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES food_items(id),
        FOREIGN KEY (volunteer_id) REFERENCES users(id)
    )
    ''')

    # 5. audit_ledger
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_ledger (
        id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        sha256_hash TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES food_items(id)
    )
    ''')

    # Seed demo users if table is empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        demo_users = [
            (
                'usr_donor_001',
                'Marcus Vance',
                'Metro Mart Supermarket — Store #104',
                'metromart@freshguard.io',
                hashlib.sha256('password123'.encode()).hexdigest(),
                'donor',
                datetime.utcnow().isoformat()
            ),
            (
                'usr_charity_001',
                'Sister Beatrice',
                'St. Vincent Hope Shelter & Food Bank',
                'hope@svdp.org',
                hashlib.sha256('password123'.encode()).hexdigest(),
                'charity',
                datetime.utcnow().isoformat()
            ),
            (
                'usr_volunteer_001',
                'Alex Mercer',
                'GreenCourier Rapid Cold-Chain Fleet',
                'alex@greencourier.org',
                hashlib.sha256('password123'.encode()).hexdigest(),
                'volunteer',
                datetime.utcnow().isoformat()
            ),
            (
                'usr_buyer_001',
                'Sarah Jenkins',
                'Community Flash Sale Shopper',
                'sarah.j@gmail.com',
                hashlib.sha256('password123'.encode()).hexdigest(),
                'buyer',
                datetime.utcnow().isoformat()
            )
        ]
        cursor.executemany('''
        INSERT INTO users (id, full_name, org_name, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', demo_users)

    conn.commit()
    conn.close()
    print(f"SQLite Database initialized and verified at {DB_PATH}")

# Call init_db on module load
init_db()

