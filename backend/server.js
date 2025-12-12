/**
 * MetroPortal - GTFS Backend Server
 * Serves train schedule data from local SQLite database
 */

import express from 'express';
import cors from 'cors';
import moment from 'moment';
import { openDb, getStops, getRoutes, getTrips, getStoptimes, getCalendars } from 'gtfs';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load GTFS config and open database
const configPath = path.join(__dirname, 'gtfs-config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const db = openDb(config);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Get current day of week for GTFS calendar (monday, tuesday, etc.)
 */
function getCurrentDayField() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[moment().day()];
}

/**
 * Convert GTFS time (HH:MM:SS) to seconds since midnight
 */
function timeToSeconds(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

/**
 * Get current time as seconds since midnight
 */
function getCurrentTimeSeconds() {
    const now = moment();
    return now.hours() * 3600 + now.minutes() * 60 + now.seconds();
}

// =============================================================================
// API ENDPOINTS
// =============================================================================

/**
 * GET /api/stations
 * Returns all stations from the GTFS database
 */
app.get('/api/stations', async (req, res) => {
    try {
        const stops = getStops();
        const stations = stops.map(stop => ({
            id: stop.stop_id,
            name: stop.stop_name,
            lat: stop.stop_lat,
            lon: stop.stop_lon
        }));
        res.json({ success: true, stations });
    } catch (error) {
        console.error('[API] Error fetching stations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stations' });
    }
});

/**
 * GET /api/stations/nearest
 * Find the 5 closest stations to given GPS coordinates
 * Query params: lat, lon
 */
app.get('/api/stations/nearest', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Missing lat and lon query parameters'
            });
        }

        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);

        const stops = getStops();

        // Calculate distance for each stop
        const stopsWithDistance = stops.map(stop => ({
            id: stop.stop_id,
            name: stop.stop_name,
            lat: stop.stop_lat,
            lon: stop.stop_lon,
            distance: calculateDistance(userLat, userLon, stop.stop_lat, stop.stop_lon)
        }));

        // Sort by distance and take top 5
        stopsWithDistance.sort((a, b) => a.distance - b.distance);
        const nearest = stopsWithDistance.slice(0, 5);

        res.json({
            success: true,
            userLocation: { lat: userLat, lon: userLon },
            stations: nearest
        });

    } catch (error) {
        console.error('[API] Error finding nearest stations:', error);
        res.status(500).json({ success: false, error: 'Failed to find nearest stations' });
    }
});

/**
 * GET /api/station/:stationId/schedule
 * Get upcoming train schedule for a specific station
 * Returns arrivals grouped by line and direction
 */
app.get('/api/station/:stationId/schedule', async (req, res) => {
    try {
        const { stationId } = req.params;
        const currentDay = getCurrentDayField();
        const currentTimeSeconds = getCurrentTimeSeconds();
        const twoHoursLater = currentTimeSeconds + 7200; // 2 hours in seconds

        // Get station info
        const stops = getStops({ stop_id: stationId });
        if (stops.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Station not found: ${stationId}`
            });
        }
        const station = stops[0];

        // Get all stop_times for this station
        const stopTimes = getStoptimes({ stop_id: stationId });

        // Get active calendars for today
        const today = moment().format('YYYYMMDD');
        const calendars = getCalendars();
        const activeServiceIds = calendars
            .filter(cal => {
                const isActiveDay = cal[currentDay] === 1;
                const isInRange = cal.start_date <= today && cal.end_date >= today;
                return isActiveDay && isInRange;
            })
            .map(cal => cal.service_id);

        // Get all trips
        const allTrips = getTrips();
        const tripMap = new Map(allTrips.map(t => [t.trip_id, t]));

        // Get all routes
        const allRoutes = getRoutes();
        const routeMap = new Map(allRoutes.map(r => [r.route_id, r]));

        // Filter and process stop times
        const upcomingArrivals = [];

        for (const st of stopTimes) {
            const arrivalSeconds = timeToSeconds(st.arrival_time);

            // Check if arrival is in the future (next 2 hours)
            if (arrivalSeconds < currentTimeSeconds || arrivalSeconds > twoHoursLater) {
                continue;
            }

            const trip = tripMap.get(st.trip_id);
            if (!trip) continue;

            // Check if this trip runs today
            if (!activeServiceIds.includes(trip.service_id)) {
                continue;
            }

            const route = routeMap.get(trip.route_id);
            if (!route) continue;

            const countdownSeconds = arrivalSeconds - currentTimeSeconds;

            upcomingArrivals.push({
                time: st.arrival_time,
                countdownSeconds: countdownSeconds,
                trainId: `${route.route_short_name || route.route_id}-${st.trip_id.slice(-3)}`,
                routeId: route.route_id,
                routeName: route.route_long_name || route.route_short_name || 'Unknown Line',
                routeColor: route.route_color ? `#${route.route_color}` : '#0066CC',
                direction: trip.trip_headsign || 'Unknown',
                tripId: trip.trip_id
            });
        }

        // Sort by countdown
        upcomingArrivals.sort((a, b) => a.countdownSeconds - b.countdownSeconds);

        // Group by route and direction
        const groupedByLine = {};
        for (const arrival of upcomingArrivals) {
            const key = `${arrival.routeId}_${arrival.direction}`;
            if (!groupedByLine[key]) {
                groupedByLine[key] = {
                    lineName: arrival.routeName,
                    lineColor: arrival.routeColor,
                    direction: arrival.direction,
                    nextArrivals: []
                };
            }
            // Limit to 5 arrivals per line/direction
            if (groupedByLine[key].nextArrivals.length < 5) {
                groupedByLine[key].nextArrivals.push({
                    time: arrival.time,
                    countdownSeconds: arrival.countdownSeconds,
                    trainId: arrival.trainId
                });
            }
        }

        const lines = Object.values(groupedByLine);

        res.json({
            success: true,
            stationId: station.stop_id,
            stationName: station.stop_name,
            currentTime: moment().format('HH:mm:ss'),
            lines: lines
        });

    } catch (error) {
        console.error('[API] Error fetching schedule:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
    console.log('===============================================');
    console.log('  MetroPortal GTFS Server');
    console.log('===============================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${config.sqlitePath}`);
    console.log('\nEndpoints:');
    console.log(`  GET /api/stations`);
    console.log(`  GET /api/stations/nearest?lat=28.6&lon=77.2`);
    console.log(`  GET /api/station/:stationId/schedule`);
    console.log(`  GET /api/health`);
    console.log('===============================================\n');
});

export default app;
