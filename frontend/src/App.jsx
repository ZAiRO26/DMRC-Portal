/**
 * MetroPortal - Main App Component
 * PWA with station selection, schedule view, and AR experience
 */

import { useState } from 'react';
import StationSelector from './components/StationSelector';
import ScheduleBoard from './components/ScheduleBoard';
import ARView from './components/ARView';
import './App.css';

export default function App() {
  // App state: 'select' | 'schedule' | 'ar'
  const [view, setView] = useState('select');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);

  function handleStationSelect(station) {
    setSelectedStation(station);
    setView('schedule');
  }

  function handleViewAR(trainData) {
    setSelectedTrain(trainData);
    setView('ar');
  }

  function handleBackToSelect() {
    setSelectedStation(null);
    setView('select');
  }

  function handleBackToSchedule() {
    setSelectedTrain(null);
    setView('schedule');
  }

  return (
    <div className="app">
      {view === 'select' && (
        <StationSelector onStationSelect={handleStationSelect} />
      )}

      {view === 'schedule' && selectedStation && (
        <ScheduleBoard
          station={selectedStation}
          onViewAR={handleViewAR}
          onBack={handleBackToSelect}
        />
      )}

      {view === 'ar' && selectedTrain && (
        <ARView
          trainData={selectedTrain}
          onBack={handleBackToSchedule}
        />
      )}
    </div>
  );
}
