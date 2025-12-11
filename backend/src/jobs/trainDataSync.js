/**
 * MetroPortal - Train Data Sync Job
 * Cron job to periodically sync train arrival data from DMRC API
 */

import cron from 'node-cron';
import { syncAllArrivals } from '../services/dmrcAPI.js';
import cacheService from '../services/cacheService.js';

let syncJob = null;
let cleanupJob = null;

/**
 * Start the train data synchronization cron job
 * Runs every 30 seconds to fetch latest arrival data
 */
export function startTrainDataSync() {
    console.log('[Cron] Starting train data sync job...');

    // Sync job - runs every 30 seconds
    syncJob = cron.schedule('*/30 * * * * *', async () => {
        const timestamp = new Date().toISOString();
        console.log(`[Cron] Running sync job at ${timestamp}`);

        try {
            await syncAllArrivals();
        } catch (error) {
            console.error('[Cron] Sync job error:', error.message);
        }
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    });

    // Cleanup job - runs every 5 minutes to remove expired cache entries
    cleanupJob = cron.schedule('*/5 * * * *', () => {
        console.log('[Cron] Running cache cleanup...');
        cacheService.cleanup();
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    });

    console.log('[Cron] ✅ Train data sync job started (every 30s)');
    console.log('[Cron] ✅ Cache cleanup job started (every 5min)');

    // Run initial sync immediately
    setTimeout(async () => {
        console.log('[Cron] Running initial sync...');
        try {
            await syncAllArrivals();
        } catch (error) {
            console.error('[Cron] Initial sync error:', error.message);
        }
    }, 2000);
}

/**
 * Stop the train data synchronization cron job
 */
export function stopTrainDataSync() {
    if (syncJob) {
        syncJob.stop();
        console.log('[Cron] Train data sync job stopped');
    }
    if (cleanupJob) {
        cleanupJob.stop();
        console.log('[Cron] Cache cleanup job stopped');
    }
}

/**
 * Get status of the cron jobs
 * @returns {object} Status information
 */
export function getSyncStatus() {
    return {
        syncJob: syncJob ? 'running' : 'stopped',
        cleanupJob: cleanupJob ? 'running' : 'stopped',
        cacheStats: cacheService.getStats()
    };
}

export default {
    startTrainDataSync,
    stopTrainDataSync,
    getSyncStatus
};
