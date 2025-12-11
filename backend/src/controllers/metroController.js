/**
 * MetroPortal - Metro Controller
 * Handles HTTP request/response for metro endpoints
 */

import dmrcAPI from '../services/dmrcAPI.js';
import cacheService from '../services/cacheService.js';

/**
 * GET /api/v1/metro/stations
 * Get all metro stations, optionally filtered by line
 */
export async function getStations(req, res) {
    try {
        const { line } = req.query;
        const stations = dmrcAPI.getAllStations(line || null);

        res.json({
            success: true,
            count: stations.length,
            data: stations
        });
    } catch (error) {
        console.error('[Controller] getStations error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch stations',
            message: error.message
        });
    }
}

/**
 * GET /api/v1/metro/lines
 * Get all metro lines
 */
export async function getLines(req, res) {
    try {
        const lines = dmrcAPI.getAllLines();

        res.json({
            success: true,
            count: lines.length,
            data: lines
        });
    } catch (error) {
        console.error('[Controller] getLines error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lines',
            message: error.message
        });
    }
}

/**
 * GET /api/v1/metro/arrivals/:stationId
 * Get real-time train arrivals for a station
 */
export async function getArrivals(req, res) {
    try {
        const { stationId } = req.params;

        if (!stationId) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Station ID is required'
            });
        }

        const arrivals = await dmrcAPI.fetchTrainArrivals(stationId);

        res.json({
            success: true,
            data: arrivals
        });
    } catch (error) {
        console.error('[Controller] getArrivals error:', error);

        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to fetch arrivals',
            message: error.message
        });
    }
}

/**
 * GET /api/v1/metro/station/:stationId
 * Get details for a specific station
 */
export async function getStationDetails(req, res) {
    try {
        const { stationId } = req.params;

        if (!stationId) {
            return res.status(400).json({
                success: false,
                error: 'Bad Request',
                message: 'Station ID is required'
            });
        }

        const station = dmrcAPI.getStationById(stationId);

        if (!station) {
            return res.status(404).json({
                success: false,
                error: 'Not Found',
                message: `Station ${stationId} not found`
            });
        }

        // Get line info
        const lines = dmrcAPI.getAllLines();
        const lineInfo = lines.find(l => l.code === station.line);

        res.json({
            success: true,
            data: {
                ...station,
                lineInfo
            }
        });
    } catch (error) {
        console.error('[Controller] getStationDetails error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch station details',
            message: error.message
        });
    }
}

/**
 * GET /api/v1/metro/cache/stats
 * Get cache statistics (for debugging)
 */
export async function getCacheStats(req, res) {
    try {
        const stats = cacheService.getStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('[Controller] getCacheStats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get cache stats',
            message: error.message
        });
    }
}

export default {
    getStations,
    getLines,
    getArrivals,
    getStationDetails,
    getCacheStats
};
