# MetroPortal Backend

🚇 Backend API for MetroPortal AR Metro Train Arrival Tracker

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/metro/stations` | Get all stations |
| GET | `/api/v1/metro/stations?line=BL` | Filter by line |
| GET | `/api/v1/metro/lines` | Get all metro lines |
| GET | `/api/v1/metro/arrivals/:stationId` | Get train arrivals |
| GET | `/api/v1/metro/station/:stationId` | Get station details |
| GET | `/api/v1/metro/cache/stats` | Cache statistics |

## Example Response

```json
GET /api/v1/metro/arrivals/YL16

{
  "success": true,
  "data": {
    "station": "Rajiv Chowk",
    "stationId": "YL16",
    "line": "YL",
    "trains": [
      {
        "trainNumber": "YL-453",
        "direction": "HUDA City Centre",
        "arrivalTime": 135,
        "platform": 1,
        "status": "ON_TIME"
      }
    ],
    "lastUpdated": "2025-12-11T16:00:00Z"
  }
}
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `DMRC_API_KEY` - Delhi Metro API key
- `DMRC_API_ENDPOINT` - DMRC API base URL
- `CACHE_TTL` - Cache time-to-live in seconds

## Docker Deployment

```bash
docker build -t metroportal-backend .
docker run -p 3000:3000 --env-file .env metroportal-backend
```
