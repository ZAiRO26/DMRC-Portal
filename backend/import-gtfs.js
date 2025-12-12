/**
 * GTFS Data Import Script
 * Imports GTFS text files into SQLite database
 * 
 * Usage: node import-gtfs.js
 * 
 * Place your GTFS files in the ./gtfs folder:
 * - stops.txt
 * - routes.txt
 * - trips.txt
 * - stop_times.txt
 * - calendar.txt
 */

import { importGtfs } from 'gtfs';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runImport() {
    console.log('===============================================');
    console.log('  MetroPortal GTFS Import');
    console.log('===============================================\n');

    try {
        // Load config
        const configPath = path.join(__dirname, 'gtfs-config.json');
        const config = JSON.parse(readFileSync(configPath, 'utf8'));

        console.log('📁 Config loaded from:', configPath);
        console.log('📂 GTFS Path:', config.agencies[0].path);
        console.log('🗄️  Database:', config.sqlitePath);
        console.log('\n⏳ Starting import...\n');

        // Import GTFS data
        await importGtfs(config);

        console.log('\n✅ GTFS import completed successfully!');
        console.log('📊 Database created at:', path.resolve(__dirname, config.sqlitePath));
        console.log('\nYou can now start the server with: npm run dev');

    } catch (error) {
        console.error('\n❌ Import failed:', error.message);
        console.error('\nMake sure your GTFS files are in the ./gtfs folder:');
        console.error('  - stops.txt');
        console.error('  - routes.txt');
        console.error('  - trips.txt');
        console.error('  - stop_times.txt');
        console.error('  - calendar.txt');
        process.exit(1);
    }
}

runImport();
