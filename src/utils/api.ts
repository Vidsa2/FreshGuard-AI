import { 
  FoodBatch, 
  UserProfile, 
  DeliveryTask, 
  ClearanceDetails,
  MongoDbStatus,
  RegisteredAccount,
  ExpiryTrackedItem,
  DbOrder
} from '../types';

const API_BASE = 'http://localhost:5000/api';

// Database status & configuration
export async function fetchMongoDbStatus(): Promise<MongoDbStatus> {
  try {
    const res = await fetch(`${API_BASE}/db-status`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  } catch (err) {
    return {
      connected: false,
      engine: 'MongoDB',
      mode: 'Offline / Reconnecting',
      database: 'freshguard',
      is_live: false,
      counts: { users: 0, products: 0, orders: 0, audit_ledger: 0 }
    };
  }
}

export async function configureMongoUri(uri: string): Promise<{ success: boolean; message: string; status?: MongoDbStatus }> {
  try {
    const res = await fetch(`${API_BASE}/db-config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uri })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed connecting to database' };
  }
}

// User accounts - Stored strictly in MongoDB
export async function fetchRegisteredAccounts(): Promise<RegisteredAccount[]> {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch users from MongoDB');
    }
    return await res.json();
  } catch (err: any) {
    console.error('Error fetching users from MongoDB:', err);
    return [];
  }
}

export async function registerNewAccount(accountData: any): Promise<RegisteredAccount> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accountData)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || errData.error || 'Registration failed in MongoDB');
  }
  return await res.json();
}

export async function loginUser(credentials: { emailOrUsername: string; password: string }): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.detail || 'Authentication failed. Please verify credentials.');
  }
  const data = await res.json();
  return data.user;
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.detail || 'Failed to update profile');
  }
  const data = await res.json();
  return data.user;
}

export async function changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, currentPassword, newPassword })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || errData.detail || 'Failed to update password');
  }
  return await res.json();
}

// Expiry tracker & safety shelf-life table - Stored strictly in MongoDB
export async function fetchExpiryTracker(): Promise<ExpiryTrackedItem[]> {
  try {
    const res = await fetch(`${API_BASE}/expiry-tracker`);
    if (!res.ok) throw new Error('Failed to fetch expiry data from MongoDB');
    return await res.json();
  } catch (err) {
    console.error('MongoDB query error on expiry tracker:', err);
    return [];
  }
}

// Orders & claims - Stored strictly in MongoDB
export async function fetchMongoOrders(): Promise<DbOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders from MongoDB');
    return await res.json();
  } catch {
    return [];
  }
}

export async function createMongoOrder(payload: {
  item_id: string;
  user_id: string;
  user_name?: string;
  user_org?: string;
  transaction_type: 'PURCHASE' | 'CHARITY_CLAIM';
  notes?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Transaction failed');
  }
  return await res.json();
}

export interface ApiFoodItem {
  id: string;
  donor_id?: string;
  food_name: string;
  category: string;
  batch_quantity: string;
  expiry_date: string;
  storage_condition: string;
  storage_temp: number;
  is_opened?: number | boolean;
  image_url: string;
  sha256_hash: string;
  cnn_freshness_score: number;
  listing_type: 'SALE' | 'DONATION';
  original_price?: number;
  sale_price?: number;
  discount_percent?: number;
  shelf_location?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'CLAIMED' | 'DELIVERED';
  created_at?: string;
  donor_name?: string;
  donor_org?: string;
}

// Convert ApiFoodItem from database to frontend FoodBatch
export function toFoodBatch(item: ApiFoodItem): FoodBatch {
  const isSale = item.listing_type === 'SALE';
  const isReserved = item.status === 'RESERVED';
  const isClaimed = item.status === 'CLAIMED';

  let frontendStatus: any = 'Approved';
  if (isReserved) frontendStatus = 'Reserved';
  else if (isClaimed) frontendStatus = 'Claimed';
  else if (item.status === 'DELIVERED') frontendStatus = 'Delivered';
  else if (item.status === 'AVAILABLE') frontendStatus = 'Approved';

  return {
    id: item.id,
    name: item.food_name,
    category: (item.category as any) || 'Fruits',
    quantity: item.batch_quantity || '1 Batch',
    expiryDate: item.expiry_date,
    storageCondition: (item.storage_condition as any) || 'Ambient (Room Temp)',
    ambientTemp: item.storage_temp ?? 18.0,
    packageOpened: !!item.is_opened,
    imageUrl: item.image_url,
    supermarketName: item.donor_org || item.donor_name || 'Metro Mart Supermarket',
    supermarketAddress: '45 Market Street, Sydney NSW 2000',
    distanceKm: 1.8,
    createdAt: item.created_at || new Date().toISOString(),
    status: frontendStatus,
    listingType: isSale ? 'clearance' : 'donation',
    clearanceDetails: isSale ? {
      originalPrice: item.original_price || 6.0,
      discountPercent: item.discount_percent || 50,
      salePrice: item.sale_price || 3.0,
      shelfLocation: item.shelf_location || 'Aisle 1 - Clearance Stand',
      reservedByCustomer: isReserved ? {
        customerName: 'Sarah Jenkins',
        customerPhone: '+61 400 123 456',
        reservedAt: item.created_at || new Date().toISOString(),
        pickupWindow: 'Today by 5:00 PM'
      } : undefined
    } : undefined,
    evaluation: {
      cnnConfidence: Math.round(item.cnn_freshness_score || 95),
      cnnLabel: (item.cnn_freshness_score || 95) > 60 ? 'Fresh' : 'Spoiled',
      binaryClassification: (item.cnn_freshness_score || 95) > 60 ? 'FRESH / GOOD' : 'SPOILED',
      isFresh: (item.cnn_freshness_score || 95) > 60,
      verdict: (item.cnn_freshness_score || 95) > 60 ? 'APPROVED' : 'SPOILED',
      overallVerdict: (item.cnn_freshness_score || 95) > 60 ? 'APPROVED' : 'SPOILED',
      allowListing: (item.cnn_freshness_score || 95) > 60,
      message: (item.cnn_freshness_score || 95) > 60 ? 'Verified FRESH / GOOD' : 'Marked as SPOILED',
      cnnVisualDetails: {
        colorScore: 92,
        textureIntegrity: 90,
        moldIndex: 4,
        detectedFeatures: ['Visual integrity confirmed', 'Cellular structure preserved'],
      },
      ruleChecks: [],
      sha256Hash: item.sha256_hash,
      analyzedAt: item.created_at || new Date().toISOString(),
      exifStripped: true,
    }
  };
}

export async function fetchDbFoodItems(): Promise<FoodBatch[]> {
  try {
    const res = await fetch(`${API_BASE}/food-items`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch food items from MongoDB');
    }
    const items: ApiFoodItem[] = await res.json();
    return items.map(toFoodBatch);
  } catch (err) {
    console.error('Error querying MongoDB for food items:', err);
    return [];
  }
}

export async function saveFoodItemToDb(batch: FoodBatch): Promise<boolean> {
  const payload = {
    id: batch.id,
    donor_id: 'usr_donor_001',
    food_name: batch.name,
    category: batch.category,
    batch_quantity: batch.quantity,
    expiry_date: batch.expiryDate,
    storage_condition: batch.storageCondition,
    storage_temp: batch.ambientTemp,
    is_opened: batch.packageOpened,
    image_url: batch.imageUrl,
    sha256_hash: batch.evaluation?.sha256Hash || '81c0a43bd582741071ab56d4a9157b28c39f1a687eb1877cce7285b9ecf0ab88',
    cnn_freshness_score: batch.evaluation?.cnnConfidence || 95,
    listing_type: batch.listingType === 'clearance' ? 'SALE' : 'DONATION',
    original_price: batch.clearanceDetails?.originalPrice || 0,
    sale_price: batch.clearanceDetails?.salePrice || 0,
    discount_percent: batch.clearanceDetails?.discountPercent || 0,
    shelf_location: batch.clearanceDetails?.shelfLocation || 'Aisle 1 - Clearance Stand',
  };

  const res = await fetch(`${API_BASE}/food-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to persist food item directly to MongoDB');
  }
  return true;
}

export async function updateFoodItemStatusInDb(itemId: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/food-items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function recordDbOrderOrClaim(
  itemId: string,
  userId: string,
  transactionType: 'PURCHASE' | 'CHARITY_CLAIM',
  notes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId, user_id: userId, transaction_type: transactionType, notes }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

