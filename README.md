# FreshGuard AI — Food Freshness Detection & Redistribution System
> **Academic Project (CO3554):** AI-Driven Food Freshness Detection & Redistribution System for Supermarkets and Charities.

---

## 🌟 Executive Overview
**FreshGuard AI** is a modern, responsive, full-stack web application engineered to solve surplus food waste and prevent donation safety risks. It bridges donor supermarkets with local emergency food banks and volunteer couriers through a **dual-tier assessment pipeline**:
1. **CNN Visual Freshness Classifier (MobileNetV3 / ResNet-50 architecture)**: Identifies color pigmentation uniformity, cellular tissue breakdown, and fungal mycelium / mold spore colonization.
2. **Deterministic Regulatory Rule Engine**: Enforces strict compliance with **FSANZ Standard 1.2.5** (date marking), **HACCP CCP-1** (storage temperature limits), and **FDA §117.80** (packaging seal & cross-contamination barrier).
3. **Cryptographic Chain-of-Custody**: Automatically strips identifying EXIF metadata (GPS, camera serials) for privacy and generates immutable **SHA-256 digital digests** logged in an audit ledger.

---

## 🎨 Design System & Theme
- **Aesthetic**: Clean eco-tech with soft dimensional shadows, rounded modern cards, and high-contrast typography.
- **Color Palette**:
  - Deep Forest Green (`#1b4332`, `#081c15`)
  - Vibrant Fresh Emerald (`#2d6a4f`, `#40916c`)
  - Mint Highlights (`#74c69d`, `#d8f3dc`)
  - Crisp Slate & Canvas (`#f8fafc`, `#ffffff`)
  - Safety Alert Badges: Emerald Green (`#059669` Approved), Crimson Red (`#dc2626` Spoiled), Amber (`#d97706` Warning).
- **Icons**: Lucide icons (`Camera`, `ShieldCheck`, `CheckCircle`, `AlertTriangle`, `Truck`, `HeartHandshake`, `MapPin`, `Clock`, `Sparkles`, etc.).

---

## 🖥️ Screen Architecture & Workflows

### 1. Supermarket Donor View (Assessment & Upload)
- **Drag-and-Drop Image Zone**: Real-time image upload or sample selection with automatic EXIF metadata stripping and live SHA-256 computation indicator.
- **1-Click Test Scenarios**: Quick presets including *Fresh Cavendish Bananas*, *Organic Whole Milk*, *Crisp Baby Spinach*, *Moldy Strawberries (Spoiled Test)*, and *Cold-Chain Violated Dairy (Temp Test)*.
- **Assessment Form**: Food category, batch quantity, interactive expiry date picker, storage condition selector, probe temperature (°C), and package seal toggle.
- **Diagnostic Results Card**:
  - Scanning animation with laser sweep and neural layer feature extraction.
  - Security Check badge with generated SHA-256 fingerprint.
  - Dual Evaluation breakdown:
    - **CNN Visual Freshness Score**: Circular SVG progress bar, color vibrancy score, texture integrity score, and mold spore index.
    - **Rule-Based Compliance**: Checklist verifying expiry, storage temperature, and barrier packaging.
  - **Verdict Banner**: Prominent badge for `FRESH / APPROVED FOR REDISTRIBUTION` or `SPOILED / UNSAFE FOR DONATION` with failure reason.
  - **"List Batch for Charity Donation" Button**: Adds the batch directly to the Charity Marketplace and logs it into the immutable Audit Ledger with celebratory confetti.

### 2. Charity & Volunteer Marketplace Portal
- **Smart Filter & Search Bar**:
  - Category filtering (Produce, Dairy, Bakery, Prepared Meals).
  - Distance radius slider (1 km to 25 km).
  - Urgency & shelf-life filter: Critical (<12h), Urgent (<24h), Extended (>24h).
  - Live text search by food name, batch ID, or donor supermarket.
- **Surplus Food Cards**:
  - Image, supermarket name, distance badge, and verified confidence badge (`96% Fresh - SHA-256 Verified`).
  - Color-coded expiry countdown tag.
- **Action Modals**:
  1. **Claim for Shelter / Charity**: Select recipient shelter (e.g., Downtown Hope Shelter, St. Vincent Community Kitchen), note service requirements, and reserve.
  2. **Volunteer Delivery Task**: Real-time dispatch modal with store pickup location, charity drop-off address, cold-chain reminder, and interactive lifecycle stepper:
     $$\text{Assigned} \longrightarrow \text{Picked Up} \longrightarrow \text{In Transit} \longrightarrow \text{Delivered}$$

### 3. Audit & Integrity Log (CO3554 Academic Feature)
- **Cryptographic Audit Table**:
  - Columns: Batch ID, Timestamp, Item Name & Category, SHA-256 Image Hash (with 1-click copy), CNN Confidence, Rule Verdict, Final Status, and Audit Verification (`Valid / Untampered`).
- **Interactive Tools**:
  - Search by batch ID, item name, or hash snippet.
  - Status filters (Approved, Spoiled, Claimed, In Transit, Delivered).
  - **Verify Ledger Hashes**: Executes a live cryptographic Merkle integrity sweep.
  - **Export CSV**: Instant export of audit records for academic reporting.
  - **Certificate of Analysis (COA) Modal**: Displays full cryptographic certificate with QR code and rule checklist.

---

## ⚡ Technical Stack & Architecture
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom eco-tech theme
- **Icons**: Lucide React
- **Cryptography**: Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`)
- **Build Tool**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`
- **Animations & Interactivity**: Canvas Confetti, CSS radar/laser scan line, circular SVG progress animations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22.13.0)
- npm 9+

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) or [http://localhost:4173](http://localhost:4173) in your browser.

