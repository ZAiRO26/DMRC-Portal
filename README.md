# MetroPortal - Delhi Metro AR Train Tracker

A Progressive Web App (PWA) that displays real-time Delhi Metro train schedules with an immersive AR visualization experience.

![MetroPortal](./docs/screenshot.png)

## 🚀 Features

- **GPS Station Finder** - Automatically find nearest metro stations
- **Real-time Schedules** - View upcoming trains with countdown timers
- **AR Experience** - Immersive Unity WebGL visualization
- **Offline Support** - Works offline with cached data
- **PWA** - Install on mobile as a native-like app

## 📁 Project Structure

```
Metro-Del/
├── backend/           # Node.js GTFS API server
│   ├── gtfs/         # GTFS data files
│   ├── server.js     # Express API server
│   └── import-gtfs.js # Data import script
├── frontend/          # React PWA
│   ├── src/
│   │   ├── components/
│   │   │   ├── StationSelector.jsx
│   │   │   ├── ScheduleBoard.jsx
│   │   │   └── ARView.jsx
│   │   └── App.jsx
│   └── public/
│       ├── unity-build/  # Unity WebGL build
│       └── manifest.json
└── unity-project/     # Unity AR project
    └── Assets/Scripts/
        ├── GameManager.cs
        └── PortalController.cs
```

## 🛠️ Setup

### Prerequisites
- Node.js 20+
- Unity 2022.3 LTS (for AR features)

### Backend Setup
```bash
cd backend
npm install
npm run import    # Import GTFS data
npm run dev       # Start server on :3000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Start on :4200
```

### Unity WebGL Build
1. Open `unity-project/` in Unity 2022.3
2. Build for WebGL platform
3. Copy build to `frontend/public/unity-build/`

## 🔌 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/stations` | List all stations |
| `GET /api/stations/nearest?lat=&lon=` | Find nearby stations |
| `GET /api/station/:id/schedule` | Get train schedule |

## 📱 PWA Installation

1. Open the app in Chrome/Safari
2. Click "Add to Home Screen"
3. Access like a native app

## 🎮 Unity Integration

The React app communicates with Unity via:
```javascript
sendMessage('GameManager', 'SetTrainData', JSON.stringify({
  countdownSeconds: 120,
  lineColor: '#0066FF',
  trainId: 'R_RD_R-434',
  direction: 'Rithala'
}));
```

## 📦 Deployment

### Backend (Railway/Render)
```bash
cd backend
# Deploy with Dockerfile
```

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

## 📄 License

MIT License

## 👨‍💻 Author

ZAiRO26
