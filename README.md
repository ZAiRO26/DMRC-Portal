# MetroPortal - AR Metro Train Arrival Tracker

🚇 An immersive AR web application for tracking Delhi Metro train arrivals in real-time

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Tech Stack](https://img.shields.io/badge/Unity-WebGL-000000?logo=unity)

## Quick Start

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
Server runs at `http://localhost:3000`

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`

## Project Structure

```
metro-portal/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express API
└── unity-project/     # Unity WebGL scripts
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/metro/stations` | All Delhi Metro stations |
| `GET /api/v1/metro/lines` | Metro lines with colors |
| `GET /api/v1/metro/arrivals/:id` | Train arrivals for station |

## Features

- 🎯 **116 Delhi Metro Stations** across all lines
- ⏱️ **Real-time Countdown** with color transitions
- 📱 **Mobile-first** responsive design
- 🎮 **Unity WebGL** 3D portal visualization
- 📷 **AR Camera** overlay support

## Unity Setup

See [unity-project/README.md](unity-project/README.md) for scene setup instructions.

## License

MIT
