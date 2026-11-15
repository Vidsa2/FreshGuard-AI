import { FoodBatch, PresetSample, RegulatoryRule, HpcBenchmarkData, IoTTelemetryPoint, UserProfile } from '../types';

export const DEMO_USERS: Record<string, UserProfile> = {
  donor: {
    id: 'user-donor-101',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@metromart.com',
    role: 'donor',
    organizationName: 'Metro Mart Supermarkets',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    location: 'Central Store #104 — Grand Ave',
    phone: '+1 (555) 234-5678',
    badgeNumber: 'STR-9941'
  },
  charity: {
    id: 'user-charity-202',
    fullName: 'David Miller',
    email: 'david@hopefoodbank.org',
    role: 'charity',
    organizationName: 'Downtown Hope Food Bank',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Shelter Hub #3 — Elm Street',
    phone: '+1 (555) 890-4321',
    badgeNumber: 'ORG-7712'
  },
  driver: {
    id: 'user-driver-303',
    fullName: 'Alex Mercer',
    email: 'alex.m@greencourier.net',
    role: 'driver',
    organizationName: 'GreenCourier Volunteer Hub',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Metro Regional Fleet (Refrigerated Van #12)',
    phone: '+1 (555) 678-9012',
    badgeNumber: 'VOL-4402'
  },
  volunteer: {
    id: 'user-volunteer-303',
    fullName: 'Alex Mercer',
    email: 'alex.m@greencourier.net',
    role: 'volunteer',
    organizationName: 'GreenCourier Volunteer Rapid Fleet',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Metro Regional Fleet (Refrigerated Van #12)',
    phone: '+1 (555) 678-9012',
    badgeNumber: 'VOL-4402'
  },
  buyer: {
    id: 'user-buyer-505',
    fullName: 'Sarah Jenkins',
    email: 'sarah.buyer@gmail.com',
    role: 'buyer',
    organizationName: 'Community Flash Sale Shopper',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    location: 'Downtown District Resident',
    phone: '+1 (555) 789-2345',
    badgeNumber: 'CUST-3310'
  },
  inspector: {
    id: 'user-inspector-404',
    fullName: 'Dr. Elena Rostova',
    email: 'elena.rostova@foodsafety.gov',
    role: 'inspector',
    organizationName: 'FSANZ Food Safety Authority',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    location: 'Metro Quality Inspection Bureau',
    phone: '+1 (555) 345-6789',
    badgeNumber: 'AUD-1088'
  }
};

export const INITIAL_IOT_TELEMETRY: IoTTelemetryPoint[] = [
  { time: '14:00', temperature: 3.1, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 98 },
  { time: '14:08', temperature: 3.3, targetMax: 4.0, targetMin: 0.5, humidity: 81, batteryLevel: 97 },
  { time: '14:16', temperature: 3.5, targetMax: 4.0, targetMin: 0.5, humidity: 80, batteryLevel: 96 },
  { time: '14:24', temperature: 3.2, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 95 },
  { time: '14:32', temperature: 3.4, targetMax: 4.0, targetMin: 0.5, humidity: 83, batteryLevel: 94 },
  { time: '14:40', temperature: 3.6, targetMax: 4.0, targetMin: 0.5, humidity: 79, batteryLevel: 93 },
  { time: '14:48', temperature: 3.3, targetMax: 4.0, targetMin: 0.5, humidity: 81, batteryLevel: 92 },
  { time: '14:56', temperature: 3.4, targetMax: 4.0, targetMin: 0.5, humidity: 82, batteryLevel: 91 },
];

export const INITIAL_FOOD_BATCHES: FoodBatch[] = [
  {
    id: 'BATCH-2026-8812',
    name: 'Fresh Cavendish Bananas',
    category: 'Fruits',
    quantity: '15 kg (3 Crates)',
    expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Ambient (Room Temp)',
    ambientTemp: 19.5,
    packageOpened: false,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'Woolworths Supermarket — Southbank Hub',
    supermarketAddress: '180 Grey Street, South Brisbane QLD 4101',
    distanceKm: 2.4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'In Transit',
    evaluation: {
      cnnConfidence: 96,
      cnnLabel: 'Fresh',
      cnnVisualDetails: {
        colorScore: 97,
        textureIntegrity: 95,
        moldIndex: 1,
        detectedFeatures: ['Natural chlorophyll fade to optimal yellow', 'Firm peel integrity', 'Zero fungal growth markers'],
      },
      gradCamDefects: [
        { id: 'cam-1', label: 'Optimal Peel Chlorophyll Matrix', confidence: 96.8, severity: 'Trace', top: 25, left: 30, width: 45, height: 40, notes: 'Uniform carotenoid reflectance' },
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: '18 hours remaining', passed: true, notes: 'Priority redistribution recommended' },
        { id: 'R2', name: 'HACCP CCP-1 Ambient Temp', criterion: 'Temp ≤ 25°C', actual: '19.5°C', passed: true, notes: 'Climate-controlled room' },
        { id: 'R3', name: 'Barrier & Packaging Check', criterion: 'Physical protection intact', actual: 'Crated & Ventilated', passed: true, notes: 'Intact' },
        { id: 'R4', name: 'Produce Pathogen Matrix', criterion: 'Visual inspection pass', actual: 'Passed (96%)', passed: true, notes: 'Safe for direct consumption' },
      ],
      overallVerdict: 'APPROVED',
      sha256Hash: '4a6b8e2190fd8e82a5c4d1109923ef120b4c81a29903b128509c8f203841ec45',
      analyzedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
    claimedBy: {
      charityName: 'Brisbane Community Food Hub',
      shelterType: 'Emergency Shelter Pantry',
      claimedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    deliveryTask: {
      taskId: 'DELIV-LOG-901',
      containerId: 'ISOPACK-B812',
      vehicleType: 'Electric Cargo Van (Cold Box)',
      volunteerName: 'Marcus Evans',
      volunteerPhone: '+61 412 884 192',
      pickupLocation: 'Woolworths Southbank, Loading Dock 2',
      deliveryDestination: 'Brisbane Community Food Hub (14 Russell St)',
      charityContact: 'Sarah Jenkins (+61 7 3840 9100)',
      estimatedMinutes: 14,
      distanceKm: 2.4,
      currentStatus: 'Picked Up',
      statusHistory: [
        { status: 'Assigned', timestamp: '14:02', note: 'Courier matched via geofence' },
        { status: 'Route Optimized', timestamp: '14:05', note: 'Shortest transit route via Grey St locked' },
        { status: 'Picked Up', timestamp: '14:22', note: 'Cargo scanned at dock. Sensor probe verified at 3.3°C' },
      ],
      temperatureComplianceConfirmed: true,
      currentProbeTemp: 3.3,
      iotTelemetry: INITIAL_IOT_TELEMETRY,
    },
  },
  {
    id: 'BATCH-2026-8813',
    name: 'Organic Whole Milk (Pasteurized)',
    category: 'Dairy',
    quantity: '8 L (4 Gallons)',
    expiryDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Refrigerated (0-4°C)',
    ambientTemp: 3.2,
    packageOpened: false,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'Coles Supermarkets — West End',
    supermarketAddress: '312 Boundary St, West End QLD 4101',
    distanceKm: 1.8,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'Approved',
    evaluation: {
      cnnConfidence: 98,
      cnnLabel: 'Fresh',
      cnnVisualDetails: {
        colorScore: 99,
        textureIntegrity: 98,
        moldIndex: 0,
        detectedFeatures: ['Bottle tamper seal intact', 'Zero curdling or sedimentation', 'Optical density uniform'],
      },
      gradCamDefects: [
        { id: 'cam-2', label: 'Hermetic Cap Vacuum Seal', confidence: 99.1, severity: 'Trace', top: 12, left: 35, width: 30, height: 25, notes: 'Tamper-evident collar uncompromised' }
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: '36 hours remaining', passed: true, notes: 'Good safety buffer' },
        { id: 'R2', name: 'HACCP CCP-1 Cold Chain Temp', criterion: 'Temp ≤ 4.0°C', actual: '3.2°C', passed: true, notes: 'Continuous refrigeration verified' },
        { id: 'R3', name: 'FDA §117.80 Tamper Seal', criterion: 'Bottle unopened & vacuum intact', actual: 'Factory Sealed', passed: true, notes: 'Zero cross-contamination risk' },
      ],
      overallVerdict: 'APPROVED',
      sha256Hash: 'b7c3d198034a78216fcb19d80312aa89445890de89230571120fef731998cd12',
      analyzedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
  },
  {
    id: 'BATCH-2026-8814',
    name: 'Artisan Rustic Sourdough Loaves',
    category: 'Bakery',
    quantity: '12 Large Loaves',
    expiryDate: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Ambient (Room Temp)',
    ambientTemp: 21.0,
    packageOpened: false,
    imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'Artisan Bakery Central',
    supermarketAddress: '88 Baker Row, Fortitude Valley QLD 4006',
    distanceKm: 3.1,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'Claimed',
    claimedBy: {
      charityName: 'St. Vincent de Paul Community Kitchen',
      shelterType: 'Soup Kitchen Service',
      claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    evaluation: {
      cnnConfidence: 93,
      cnnLabel: 'Fresh',
      cnnVisualDetails: {
        colorScore: 95,
        textureIntegrity: 91,
        moldIndex: 1,
        detectedFeatures: ['Golden crust caramelization intact', 'No surface mold hyphae', 'Crumb elasticity optimal'],
      },
      gradCamDefects: [
        { id: 'cam-3', label: 'Crust Aeration & Maillard Crust', confidence: 94.2, severity: 'Trace', top: 30, left: 20, width: 60, height: 50, notes: 'Normal crust fissure' }
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: '14 hours remaining', passed: true, notes: 'Redistribute today' },
        { id: 'R2', name: 'HACCP CCP-1 Ambient Temp', criterion: 'Temp ≤ 25°C', actual: '21.0°C', passed: true, notes: 'Dry ambient storage' },
        { id: 'R3', name: 'Bakery Paper Bagging Standard', criterion: 'Food-grade wrapping', actual: 'Sealed Bakery Liner', passed: true, notes: 'Intact' },
      ],
      overallVerdict: 'APPROVED',
      sha256Hash: '98ea2f4405a1082c3510bc8923a1005b4d8900a30b771329c0f99281a7420e98',
      analyzedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
  },
  {
    id: 'BATCH-2026-8815',
    name: 'Hydroponic Baby Spinach Crates',
    category: 'Vegetables',
    quantity: '10 Crates (20 kg)',
    expiryDate: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Chilled (4-8°C)',
    ambientTemp: 5.4,
    packageOpened: false,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'GreenGrocer Hypermarket',
    supermarketAddress: '310 Riverdale St, South Bay QLD 4105',
    distanceKm: 4.2,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'Approved',
    evaluation: {
      cnnConfidence: 95,
      cnnLabel: 'Fresh',
      cnnVisualDetails: {
        colorScore: 98,
        textureIntegrity: 93,
        moldIndex: 0,
        detectedFeatures: ['High chlorophyll saturation', 'Turgid cellular leaf wall', 'Zero slimy rot spots'],
      },
      gradCamDefects: [
        { id: 'cam-4', label: 'Turgid Foliage Chloroplast Layer', confidence: 96.0, severity: 'Trace', top: 20, left: 15, width: 70, height: 65, notes: 'Healthy cellular turgor' }
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: '28 hours remaining', passed: true, notes: 'High freshness index' },
        { id: 'R2', name: 'HACCP CCP-1 Chilled Temp', criterion: 'Temp ≤ 8.0°C', actual: '5.4°C', passed: true, notes: 'Crisper storage verified' },
      ],
      overallVerdict: 'APPROVED',
      sha256Hash: '3f044bb71900de21145a30f19984b238a801f99cba483908812cde4500918ef1',
      analyzedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
  },
  {
    id: 'BATCH-2026-8816',
    name: 'Prepared Mediterranean Quinoa Bowls',
    category: 'Prepared Meals',
    quantity: '20 Individual Sealed Bowls',
    expiryDate: new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Refrigerated (0-4°C)',
    ambientTemp: 3.8,
    packageOpened: false,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'Urban Deli & Market',
    supermarketAddress: '19 Market Square, Civic Center',
    distanceKm: 1.2,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'Approved',
    evaluation: {
      cnnConfidence: 94,
      cnnLabel: 'Fresh',
      cnnVisualDetails: {
        colorScore: 94,
        textureIntegrity: 93,
        moldIndex: 0,
        detectedFeatures: ['Hermetic plastic seal intact', 'Vegetables crisp', 'No condensation gas swelling'],
      },
      gradCamDefects: [
        { id: 'cam-5', label: 'Hermetic Heat-Sealed Film Barrier', confidence: 95.5, severity: 'Trace', top: 5, left: 10, width: 80, height: 85, notes: 'Zero packaging dome gas' }
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: '9 hours remaining', passed: true, notes: 'Urgent: Consume today' },
        { id: 'R2', name: 'HACCP CCP-1 Cold Chain Temp', criterion: 'Temp ≤ 4.0°C', actual: '3.8°C', passed: true, notes: 'Compliant' },
        { id: 'R3', name: 'FDA §117.80 Package Seal', criterion: 'Sealed & uncompromised', actual: 'Hermetically Sealed', passed: true, notes: 'Safe' },
      ],
      overallVerdict: 'APPROVED',
      sha256Hash: '7c891e4590ba3312c88f198124500bb43781290fe912389100129bcba405f6e8',
      analyzedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
  },
  {
    id: 'BATCH-2026-8817',
    name: 'Molded Overripe Strawberries (Rejection Test)',
    category: 'Fruits',
    quantity: '6 Punners (3 kg)',
    expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    storageCondition: 'Ambient (Room Temp)',
    ambientTemp: 24.2,
    packageOpened: true,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    supermarketName: 'Metro Market Annex',
    supermarketAddress: '55 Pine St, Eastside',
    distanceKm: 3.5,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'Spoiled',
    evaluation: {
      cnnConfidence: 34,
      cnnLabel: 'Spoiled',
      cnnVisualDetails: {
        colorScore: 38,
        textureIntegrity: 29,
        moldIndex: 86,
        detectedFeatures: ['Botrytis cinerea (Grey Mold) colonies identified', 'Fruit collapse and juice weeping', 'Severe tissue maceration'],
      },
      gradCamDefects: [
        { id: 'cam-mold-1', label: 'Botrytis cinerea (Grey Mold Spores)', confidence: 91.4, severity: 'Critical', top: 28, left: 32, width: 42, height: 38, notes: 'Active fungal hyphae network' },
        { id: 'cam-mold-2', label: 'Cellular Necrosis & Liquid Weep', confidence: 84.7, severity: 'Critical', top: 58, left: 24, width: 35, height: 28, notes: 'Epidermal maceration' }
      ],
      ruleChecks: [
        { id: 'R1', name: 'FSANZ 1.2.5 Shelf-Life Standard', criterion: 'Expiry > 0 days', actual: 'Expired 1 day ago', passed: false, notes: 'Past shelf life limit' },
        { id: 'R2', name: 'HACCP CCP-1 Ambient Temp', criterion: 'Temp ≤ 25°C', actual: '24.2°C', passed: true, notes: 'High heat accelerates mold growth' },
        { id: 'R3', name: 'Visual Pathogen Check', criterion: 'Zero mold tolerance', actual: 'Fungal mycelium detected (86% mold index)', passed: false, notes: 'REJECTED: Microbial risk' },
      ],
      overallVerdict: 'SPOILED',
      rejectionReason: 'CNN Classifier detected active fungal mold (Botrytis cinerea) & expired shelf-life.',
      sha256Hash: '99bf45012399a80e123fa7b6530182412e8841a0b3f88591240cc918ef00213d',
      analyzedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      exifStripped: true,
    },
  },
];

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'preset-bananas',
    name: 'Fresh Organic Cavendish Bananas',
    category: 'Fruits',
    quantity: '18 kg (4 Crates)',
    storageCondition: 'Ambient (Room Temp)',
    ambientTemp: 20.0,
    packageOpened: false,
    daysToExpiry: 3,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    description: 'Clean bright yellow skin, no bruising, optimal condition for shelter meals.',
    gradCamDefects: [
      { id: 'cam-b1', label: 'Optimal Peel Chlorophyll Matrix', confidence: 97.2, severity: 'Trace', top: 22, left: 28, width: 48, height: 42, notes: 'Uniform carotenoid reflectance' }
    ]
  },
  {
    id: 'preset-milk',
    name: 'Whole Milk Bottles (1L x 10)',
    category: 'Dairy',
    quantity: '10 Liters',
    storageCondition: 'Refrigerated (0-4°C)',
    ambientTemp: 3.5,
    packageOpened: false,
    daysToExpiry: 4,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    description: 'Cold-chain compliant, factory sealed foil cap, ready for distribution.',
    gradCamDefects: [
      { id: 'cam-m1', label: 'Hermetic Cap Collar Seal', confidence: 99.4, severity: 'Trace', top: 15, left: 32, width: 36, height: 26, notes: 'Tamper ring intact' }
    ]
  },
  {
    id: 'preset-spinach',
    name: 'Crisp Hydroponic Baby Spinach',
    category: 'Vegetables',
    quantity: '8 Crates (16 kg)',
    storageCondition: 'Chilled (4-8°C)',
    ambientTemp: 5.0,
    packageOpened: false,
    daysToExpiry: 2,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    description: 'Deep green crisp foliage, fresh moisture, safe for immediate meal prep.',
    gradCamDefects: [
      { id: 'cam-s1', label: 'Turgid Foliage Chloroplast Layer', confidence: 95.8, severity: 'Trace', top: 20, left: 18, width: 64, height: 60, notes: 'High cellular turgor' }
    ]
  },
  {
    id: 'preset-moldy-strawberries',
    name: 'Damaged Strawberries (Mold Failure Test)',
    category: 'Fruits',
    quantity: '5 Punners',
    storageCondition: 'Ambient (Room Temp)',
    ambientTemp: 23.5,
    packageOpened: true,
    daysToExpiry: -1,
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    isSpoiledScenario: true,
    description: 'Simulation scenario: Visibly molded surface, past expiry date, will fail safety rules.',
    gradCamDefects: [
      { id: 'cam-str-1', label: 'Botrytis cinerea (Grey Mold Spores)', confidence: 92.6, severity: 'Critical', top: 26, left: 34, width: 44, height: 40, notes: 'Active fungal hyphae network' },
      { id: 'cam-str-2', label: 'Epidermal Tissue Softening', confidence: 85.3, severity: 'Warning', top: 62, left: 22, width: 34, height: 26, notes: 'Cellular necrosis exudate' }
    ]
  },
  {
    id: 'preset-temp-fail-dairy',
    name: 'Yogurt Tubs (Cold Chain Violation Test)',
    category: 'Dairy',
    quantity: '12 Tubs',
    storageCondition: 'Refrigerated (0-4°C)',
    ambientTemp: 14.8, // Violated temperature!
    packageOpened: true,
    daysToExpiry: 1,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    isSpoiledScenario: true,
    description: 'Simulation scenario: Dairy left at 14.8°C (above 4°C limit) with seal opened.',
    gradCamDefects: [
      { id: 'cam-yog-1', label: 'Broken Seal / Bacterial Exudate Risk', confidence: 94.7, severity: 'Critical', top: 18, left: 28, width: 46, height: 35, notes: 'Seal compromised at elevated 14.8°C' }
    ]
  },
];

export const REGULATORY_SAFETY_RULES: RegulatoryRule[] = [
  {
    id: 'RULE-FSANZ-01',
    category: 'Dairy',
    standardCode: 'FSANZ Standard 1.2.5',
    ruleTitle: 'Perishable Dairy Cold-Chain Ceiling',
    maxHoldingTemp: '≤ 4.0°C (Absolute limit: 5.0°C for < 2 hrs)',
    safeExpiryBuffer: 'Minimum 24 hours remaining to Use-By date',
    packagingStandard: 'Hermetic factory vacuum foil or tamper-evident ring intact',
    ethyleneBehavior: 'Neutral',
    actionOnViolation: 'Immediate destruction; zero-tolerance for pasteurized dairy breach',
    authority: 'FSANZ Standard 1.2.5'
  },
  {
    id: 'RULE-HACCP-02',
    category: 'Fruits',
    standardCode: 'HACCP CCP-1',
    ruleTitle: 'Fresh Produce Microbial Barrier & Rot Standard',
    maxHoldingTemp: 'Ambient ≤ 22°C (Cold-chain fruits ≤ 7°C)',
    safeExpiryBuffer: 'Sensory inspection valid within 48h distribution window',
    packagingStandard: 'Food-grade breathable crates or perforated plastic liners',
    ethyleneBehavior: 'High Producer',
    actionOnViolation: 'Sort & isolate molded units; divert salvageable produce to bio-digestion',
    authority: 'HACCP CCP-1'
  },
  {
    id: 'RULE-QLD-03',
    category: 'Prepared Meals',
    standardCode: 'Queensland Food Act 2006 (Div 4)',
    ruleTitle: 'Potentially Hazardous Foods (PHF) Temperature Range',
    maxHoldingTemp: 'Hot hold ≥ 60°C OR Chilled ≤ 4°C (2hr / 4hr rule applies)',
    safeExpiryBuffer: 'Must be delivered and consumed within same-day service',
    packagingStandard: 'Hermetically heat-sealed food tray with tamper-evident film',
    ethyleneBehavior: 'Neutral',
    actionOnViolation: 'Mandatory disposal if in temperature danger zone (5°C–60°C) > 2 hours',
    authority: 'Queensland Health Act 2006'
  },
  {
    id: 'RULE-FSANZ-04',
    category: 'Bakery',
    standardCode: 'FSANZ Standard 3.2.2',
    ruleTitle: 'Bakery Shelf-Life & Moisture Control',
    maxHoldingTemp: 'Ambient dry storage ≤ 24°C (Relative humidity < 65%)',
    safeExpiryBuffer: 'Minimum 12 hours remaining before staleness degradation',
    packagingStandard: 'Perforated poly or micro-vented kraft paper bag',
    ethyleneBehavior: 'Neutral',
    actionOnViolation: 'Secondary redistribution for soup croutons or livestock feed',
    authority: 'FSANZ Standard 1.2.5'
  },
  {
    id: 'RULE-FDA-05',
    category: 'Vegetables',
    standardCode: 'FDA Food Code §117.80',
    ruleTitle: 'Cut Leafy Greens & Hydroponic Hygiene',
    maxHoldingTemp: 'Chilled ≤ 5.0°C',
    safeExpiryBuffer: 'Minimum 36 hours remaining before leaf liquefaction',
    packagingStandard: 'Sanitized crisper crate or micro-perforated bag',
    ethyleneBehavior: 'High Sensitivity',
    actionOnViolation: 'Isolate from ethylene producers (apples/bananas); reject if slimy rot detected',
    authority: 'FDA Food Code §117'
  }
];

export const HPC_BENCHMARKS: HpcBenchmarkData = {
  preprocessLatencyMs: 3.2,
  inferenceInt8Ms: 11.4,
  inferenceFp32Ms: 148.0,
  accelerationFactor: 12.98, // 148 / 11.4 ~ 13x (92.3% reduction)
  cryptoThroughputGbps: 1.45,
  acidTxLatencyMs: 4.1,
  memoryFootprintMb: 210,
  throughputFps: 87.7
};

export const CHARITY_SHELTERS = [
  {
    name: 'Downtown Hope Shelter & Food Bank',
    type: 'Emergency Family Shelter',
    address: '240 S Olive St, Downtown Metro',
    capacity: '180 residents daily',
    contact: '+1 (555) 234-8901',
  },
  {
    name: 'St. Vincent Community Kitchen',
    type: 'Hot Meals Soup Kitchen',
    address: '715 Mercy Way, Westside',
    capacity: '350 hot lunches daily',
    contact: '+1 (555) 890-1234',
  },
  {
    name: 'Harbor City Youth Table',
    type: 'After-School Nutrition Center',
    address: '14 Riverbend Blvd, South Bay',
    capacity: '95 youths daily',
    contact: '+1 (555) 432-7890',
  },
  {
    name: 'Mission Grace Senior Center',
    type: 'Elderly Food Outreach',
    address: '502 Pinecrest Avenue, North Quarter',
    capacity: '120 seniors daily',
    contact: '+1 (555) 678-3456',
  },
];
