import os
import json
import hashlib
from datetime import datetime, timedelta
import dotenv

dotenv.load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/freshguard")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "freshguard")
PERSISTENCE_FILE = os.path.join(os.path.dirname(__file__), "mongo_persistence.json")

# Try to connect to real MongoDB, fallback to mongomock with JSON persistence
is_live_mongo = False
client = None
db = None

try:
    import pymongo
    test_client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=1200)
    test_client.admin.command('ping')
    client = test_client
    db = client[MONGODB_DB_NAME]
    is_live_mongo = True
    print(f"[*] Successfully connected to live MongoDB at {MONGODB_URI}")
except Exception as e:
    print(f"[!] Live MongoDB not available ({e}). Using robust mongomock with disk persistence.")
    import mongomock
    client = mongomock.MongoClient()
    db = client[MONGODB_DB_NAME]
    is_live_mongo = False

def reconnect_mongo(new_uri: str):
    """Dynamically connects or updates to a live MongoDB Atlas URI and updates .env."""
    global client, db, is_live_mongo, MONGODB_URI
    import pymongo
    clean_uri = new_uri.strip()
    try:
        test_client = pymongo.MongoClient(clean_uri, serverSelectionTimeoutMS=3500)
        test_client.admin.command('ping')
        client = test_client
        db = client[MONGODB_DB_NAME]
        is_live_mongo = True
        MONGODB_URI = clean_uri
        
        # Update .env
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(f"# FreshGuard AI Enterprise Database Configuration\nMONGODB_URI={clean_uri}\nMONGODB_DB_NAME={MONGODB_DB_NAME}\n")
        
        # Seed if empty in live cluster
        seed_initial_data()
        
        return {
            "success": True,
            "message": "Successfully connected live to MongoDB Atlas cluster!",
            "status": get_db_status()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Connection to MongoDB failed: {str(e)}",
            "status": get_db_status()
        }

def save_persistence_if_mock():
    """Saves mongomock collections to disk so data is never lost between restarts."""
    if not is_live_mongo:
        try:
            data = {
                "users": list(db.users.find({}, {'_id': 0})),
                "products": list(db.products.find({}, {'_id': 0})),
                "orders": list(db.orders.find({}, {'_id': 0})),
                "deliveries": list(db.deliveries.find({}, {'_id': 0})),
                "audit_ledger": list(db.audit_ledger.find({}, {'_id': 0})),
            }
            with open(PERSISTENCE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as err:
            print(f"[!] Warning: Failed saving mongomock persistence: {err}")

def load_persistence_if_mock():
    """Loads previous state from disk into mongomock."""
    if not is_live_mongo and os.path.exists(PERSISTENCE_FILE):
        try:
            with open(PERSISTENCE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                for coll_name, docs in data.items():
                    coll = db[coll_name]
                    if coll.count_documents({}) == 0 and docs:
                        coll.insert_many(docs)
            print(f"[*] Loaded {os.path.basename(PERSISTENCE_FILE)} into mongomock.")
        except Exception as err:
            print(f"[!] Warning: Failed loading mongomock persistence: {err}")

def seed_initial_data():
    """Seeds rich enterprise demo records if users or products collections are empty."""
    load_persistence_if_mock()

    now = datetime.utcnow()

    # 1. Seed Users
    if db.users.count_documents({}) == 0:
        demo_users = [
            {
                "id": "usr_donor_001",
                "full_name": "Marcus Vance",
                "org_name": "Metro Mart Supermarket — Store #104",
                "email": "metromart@freshguard.io",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "donor",
                "business_license": "RET-NSW-2024-9844",
                "store_address": "45 Market Street, Sydney NSW 2000",
                "cold_storage_capacity": "4,500 L (-22°C to +4°C)",
                "created_at": (now - timedelta(days=12)).isoformat()
            },
            {
                "id": "usr_donor_002",
                "full_name": "Elena Rostova",
                "org_name": "Sunrise Organic Grocers & Deli",
                "email": "sunrise@grocers.com",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "donor",
                "business_license": "RET-VIC-2023-1102",
                "store_address": "88 Brunswick St, Fitzroy VIC 3065",
                "cold_storage_capacity": "1,200 L (+2°C to +6°C)",
                "created_at": (now - timedelta(days=5)).isoformat()
            },
            {
                "id": "usr_charity_001",
                "full_name": "Sister Beatrice",
                "org_name": "St. Vincent Hope Shelter & Food Bank",
                "email": "hope@svdp.org",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "charity",
                "tax_exemption_id": "DGR-TAX-883901",
                "shelter_license": "NGO-REL-2021-44",
                "created_at": (now - timedelta(days=20)).isoformat()
            },
            {
                "id": "usr_charity_002",
                "full_name": "David Alverez",
                "org_name": "Community Food Share Network",
                "email": "david@foodshare.org",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "charity",
                "tax_exemption_id": "DGR-TAX-772109",
                "shelter_license": "NGO-FED-2022-19",
                "created_at": (now - timedelta(days=8)).isoformat()
            },
            {
                "id": "usr_buyer_001",
                "full_name": "Sarah Jenkins",
                "org_name": "Verified Smart Shopper",
                "email": "sarah.j@gmail.com",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "buyer",
                "created_at": (now - timedelta(days=3)).isoformat()
            },
            {
                "id": "usr_volunteer_001",
                "full_name": "Alex Mercer",
                "org_name": "GreenCourier Rapid Cold-Chain Fleet",
                "email": "alex@greencourier.org",
                "password_hash": hashlib.sha256("password123".encode()).hexdigest(),
                "role": "volunteer",
                "created_at": (now - timedelta(days=15)).isoformat()
            }
        ]
        db.users.insert_many(demo_users)
        print(f"[*] Seeded {len(demo_users)} enterprise users into MongoDB.")

    # 2. Seed Products (Products with different shelf-lives: Critical, Warning, Safe)
    if db.products.count_documents({}) == 0:
        demo_products = [
            {
                "id": "PROD_GALA_001",
                "donor_id": "usr_donor_001",
                "donor_name": "Marcus Vance",
                "donor_org": "Metro Mart Supermarket — Store #104",
                "food_name": "Crisp Royal Gala Apples",
                "category": "Fruits",
                "batch_quantity": "15 kg (3 Crates)",
                "expiry_date": (now + timedelta(hours=34)).isoformat(), # Warning tier (12-36h)
                "storage_condition": "Ambient",
                "storage_temp": 18.0,
                "is_opened": False,
                "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
                "sha256_hash": hashlib.sha256(b"GalaApple_Batch_001").hexdigest(),
                "cnn_freshness_score": 92.4,
                "listing_type": "SALE",
                "original_price": 7.50,
                "sale_price": 2.25,
                "discount_percent": 70,
                "shelf_location": "Aisle 1 - Clearance Stand",
                "status": "AVAILABLE",
                "created_at": (now - timedelta(hours=4)).isoformat()
            },
            {
                "id": "PROD_BERRY_002",
                "donor_id": "usr_donor_002",
                "donor_name": "Elena Rostova",
                "donor_org": "Sunrise Organic Grocers & Deli",
                "food_name": "Organic Sweet Strawberries",
                "category": "Fruits",
                "batch_quantity": "8 Punners (2 kg)",
                "expiry_date": (now + timedelta(hours=8)).isoformat(), # Critical tier (<12h)
                "storage_condition": "Refrigerated",
                "storage_temp": 3.8,
                "is_opened": False,
                "image_url": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80",
                "sha256_hash": hashlib.sha256(b"Strawberry_Batch_002").hexdigest(),
                "cnn_freshness_score": 88.0,
                "listing_type": "DONATION",
                "original_price": 6.00,
                "sale_price": 0.00,
                "discount_percent": 100,
                "shelf_location": "Coolroom Door 2 (Urgent Charity Pickup)",
                "status": "AVAILABLE",
                "created_at": (now - timedelta(hours=6)).isoformat()
            },
            {
                "id": "PROD_MILK_003",
                "donor_id": "usr_donor_001",
                "donor_name": "Marcus Vance",
                "donor_org": "Metro Mart Supermarket — Store #104",
                "food_name": "Farm Fresh Whole Milk 2L",
                "category": "Dairy",
                "batch_quantity": "12 Cartons",
                "expiry_date": (now + timedelta(hours=28)).isoformat(), # Warning tier (12-36h)
                "storage_condition": "Refrigerated",
                "storage_temp": 3.2,
                "is_opened": False,
                "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
                "sha256_hash": hashlib.sha256(b"Milk_Batch_003").hexdigest(),
                "cnn_freshness_score": 95.8,
                "listing_type": "SALE",
                "original_price": 4.80,
                "sale_price": 2.40,
                "discount_percent": 50,
                "shelf_location": "Dairy Chiller 4 - Yellow Label Bin",
                "status": "AVAILABLE",
                "created_at": (now - timedelta(hours=8)).isoformat()
            },
            {
                "id": "PROD_SOURDOUGH_004",
                "donor_id": "usr_donor_002",
                "donor_name": "Elena Rostova",
                "donor_org": "Sunrise Organic Grocers & Deli",
                "food_name": "Artisan Stoneground Sourdough",
                "category": "Bakery",
                "batch_quantity": "10 Loaves",
                "expiry_date": (now + timedelta(hours=10)).isoformat(), # Critical tier (<12h)
                "storage_condition": "Ambient",
                "storage_temp": 20.0,
                "is_opened": False,
                "image_url": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
                "sha256_hash": hashlib.sha256(b"Sourdough_Batch_004").hexdigest(),
                "cnn_freshness_score": 90.1,
                "listing_type": "DONATION",
                "original_price": 8.50,
                "sale_price": 0.00,
                "discount_percent": 100,
                "shelf_location": "Bakery Counter Tier 1",
                "status": "AVAILABLE",
                "created_at": (now - timedelta(hours=2)).isoformat()
            },
            {
                "id": "PROD_SPINACH_005",
                "donor_id": "usr_donor_001",
                "donor_name": "Marcus Vance",
                "donor_org": "Metro Mart Supermarket — Store #104",
                "food_name": "Baby Spinach Salad Tub 500g",
                "category": "Vegetables",
                "batch_quantity": "16 Tubs",
                "expiry_date": (now + timedelta(hours=48)).isoformat(), # Safe tier (>36h)
                "storage_condition": "Refrigerated",
                "storage_temp": 4.1,
                "is_opened": False,
                "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
                "sha256_hash": hashlib.sha256(b"Spinach_Batch_005").hexdigest(),
                "cnn_freshness_score": 97.2,
                "listing_type": "SALE",
                "original_price": 5.00,
                "sale_price": 3.50,
                "discount_percent": 30,
                "shelf_location": "Produce Mist Rack 3",
                "status": "AVAILABLE",
                "created_at": (now - timedelta(hours=1)).isoformat()
            }
        ]
        db.products.insert_many(demo_products)
        print(f"[*] Seeded {len(demo_products)} products into MongoDB.")

        # Seed initial audit ledger logs
        for p in demo_products:
            db.audit_ledger.insert_one({
                "id": f"LEDGER_{p['id']}",
                "item_id": p["id"],
                "food_name": p["food_name"],
                "sha256_hash": p["sha256_hash"],
                "verification_status": "VERIFIED",
                "timestamp": p["created_at"]
            })

    save_persistence_if_mock()

# Helper accessors
def get_db_status():
    users_count = db.users.count_documents({})
    products_count = db.products.count_documents({})
    orders_count = db.orders.count_documents({})
    ledger_count = db.audit_ledger.count_documents({})

    return {
        "connected": True,
        "engine": "MongoDB",
        "mode": "Live Cluster (port 27017)" if is_live_mongo else "MongoDB Replica Engine (Local JSON Sync)",
        "database": MONGODB_DB_NAME,
        "is_live": is_live_mongo,
        "uri": MONGODB_URI.split("@")[-1] if "@" in MONGODB_URI else MONGODB_URI,
        "counts": {
            "users": users_count,
            "products": products_count,
            "orders": orders_count,
            "audit_ledger": ledger_count
        }
    }

def get_all_users():
    return list(db.users.find({}, {'_id': 0, 'password_hash': 0}))

def find_user_by_email(email: str):
    return db.users.find_one({"email": email.strip().lower()})

def insert_user(user_doc: dict):
    db.users.insert_one(user_doc)
    save_persistence_if_mock()
    doc_copy = dict(user_doc)
    doc_copy.pop("_id", None)
    doc_copy.pop("password_hash", None)
    return doc_copy

def get_all_products():
    return list(db.products.find({}, {'_id': 0}).sort("created_at", -1))

def insert_product(product_doc: dict):
    db.products.insert_one(product_doc)
    
    # Prepend to audit ledger
    ledger_doc = {
        "id": f"LEDGER_{int(datetime.utcnow().timestamp() * 1000)}",
        "item_id": product_doc["id"],
        "food_name": product_doc["food_name"],
        "sha256_hash": product_doc.get("sha256_hash", "0" * 64),
        "verification_status": "VERIFIED",
        "timestamp": product_doc["created_at"]
    }
    db.audit_ledger.insert_one(ledger_doc)
    save_persistence_if_mock()
    doc_copy = dict(product_doc)
    doc_copy.pop("_id", None)
    return doc_copy

def update_product_status(item_id: str, new_status: str):
    db.products.update_one({"id": item_id}, {"$set": {"status": new_status}})
    save_persistence_if_mock()

def get_all_orders():
    orders = list(db.orders.find({}, {'_id': 0}).sort("created_at", -1))
    return orders

def insert_order(order_doc: dict):
    db.orders.insert_one(order_doc)
    new_status = "RESERVED" if order_doc.get("transaction_type") == "PURCHASE" else "CLAIMED"
    update_product_status(order_doc["item_id"], new_status)
    save_persistence_if_mock()
    doc_copy = dict(order_doc)
    doc_copy.pop("_id", None)
    return doc_copy

def get_expiry_tracker_summary():
    """Calculates hours left, urgency tier, and safe recommendations for all items."""
    products = list(db.products.find({}, {'_id': 0}))
    now = datetime.utcnow()
    
    analyzed = []
    for p in products:
        try:
            exp_time = datetime.fromisoformat(p["expiry_date"].replace('Z', ''))
            diff_hours = (exp_time - now).total_seconds() / 3600.0
        except Exception:
            diff_hours = 24.0 # default fallback

        diff_hours = round(diff_hours, 1)

        if diff_hours <= 0:
            urgency = "EXPIRED"
            action = "Immediate Condemnation & Compost Disposal"
        elif diff_hours < 12:
            urgency = "CRITICAL"
            action = "Urgent 70% Clearance Markdown or Immediate Charity Dispatch"
        elif diff_hours <= 36:
            urgency = "WARNING"
            action = "Recommend 30% - 50% Flash Sale Markdown"
        else:
            urgency = "SAFE"
            action = "Optimal Storage Compliance — Regular Inventory"

        analyzed.append({
            **p,
            "hours_remaining": diff_hours,
            "urgency": urgency,
            "recommended_action": action
        })

    # Sort ascending by hours remaining (most critical first)
    analyzed.sort(key=lambda x: x["hours_remaining"])
    return analyzed

def get_all_audit_logs():
    return list(db.audit_ledger.find({}, {'_id': 0}).sort("timestamp", -1))

# Initialize seeds on load
seed_initial_data()
