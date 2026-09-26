# H2Safe – AI-Powered Passive H₂S Exposure Monitoring System

> **Prototype / Research Demonstration Notice:**
> Exposure values shown by this application are estimates generated from colorimetric computer vision image analysis and calibration regression modeling. This prototype is not a certified real-world gas detector, medical device, or replacement for approved industrial H₂S monitoring and safety procedures.

---

## 📌 Project Overview

**H2Safe** is the software and computer-vision component of a wearable passive H₂S exposure-monitoring wristband system designed for industrial safety (e.g., petrochemical refineries, gas processing plants, sewage facilities).

### Chemical & Optical Mechanism
1. **Passive Gas Permeation:** The physical wristband contains a copper-based colorimetric sensing strip protected by a gas-permeable microporous PTFE membrane (0.2 µm pore size).
2. **Colorimetric Chemical Reaction:** When exposed to H₂S gas, the copper strip progressively darkens due to the formation of copper sulfide ($\text{Cu} + \text{H}_2\text{S} \rightarrow \text{CuS} + \text{H}_2$).
3. **Computer Vision & CIE Lab Analysis:** Using a smartphone camera under a guided frame overlay, the web app crops the Region of Interest (ROI), extracts 4 corner reference color patches to normalize white-balance, converts RGB values to CIE Lab space, and calculates the CIE76 $\Delta E$ color difference.
4. **AI/ML Regression & Cumulative Dosage:** A scikit-learn regression model maps $\Delta E$ to estimated H₂S exposure concentration (ppm) and tracks cumulative dosage in $\text{ppm}\cdot\text{hr}$ over time.

---

## 🏗 System Architecture & Technology Stack

### Frontend Stack
- **Framework:** React 18 + Vite 5 + TypeScript
- **Styling:** Tailwind CSS + custom glassmorphism & industrial safety UI design system
- **Icons:** Lucide React icons
- **Charts:** Recharts (Cumulative exposure timeline, concentration trends, risk distribution, monitored vs unmonitored comparison)
- **Routing:** React Router DOM (13 dedicated pages)

### Backend Stack
- **API Framework:** Python FastAPI + Uvicorn REST API
- **Computer Vision:** OpenCV (`cv2`), NumPy, CIE Lab color conversion
- **Machine Learning:** scikit-learn (Linear Regression, Random Forest, Gradient Boosting)
- **Database:** SQLAlchemy ORM + SQLite (`h2safe.db`)

---

## 🚀 Directory Structure

```
h2safe/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, RiskBadge, HowToScanModal, DemoDataTag
│   │   ├── pages/            # 13 Application Pages
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ScannerPage.tsx
│   │   │   ├── ScanResultPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── WristbandPage.tsx
│   │   │   ├── CalibrationPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   ├── WorkerProfilePage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── services/         # API Service & offline simulated fallback
│   │   ├── types/            # TypeScript data contracts
│   │   └── utils/            # Colorimetry & Delta E helper calculations
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/              # REST API endpoints
│   │   ├── cv/               # OpenCV processing pipeline & ROI detection
│   │   ├── ml/               # scikit-learn regression calibration engine
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── database/         # SQLite database session & engine
│   │   └── main.py           # FastAPI application entry point & demo seeding
│   └── requirements.txt
├── data/                     # SQLite database storage & calibration data
└── README.md
```

---

## 💻 How to Run Locally

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Run Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic opencv-python-headless numpy scikit-learn sqlalchemy python-multipart
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- API Documentation: `http://localhost:8000/docs`

### 3. Run Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
- Web Application URL: `http://localhost:5173`

---

## 📷 Scanner & Demo Features

1. **Live Camera Scanner:** Open `/scan` to request browser media permissions. Align the wristband inside the guide frame.
2. **Live Quality Indicators:** Evaluates lighting brightness, Laplacian focus sharpness, ROI detection, and reference patch alignment.
3. **Simulated Demo Mode:** Click **Simulate LOW Exposure**, **Simulate MEDIUM Exposure**, or **Simulate HIGH Exposure** on the Scanner page to test the entire CV $\rightarrow$ CIE Lab $\rightarrow$ ML Regression $\rightarrow$ Result workflow instantly without physical hardware.
4. **Camera Test Mode:** Open `/settings` to inspect real-time frame samplers, adjust camera brightness/contrast, and view raw CIE Lab metrics.

---

## 🔬 Calibration & Model Training

- Navigate to `/calibration` to view reference color patch baselines ($0.0 \text{ ppm}$ to $40.0 \text{ ppm}$).
- Select between **Linear Regression**, **Random Forest**, or **Gradient Boosting** algorithms.
- Click **Train Calibration Model** to update R², MAE, and RMSE regression metrics.

---

## 🔗 Key API Endpoints

- `POST /api/auth/login` – Worker login
- `GET /api/dashboard/{worker_id}` – Dashboard metrics & exposure status
- `POST /api/analyze` – Image upload, OpenCV ROI detection, CIE Lab $\Delta E$, and ML prediction
- `GET /api/readings/{worker_id}` – Historical sensor scan log
- `GET /api/analytics/{worker_id}` – Recharts time-series data
- `GET /api/wristbands/{worker_id}` – Hardware pairing & cartridge status
- `POST /api/cartridges/replace` – Register new cartridge replacement
- `GET /api/calibration` – Calibration model info & reference patches
- `POST /api/calibration/train` – Re-train ML regression model
- `GET /api/alerts/{worker_id}` – Safety notification logs
- `POST /api/alerts/{alert_id}/acknowledge` – Mark alert as acknowledged

---

## ⚖ Safety & Legal Disclaimer

*H2Safe is developed as a research and prototype demonstration for Smart India Hackathon. It does not replace certified industrial personal gas detectors (e.g., electrochemical single-gas detectors) or official OSHA/NIOSH workplace compliance devices.*
