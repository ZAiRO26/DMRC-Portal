/**
 * ScheduleBoard Component
 * Displays train schedule with countdown timers
 */

import { useState, useEffect } from 'react';
import { Clock, ChevronRight, ArrowLeft, Eye, Train } from 'lucide-react';
import { getStationSchedule } from '../services/metroApi';

export default function ScheduleBoard({ station, onViewAR, onBack }) {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrain, setSelectedTrain] = useState(null);

    useEffect(() => {
        if (station) {
            loadSchedule();
            // Refresh every 30 seconds
            const interval = setInterval(loadSchedule, 30000);
            return () => clearInterval(interval);
        }
    }, [station]);

    async function loadSchedule() {
        try {
            setLoading(true);
            const data = await getStationSchedule(station.id);
            if (data.success) {
                setSchedule(data);
                setError(null);
            } else {
                setError(data.error || 'Failed to load schedule');
            }
        } catch (err) {
            console.error('Schedule load error:', err);
            setError('Failed to load schedule');
        } finally {
            setLoading(false);
        }
    }

    function formatCountdown(seconds) {
        if (seconds < 60) return 'Arriving';
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins} min`;
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hrs}h ${remainingMins}m`;
    }

    function handleViewAR(train, line) {
        setSelectedTrain({ ...train, line });
        onViewAR({ ...train, line });
    }

    if (loading && !schedule) {
        return (
            <div className="schedule-board loading">
                <div className="loader-container">
                    <Train className="spin" size={40} />
                    <p>Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="schedule-board">
            {/* Header */}
            <div className="board-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <div className="station-title">
                    <h2>{schedule?.stationName || station.name}</h2>
                    <span className="current-time">
                        <Clock size={14} />
                        {schedule?.currentTime || '--:--'}
                    </span>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={loadSchedule}>Retry</button>
                </div>
            )}

            {/* Train Lines */}
            <div className="lines-container">
                {schedule?.lines?.length > 0 ? (
                    schedule.lines.map((line, idx) => (
                        <div key={idx} className="line-card">
                            <div
                                className="line-header"
                                style={{ backgroundColor: line.lineColor }}
                            >
                                <span className="line-name">{line.lineName}</span>
                                <ChevronRight size={16} />
                                <span className="direction">{line.direction}</span>
                            </div>

                            <div className="arrivals-list">
                                {line.nextArrivals.map((arrival, arrIdx) => (
                                    <div key={arrIdx} className="arrival-item">
                                        <div className="arrival-info">
                                            <span className="train-id">{arrival.trainId}</span>
                                            <span className="arrival-time">{arrival.time}</span>
                                        </div>
                                        <div className="arrival-actions">
                                            <span
                                                className={`countdown ${arrival.countdownSeconds < 120 ? 'urgent' : ''}`}
                                            >
                                                {formatCountdown(arrival.countdownSeconds)}
                                            </span>
                                            <button
                                                className="ar-button"
                                                onClick={() => handleViewAR(arrival, line)}
                                            >
                                                <Eye size={16} />
                                                AR
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-trains">
                        <Train size={48} />
                        <p>No upcoming trains in the next 2 hours</p>
                    </div>
                )}
            </div>
        </div>
    );
}
