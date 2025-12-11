/**
 * MetroPortal - Metro Routes
 * API route definitions for metro endpoints
 */

import { Router } from 'express';
import {
    getStations,
    getLines,
    getArrivals,
    getStationDetails,
    getCacheStats
} from '../controllers/metroController.js';

const router = Router();

// =============================================================================
// METRO API ROUTES
// =============================================================================

/**
 * @route   GET /api/v1/metro/stations
 * @desc    Get all metro stations
 * @query   line - Optional line code to filter (e.g., 'BL', 'YL', 'RD')
 * @access  Public
 */
router.get('/stations', getStations);

/**
 * @route   GET /api/v1/metro/lines
 * @desc    Get all metro lines with color codes
 * @access  Public
 */
router.get('/lines', getLines);

/**
 * @route   GET /api/v1/metro/arrivals/:stationId
 * @desc    Get real-time train arrivals for a station
 * @param   stationId - Station ID (e.g., 'YL16' for Rajiv Chowk)
 * @access  Public
 */
router.get('/arrivals/:stationId', getArrivals);

/**
 * @route   GET /api/v1/metro/station/:stationId
 * @desc    Get detailed info for a specific station
 * @param   stationId - Station ID
 * @access  Public
 */
router.get('/station/:stationId', getStationDetails);

/**
 * @route   GET /api/v1/metro/cache/stats
 * @desc    Get cache statistics (debug endpoint)
 * @access  Public
 */
router.get('/cache/stats', getCacheStats);

export default router;
