/**
 * Metro API Service
 * Communicates with GTFS backend for station and schedule data
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Get all metro stations
 */
export async function getAllStations() {
    const response = await api.get('/api/stations');
    return response.data;
}

/**
 * Find nearest stations by GPS coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export async function getNearestStations(lat, lon) {
    const response = await api.get('/api/stations/nearest', {
        params: { lat, lon }
    });
    return response.data;
}

/**
 * Get train schedule for a specific station
 * @param {string} stationId - Station ID
 */
export async function getStationSchedule(stationId) {
    const response = await api.get(`/api/station/${stationId}/schedule`);
    return response.data;
}

export default {
    getAllStations,
    getNearestStations,
    getStationSchedule
};
