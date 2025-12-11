import { useState, useEffect } from 'react';
import useMetroStore from './store/useMetroStore';
import StationSelector from './components/StationSelector';
import UnityWebGLLoader from './components/UnityWebGLLoader';
import CameraPermission from './components/CameraPermission';
import LoadingScreen from './components/LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [appReady, setAppReady] = useState(false);

  const { selectedStation, arrivals, isLoading } = useMetroStore();

  // Initial App Load Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return <LoadingScreen message="Initializing System..." />;
  }

  if (!permissionChecked) {
    return (
      <CameraPermission
        onGranted={() => {
          setHasCameraAccess(true);
          setPermissionChecked(true);
        }}
        onDenied={() => {
          setHasCameraAccess(false);
          setPermissionChecked(true);
        }}
      />
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-metro-purple text-white">
      {/* 3D/AR Background Layer */}
      <UnityWebGLLoader />

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col">
        {/* Header / Station Selector */}
        <div className="w-full flex justify-center pt-6 px-4 pointer-events-auto">
          <StationSelector className="w-full max-w-md" />
        </div>

        {/* Main Content Area (Countdown) */}
        <div className="flex-1 flex flex-col items-center justify-end pb-20 px-6">
          <AnimatePresence>
            {selectedStation && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="bg-black/80 backdrop-blur-xl border border-metro-blue/30 rounded-3xl p-6 w-full max-w-sm text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto"
              >
                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Next Train to</div>
                <h2 className="text-xl font-bold text-white mb-4">HUDA City Centre</h2>

                {/* Fake Countdown for Demo */}
                <div className="text-6xl font-black text-white tabular-nums tracking-tighter mb-2" style={{ textShadow: '0 0 30px rgba(0,217,255,0.5)' }}>
                  02:35
                </div>
                <div className="text-metro-blue/80 text-xs font-mono tracking-[0.5em]">ARRIVING SOON</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Loading Overlay */}
      <AnimatePresence>
        {isLoading && <LoadingScreen message="Fetching Data..." />}
      </AnimatePresence>
    </div>
  );
}

export default App;
