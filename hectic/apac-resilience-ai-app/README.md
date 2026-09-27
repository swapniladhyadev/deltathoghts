# ⚡ APAC-Resilience AI | Bay of Bengal Anticipatory Action & Parametric Risk Platform

![License](https://img.shields.io/badge/license-MIT-cyan.svg)
![Version](https://img.shields.io/badge/version-3.7%20PRO-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

**APAC-Resilience AI** is an advanced, full-stack pre-landfall climate risk sentinel and anticipatory action platform tailored for coastal APAC regions and the Bay of Bengal. It combines real-time GIS mapping, satellite imagery, Google Earth Engine (GEE) hydrodynamic storm surge modeling, automated Gemini 3.7 Flash AI advisories, and parametric insurance payout smart contracts.

---

## 🌟 Key Features

1. **🗺️ Interactive GIS & Google Maps Platform**:
   - Integrated Google Maps JavaScript API with dynamic custom styling and Places Autocomplete.
   - Multi-layer Leaflet GIS view: GEE Hydrodynamic Surge Heatmap, Sentinel-1 SAR Flood Inundation, Critical Infrastructure & Shelters, Oceanographic Telemetry Buoys, Esri High-Res Satellite, and CartoDB Dark Matter base.

2. **🌀 Live Cyclone Tracking & Telemetry Scrubber**:
   - Presets for Category 4 Super Cyclone Bay-26X, Cyclone Remal, and Category 5 Cyclone Mocha.
   - Interactive pre-landfall lead time scrubber (`T-72h` down to `Landfall (T-0)` and post-landfall recovery).
   - Real-time telemetry HUD displaying central pressure (hPa), peak surge (m), exposed population, and breach risk.

3. **🌊 GEE Hydrodynamic Storm Surge & Sentinel-1 Engine**:
   - Simulates astronomical spring high tides, climate sea level rise scenarios (IPCC SSP2-4.5 / SSP5-8.5), and dynamic coastal inundation extents.

4. **🤖 Gemini 3.7 Flash Multi-Lingual Early-Warning Advisories**:
   - Automated generation of regional broadcast advisories in Bengali (বাংলা), Odia (ଓଡ଼ିଆ), Burmese (မြန်မာ), Hindi (हिंदी), and English.
   - Web Speech API integration for instant audio broadcasting (`🔊 Listen Advisory`).

5. **💸 Parametric Smart Contract & Mobile Disbursement Engine**:
   - Auto-triggers pre-landfall funds when conditions satisfy `Surge >= 2.2m OR Wind >= 130km/h`.
   - Simulates instant direct mobile wallet transfers (bKash / Nagad / UPI) with cryptographic hash transaction logging.

6. **📊 Real-time Chart.js Analytics Visualizer**:
   - Hydrodynamic surge vs. wind speed timelines and asset category vulnerability exposure breakdowns.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.9+ (optional, for backend API server)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/apac-resilience-ai-app.git
cd apac-resilience-ai-app
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Maps JavaScript API key:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** Ensure your Google Maps API Key has the **Maps JavaScript API** and **Places API** enabled in the Google Cloud Console.

---

## 💻 Running Locally

### Option A: Modern Frontend Dev Server (Vite)
Run the fast Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Full-Stack Python Server
Run the python backend with built-in API proxying for Gemini & GEE simulations:
```bash
python server.py
# or
npm run server
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📂 Project Structure

```
apac-resilience-ai-app/
├── index.html                  # Main Web Dashboard Entry Point
├── server.py                   # Python HTTP Server & Gemini/GEE API Handlers
├── package.json                # Project Dependencies & Build Scripts
├── vite.config.ts              # Vite Bundler & Alias Config
├── .env.example                # Environment Variable Template
├── .gitignore                  # Git Ignore Specifications
├── README.md                   # Project Documentation
├── css/
│   └── styles.css              # Custom APAC-Resilience Glassmorphism Stylesheet
├── js/
│   ├── app.js                  # Main Coordinator & UI Event Handlers
│   ├── mapController.js        # Leaflet & Google Maps API GIS Layer Controller
│   ├── geeEngine.js            # GEE Hydrodynamic Surge & SAR Satellite Engine
│   ├── advisoryGenerator.js    # Gemini 3.7 Flash AI Multi-Lingual Advisory Generator
│   ├── parametricEngine.js     # Parametric Trigger & Mobile Money Payout Simulator
│   └── analyticsEngine.js      # Telemetry Visualizer & Chart.js Config
└── src/
    └── components/
        └── GoogleMapComponent.tsx # Standalone React Google Maps Component
```

---

## 🌐 Deployment Guidelines

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repository into **Vercel**.
3. Under **Environment Variables**, add:
   - `VITE_GOOGLE_MAPS_API_KEY` = `your_google_maps_api_key`
   - `GEMINI_API_KEY` = `your_gemini_api_key`
4. Click **Deploy**. Vercel will automatically build and publish your app.

### Deploying to Netlify
1. Connect your GitHub repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add environment variables under **Site Settings > Environment Variables**.
5. Click **Deploy Site**.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
