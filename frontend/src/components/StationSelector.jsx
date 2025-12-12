/**
 * StationSelector Component
 * GPS-based or manual station selection
 */

import { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Loader2, Train } from 'lucide-react';
import { getAllStations, getNearestStations } from '../services/metroApi';

export default function StationSelector({ onStationSelect }) {
    const [stations, setStations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStations, setFilteredStations] = useState([]);
    const [isLocating, setIsLocating] = useState(false);
    const [nearestStations, setNearestStations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState(null);

    // Load all stations on mount
    useEffect(() => {
        loadStations();
    }, []);

    // Filter stations based on search query
    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = stations.filter(station =>
                station.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredStations(filtered.slice(0, 8));
            setShowDropdown(true);
        } else {
            setFilteredStations([]);
            setShowDropdown(false);
        }
    }, [searchQuery, stations]);

    async function loadStations() {
        try {
            const data = await getAllStations();
            if (data.success) {
                setStations(data.stations);
            }
        } catch (err) {
            console.error('Failed to load stations:', err);
            setError('Failed to load stations');
        }
    }

    async function handleFindNearest() {
        setIsLocating(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation not supported by your browser');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const data = await getNearestStations(latitude, longitude);
                    if (data.success) {
                        setNearestStations(data.stations);
                        // Auto-select the nearest one
                        if (data.stations.length > 0) {
                            onStationSelect(data.stations[0]);
                        }
                    }
                } catch (err) {
                    setError('Failed to find nearby stations');
                } finally {
                    setIsLocating(false);
                }
            },
            (err) => {
                setError('Location access denied');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }

    function handleStationClick(station) {
        setSearchQuery(station.name);
        setShowDropdown(false);
        onStationSelect(station);
    }

    return (
        <div className="station-selector">
            <div className="selector-header">
                <Train className="header-icon" size={32} />
                <h1>MetroPortal</h1>
                <p>Delhi Metro AR Experience</p>
            </div>

            {/* GPS Button */}
            <button
                className="gps-button"
                onClick={handleFindNearest}
                disabled={isLocating}
            >
                {isLocating ? (
                    <>
                        <Loader2 className="spin" size={20} />
                        <span>Finding your location...</span>
                    </>
                ) : (
                    <>
                        <Navigation size={20} />
                        <span>Find Nearest Station</span>
                    </>
                )}
            </button>

            {/* Divider */}
            <div className="divider">
                <span>or search manually</span>
            </div>

            {/* Search Box */}
            <div className="search-container">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search station..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                />

                {/* Dropdown */}
                {showDropdown && filteredStations.length > 0 && (
                    <div className="dropdown">
                        {filteredStations.map(station => (
                            <div
                                key={station.id}
                                className="dropdown-item"
                                onClick={() => handleStationClick(station)}
                            >
                                <MapPin size={16} />
                                <span>{station.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Nearest Stations List */}
            {nearestStations.length > 0 && (
                <div className="nearest-list">
                    <h3>Nearby Stations</h3>
                    {nearestStations.map(station => (
                        <div
                            key={station.id}
                            className="nearest-item"
                            onClick={() => handleStationClick(station)}
                        >
                            <MapPin size={18} />
                            <div className="station-info">
                                <span className="station-name">{station.name}</span>
                                <span className="station-distance">
                                    {station.distance.toFixed(2)} km away
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
}
