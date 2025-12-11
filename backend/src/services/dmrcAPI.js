/**
 * MetroPortal - DMRC API Integration Service
 * Uses VehiclePositions.pb to get real-time train locations
 * Estimates arrival times based on distance and average speed
 */

import axios from 'axios';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import cacheService from './cacheService.js';

// DMRC API Configuration - Using VehiclePositions endpoint
const DMRC_API_ENDPOINT = process.env.DMRC_API_ENDPOINT || 'https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb';
const DMRC_API_KEY = process.env.DMRC_API_KEY;

// Average metro speed (km/h) for estimation
const AVERAGE_SPEED_KMH = 35;

// =============================================================================
// DELHI METRO STATION DATA WITH COORDINATES
// =============================================================================

const METRO_LINES = [
    { code: 'RD', name: 'Red Line', color: '#EE3124', terminals: ['Rithala', 'Shaheed Sthal'] },
    { code: 'YL', name: 'Yellow Line', color: '#FFCC00', terminals: ['Samaypur Badli', 'HUDA City Centre'] },
    { code: 'BL', name: 'Blue Line', color: '#0066CC', terminals: ['Dwarka Sec-21', 'Noida Electronic City/Vaishali'] },
    { code: 'GR', name: 'Green Line', color: '#00A650', terminals: ['Kirti Nagar/Inderlok', 'Brigadier Hoshiar Singh'] },
    { code: 'VL', name: 'Violet Line', color: '#9400D3', terminals: ['Kashmere Gate', 'Raja Nahar Singh'] },
    { code: 'PK', name: 'Pink Line', color: '#FF69B4', terminals: ['Majlis Park', 'Shiv Vihar'] },
    { code: 'MG', name: 'Magenta Line', color: '#CC0066', terminals: ['Botanical Garden', 'Janakpuri West'] },
    { code: 'GY', name: 'Grey Line', color: '#808080', terminals: ['Dwarka', 'Najafgarh'] },
    { code: 'OR', name: 'Orange Line (Airport)', color: '#FF6600', terminals: ['New Delhi', 'Dwarka Sec-21'] },
    { code: 'AQ', name: 'Aqua Line', color: '#00BFFF', terminals: ['Noida Sec-51', 'Noida Sec-142'] }
];

// Stations with approximate GPS coordinates for distance calculation
const METRO_STATIONS = [
    // Yellow Line Stations (with coordinates)
    { id: 'YL01', name: 'Samaypur Badli', line: 'YL', lat: 28.7436, lng: 77.1365, interchange: false },
    { id: 'YL02', name: 'Rohini Sector 18-19', line: 'YL', lat: 28.7391, lng: 77.1390, interchange: false },
    { id: 'YL03', name: 'Haiderpur Badli Mor', line: 'YL', lat: 28.7270, lng: 77.1540, interchange: false },
    { id: 'YL04', name: 'Jahangirpuri', line: 'YL', lat: 28.7254, lng: 77.1628, interchange: false },
    { id: 'YL05', name: 'Adarsh Nagar', line: 'YL', lat: 28.7167, lng: 77.1700, interchange: false },
    { id: 'YL06', name: 'Azadpur', line: 'YL', lat: 28.7073, lng: 77.1779, interchange: true },
    { id: 'YL07', name: 'Model Town', line: 'YL', lat: 28.6997, lng: 77.1897, interchange: false },
    { id: 'YL08', name: 'GTB Nagar', line: 'YL', lat: 28.6956, lng: 77.2010, interchange: false },
    { id: 'YL09', name: 'Vishwa Vidyalaya', line: 'YL', lat: 28.6880, lng: 77.2100, interchange: false },
    { id: 'YL10', name: 'Vidhan Sabha', line: 'YL', lat: 28.6814, lng: 77.2202, interchange: false },
    { id: 'YL11', name: 'Civil Lines', line: 'YL', lat: 28.6756, lng: 77.2254, interchange: false },
    { id: 'YL12', name: 'Kashmere Gate', line: 'YL', lat: 28.6675, lng: 77.2282, interchange: true },
    { id: 'YL13', name: 'Chandni Chowk', line: 'YL', lat: 28.6566, lng: 77.2307, interchange: false },
    { id: 'YL14', name: 'Chawri Bazar', line: 'YL', lat: 28.6501, lng: 77.2256, interchange: false },
    { id: 'YL15', name: 'New Delhi', line: 'YL', lat: 28.6428, lng: 77.2195, interchange: true },
    { id: 'YL16', name: 'Rajiv Chowk', line: 'YL', lat: 28.6328, lng: 77.2197, interchange: true },
    { id: 'YL17', name: 'Patel Chowk', line: 'YL', lat: 28.6227, lng: 77.2145, interchange: false },
    { id: 'YL18', name: 'Central Secretariat', line: 'YL', lat: 28.6149, lng: 77.2115, interchange: true },
    { id: 'YL19', name: 'Udyog Bhawan', line: 'YL', lat: 28.6093, lng: 77.2097, interchange: false },
    { id: 'YL20', name: 'Lok Kalyan Marg', line: 'YL', lat: 28.6010, lng: 77.2063, interchange: false },
    { id: 'YL21', name: 'Jor Bagh', line: 'YL', lat: 28.5885, lng: 77.2101, interchange: false },
    { id: 'YL22', name: 'INA', line: 'YL', lat: 28.5754, lng: 77.2100, interchange: true },
    { id: 'YL23', name: 'AIIMS', line: 'YL', lat: 28.5687, lng: 77.2082, interchange: false },
    { id: 'YL24', name: 'Green Park', line: 'YL', lat: 28.5598, lng: 77.2065, interchange: false },
    { id: 'YL25', name: 'Hauz Khas', line: 'YL', lat: 28.5433, lng: 77.2067, interchange: true },
    { id: 'YL26', name: 'Malviya Nagar', line: 'YL', lat: 28.5280, lng: 77.2065, interchange: false },
    { id: 'YL27', name: 'Saket', line: 'YL', lat: 28.5205, lng: 77.2016, interchange: false },
    { id: 'YL28', name: 'Qutab Minar', line: 'YL', lat: 28.5133, lng: 77.1854, interchange: false },
    { id: 'YL29', name: 'Chhattarpur', line: 'YL', lat: 28.5078, lng: 77.1747, interchange: false },
    { id: 'YL30', name: 'Sultanpur', line: 'YL', lat: 28.4993, lng: 77.1568, interchange: false },
    { id: 'YL31', name: 'Ghitorni', line: 'YL', lat: 28.4941, lng: 77.1482, interchange: false },
    { id: 'YL32', name: 'Arjan Garh', line: 'YL', lat: 28.4841, lng: 77.1239, interchange: false },
    { id: 'YL33', name: 'Guru Dronacharya', line: 'YL', lat: 28.4821, lng: 77.1034, interchange: false },
    { id: 'YL34', name: 'Sikanderpur', line: 'YL', lat: 28.4790, lng: 77.0934, interchange: true },
    { id: 'YL35', name: 'MG Road', line: 'YL', lat: 28.4795, lng: 77.0790, interchange: false },
    { id: 'YL36', name: 'IFFCO Chowk', line: 'YL', lat: 28.4726, lng: 77.0718, interchange: false },
    { id: 'YL37', name: 'HUDA City Centre', line: 'YL', lat: 28.4594, lng: 77.0724, interchange: false },

    // Blue Line Stations (key stations with coordinates)
    { id: 'BL01', name: 'Dwarka Sec-21', line: 'BL', lat: 28.5523, lng: 77.0583, interchange: false },
    { id: 'BL09', name: 'Dwarka', line: 'BL', lat: 28.5774, lng: 77.0634, interchange: true },
    { id: 'BL14', name: 'Janakpuri West', line: 'BL', lat: 28.6283, lng: 77.0815, interchange: true },
    { id: 'BL22', name: 'Kirti Nagar', line: 'BL', lat: 28.6538, lng: 77.1442, interchange: true },
    { id: 'BL26', name: 'Karol Bagh', line: 'BL', lat: 28.6519, lng: 77.1906, interchange: false },
    { id: 'BL29', name: 'Rajiv Chowk', line: 'BL', lat: 28.6328, lng: 77.2197, interchange: true },
    { id: 'BL31', name: 'Mandi House', line: 'BL', lat: 28.6258, lng: 77.2341, interchange: true },
    { id: 'BL34', name: 'Yamuna Bank', line: 'BL', lat: 28.6225, lng: 77.2757, interchange: true },
    { id: 'BL42', name: 'Botanical Garden', line: 'BL', lat: 28.5650, lng: 77.3340, interchange: true },
    { id: 'BL44', name: 'Noida City Centre', line: 'BL', lat: 28.5742, lng: 77.3563, interchange: false },
    { id: 'BL50', name: 'Noida Electronic City', line: 'BL', lat: 28.6290, lng: 77.3732, interchange: false },

    // Red Line Stations (key stations with coordinates)
    { id: 'RD01', name: 'Shaheed Sthal', line: 'RD', lat: 28.6717, lng: 77.4405, interchange: false },
    { id: 'RD09', name: 'Dilshad Garden', line: 'RD', lat: 28.6758, lng: 77.3194, interchange: false },
    { id: 'RD16', name: 'Kashmere Gate', line: 'RD', lat: 28.6675, lng: 77.2282, interchange: true },
    { id: 'RD21', name: 'Inderlok', line: 'RD', lat: 28.6730, lng: 77.1704, interchange: true },
    { id: 'RD29', name: 'Rithala', line: 'RD', lat: 28.7209, lng: 77.1072, interchange: false },
];

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Estimate arrival time based on distance and speed
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} speedKmh - Speed in km/h (optional, uses average if not provided)
 * @returns {number} Estimated time in seconds
 */
function estimateArrivalTime(distanceKm, speedKmh = AVERAGE_SPEED_KMH) {
    if (speedKmh <= 0) speedKmh = AVERAGE_SPEED_KMH;
    const hours = distanceKm / speedKmh;
    return Math.round(hours * 3600); // Convert to seconds
}

// Export station data functions
export function getAllLines() {
    return METRO_LINES;
}

export function getAllStations(lineCode = null) {
    if (lineCode) {
        return METRO_STATIONS.filter(station => station.line === lineCode);
    }
    return METRO_STATIONS;
}

export function getStationById(stationId) {
    return METRO_STATIONS.find(station => station.id === stationId) || null;
}

/**
 * Fetch real-time train positions and estimate arrivals
 */
export async function fetchTrainArrivals(stationId) {
    const cacheKey = `arrivals:${stationId}`;

    const cached = cacheService.get(cacheKey);
    if (cached) {
        return cached;
    }

    const station = getStationById(stationId);
    if (!station) {
        throw new Error(`Station not found: ${stationId}`);
    }

    try {
        const url = `${DMRC_API_ENDPOINT}?key=${DMRC_API_KEY}`;
        console.log(`[DMRC API] Fetching VehiclePositions from: ${DMRC_API_ENDPOINT}`);

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: { 'Accept': 'application/x-protobuf' }
        });

        // Decode Protocol Buffer
        const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
            new Uint8Array(response.data)
        );

        console.log(`[DMRC API] ✅ Decoded ${feed.entity.length} vehicles from feed`);

        // Find trains approaching this station on the same line
        const arrivals = findApproachingTrains(feed, station);

        const arrivalData = {
            station: station.name,
            stationId: station.id,
            line: station.line,
            lineColor: METRO_LINES.find(l => l.code === station.line)?.color || '#0066CC',
            trains: arrivals,
            lastUpdated: new Date().toISOString(),
            source: arrivals.length > 0 ? 'DMRC_VEHICLE_POSITIONS' : 'SIMULATED'
        };

        cacheService.set(cacheKey, arrivalData);
        console.log(`[DMRC API] Found ${arrivals.length} approaching trains for ${station.name}`);
        return arrivalData;

    } catch (error) {
        console.warn(`[DMRC API] Failed to fetch positions:`, error.message);

        // Fallback to simulated data
        const simulatedData = generateSimulatedArrivals(station);
        cacheService.set(cacheKey, simulatedData);
        return simulatedData;
    }
}

/**
 * Find trains approaching a station based on vehicle positions
 */
function findApproachingTrains(feed, targetStation) {
    const arrivals = [];
    const lineCode = targetStation.line;
    const stationLat = targetStation.lat;
    const stationLng = targetStation.lng;

    for (const entity of feed.entity) {
        if (!entity.vehicle) continue;

        const vehicle = entity.vehicle;
        const position = vehicle.position;
        const trip = vehicle.trip;

        if (!position || !position.latitude || !position.longitude) continue;

        // Get vehicle position
        const trainLat = position.latitude;
        const trainLng = position.longitude;
        const speedMps = position.speed || 0; // meters per second
        const speedKmh = speedMps * 3.6;

        // Calculate distance to target station
        const distanceKm = calculateDistance(trainLat, trainLng, stationLat, stationLng);

        // Only include trains within 15km of the station (reasonable approach distance)
        if (distanceKm <= 15) {
            // Check if this train is on the same line (try to match route)
            const routeId = trip?.routeId || '';
            const tripId = trip?.tripId || entity.id || 'Unknown';

            // Estimate arrival time
            const arrivalSeconds = estimateArrivalTime(distanceKm, speedKmh > 0 ? speedKmh : AVERAGE_SPEED_KMH);

            // Only include trains arriving within next 30 minutes
            if (arrivalSeconds < 1800) {
                const line = METRO_LINES.find(l => l.code === lineCode);
                const direction = line?.terminals[0] || 'Terminal';

                arrivals.push({
                    trainNumber: tripId.substring(0, 12),
                    direction: direction,
                    arrivalTime: arrivalSeconds,
                    platform: 1,
                    status: arrivalSeconds < 60 ? 'ARRIVING' : 'ON_TIME',
                    distanceKm: Math.round(distanceKm * 10) / 10,
                    speedKmh: Math.round(speedKmh)
                });
            }
        }
    }

    // Sort by arrival time
    arrivals.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Return up to 5 nearest trains
    return arrivals.slice(0, 5);
}

/**
 * Generate simulated arrivals as fallback
 */
function generateSimulatedArrivals(station) {
    const line = METRO_LINES.find(l => l.code === station.line);
    const terminals = line?.terminals || ['Terminal 1', 'Terminal 2'];
    const trainCount = Math.floor(Math.random() * 3) + 2;
    const trains = [];

    let baseTime = Math.floor(Math.random() * 60) + 30;

    for (let i = 0; i < trainCount; i++) {
        trains.push({
            trainNumber: `${station.line}-${String(Math.floor(Math.random() * 900) + 100)}`,
            direction: terminals[i % 2],
            arrivalTime: baseTime,
            platform: (i % 2) + 1,
            status: baseTime < 60 ? 'ARRIVING' : 'ON_TIME'
        });
        baseTime += Math.floor(Math.random() * 180) + 120;
    }

    return {
        station: station.name,
        stationId: station.id,
        line: station.line,
        lineColor: line?.color || '#0066CC',
        trains,
        lastUpdated: new Date().toISOString(),
        source: 'SIMULATED'
    };
}

export async function syncAllArrivals() {
    console.log('[DMRC API] Starting sync for all stations...');
    const popularStations = ['YL16', 'YL15', 'YL12', 'BL29', 'BL34', 'RD16'];

    for (const stationId of popularStations) {
        try {
            await fetchTrainArrivals(stationId);
        } catch (error) {
            console.error(`[DMRC API] Sync failed for ${stationId}:`, error.message);
        }
    }

    console.log('[DMRC API] Sync completed');
}

export default {
    getAllLines,
    getAllStations,
    getStationById,
    fetchTrainArrivals,
    syncAllArrivals
};
