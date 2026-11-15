export type FoodCategory = 'Fruits' | 'Vegetables' | 'Dairy' | 'Bakery' | 'Prepared Meals';

export type StorageCondition = 'Ambient (Room Temp)' | 'Refrigerated (0-4°C)' | 'Chilled (4-8°C)' | 'Frozen (-18°C)';

export type ItemStatus = 'Pending Assessment' | 'Approved' | 'Spoiled' | 'Claimed' | 'In Transit' | 'Delivered' | 'Reserved';

export type ListingType = 'donation' | 'clearance';

export interface ClearanceDetails {
  originalPrice: number;
  discountPercent: number; // e.g. 30, 50, 70
  salePrice: number;
  shelfLocation: string; // e.g. "Aisle 3 - Flash Sale Bin"
  reservedByCustomer?: {
    customerName: string;
    customerPhone: string;
    reservedAt: string;
    pickupDeadline?: string;
    pickupWindow?: string;
  };
}

export interface RuleCheckResult {
  id: string;
  name: string;
  criterion: string;
  actual: string;
  passed: boolean;
  notes: string;
}

export interface GradCamDefectBox {
  id: string;
  label: string;
  confidence: number;
  severity: 'Critical' | 'Warning' | 'Trace';
  top: number;    // %
  left: number;   // %
  width: number;  // %
  height: number; // %
  notes: string;
}

export interface EvaluationResult {
  cnnConfidence: number; // 0 - 100
  cnnLabel: 'Fresh' | 'Marginal' | 'Spoiled';
  binaryClassification?: 'FRESH / GOOD' | 'SPOILED';
  isFresh?: boolean;
  verdict?: 'APPROVED' | 'SPOILED';
  overallVerdict: 'APPROVED' | 'SPOILED';
  allowListing?: boolean;
  message?: string;
  cnnVisualDetails: {
    colorScore: number;
    textureIntegrity: number;
    moldIndex: number;
    detectedFeatures: string[];
  };
  gradCamDefects?: GradCamDefectBox[];
  ruleChecks: RuleCheckResult[];
  isFood?: boolean;
  rejectionReason?: string;
  sha256Hash: string;
  analyzedAt: string;
  exifStripped: boolean;
}

export interface IoTTelemetryPoint {
  time: string;
  temperature: number;
  targetMax: number;
  targetMin: number;
  humidity: number;
  batteryLevel: number;
}

export type DeliveryStatus = 'Assigned' | 'Route Optimized' | 'Picked Up' | 'In Transit' | 'Delivered';

export interface DeliveryTask {
  taskId: string;
  containerId?: string;
  vehicleType?: string;
  volunteerName: string;
  volunteerPhone?: string;
  pickupLocation: string;
  deliveryDestination: string;
  charityContact: string;
  estimatedMinutes: number;
  distanceKm: number;
  currentStatus: DeliveryStatus;
  statusHistory: {
    status: DeliveryStatus;
    timestamp: string;
    note?: string;
  }[];
  temperatureComplianceConfirmed: boolean;
  currentProbeTemp?: number;
  iotTelemetry?: IoTTelemetryPoint[];
}

export interface FoodBatch {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  expiryDate: string;
  storageCondition: StorageCondition;
  ambientTemp: number;
  packageOpened: boolean;
  imageUrl: string;
  supermarketName: string;
  supermarketAddress: string;
  distanceKm: number;
  createdAt: string;
  evaluation?: EvaluationResult;
  status: ItemStatus;
  claimedBy?: {
    charityName: string;
    shelterType: string;
    claimedAt: string;
  };
  deliveryTask?: DeliveryTask;
  isNewArrival?: boolean;
  listingType?: ListingType;
  clearanceDetails?: ClearanceDetails;
}

export interface PresetSample {
  id: string;
  name: string;
  category: FoodCategory;
  quantity: string;
  storageCondition: StorageCondition;
  ambientTemp: number;
  packageOpened: boolean;
  daysToExpiry: number;
  imageUrl: string;
  isSpoiledScenario?: boolean;
  description: string;
  gradCamDefects?: GradCamDefectBox[];
}

export interface RegulatoryRule {
  id: string;
  category: FoodCategory;
  standardCode: string;
  ruleTitle: string;
  maxHoldingTemp: string;
  safeExpiryBuffer: string;
  packagingStandard: string;
  ethyleneBehavior: 'High Producer' | 'High Sensitivity' | 'Neutral';
  actionOnViolation: string;
  authority: 'FSANZ Standard 1.2.5' | 'HACCP CCP-1' | 'Queensland Health Act 2006' | 'FDA Food Code §117';
}

export interface HpcBenchmarkData {
  preprocessLatencyMs: number;
  inferenceInt8Ms: number;
  inferenceFp32Ms: number;
  accelerationFactor: number;
  cryptoThroughputGbps: number;
  acidTxLatencyMs: number;
  memoryFootprintMb: number;
  throughputFps: number;
}

export type NavSection = 'impact' | 'diagnostics' | 'marketplace' | 'coldchain' | 'audit' | 'hpc-benchmarks';

export type AppView = 'donor_portal' | 'marketplace_portal';

export type DashboardModule = 'accounts' | 'sell' | 'buy' | 'expiry';

export type UserRole = 'donor' | 'charity' | 'volunteer' | 'driver' | 'buyer' | 'inspector';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organizationName: string;
  avatarUrl?: string;
  location?: string;
  phone?: string;
  badgeNumber?: string;
  businessLicense?: string;
  storeAddress?: string;
  coldStorageCapacity?: string;
  taxExemptionId?: string;
  shelterLicense?: string;
}

export interface MongoDbStatus {
  connected: boolean;
  engine: string;
  mode: string;
  database: string;
  is_live: boolean;
  uri?: string;
  counts: {
    users: number;
    products: number;
    orders: number;
    audit_ledger: number;
  };
}

export interface RegisteredAccount {
  id: string;
  full_name: string;
  org_name: string;
  email: string;
  role: 'donor' | 'charity' | 'volunteer' | 'buyer';
  business_license?: string;
  store_address?: string;
  cold_storage_capacity?: string;
  tax_exemption_id?: string;
  shelter_license?: string;
  created_at: string;
}

export interface ExpiryTrackedItem {
  id: string;
  food_name: string;
  category: FoodCategory;
  batch_quantity: string;
  expiry_date: string;
  storage_condition: string;
  storage_temp: number;
  image_url: string;
  sha256_hash: string;
  cnn_freshness_score: number;
  listing_type: 'SALE' | 'DONATION';
  original_price: number;
  sale_price: number;
  discount_percent: number;
  shelf_location: string;
  status: string;
  hours_remaining: number;
  urgency: 'CRITICAL' | 'WARNING' | 'SAFE' | 'EXPIRED';
  recommended_action: string;
  donor_name?: string;
  donor_org?: string;
}

export interface DbOrder {
  id: string;
  item_id: string;
  user_id: string;
  user_name: string;
  user_org?: string;
  transaction_type: 'PURCHASE' | 'CHARITY_CLAIM';
  status: string;
  notes: string;
  created_at: string;
}
