import { useState, useEffect } from 'react';
import useMetroStore from '../store/useMetroStore';
import { fetchStations, fetchLines } from '../services/metroAPI';
import { Search, MapPin, ChevronDown, Train } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StationSelector({ className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        stations, lines, selectedStation,
        setStations, setLines, selectStation, setError
    } = useMetroStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [stationsData, linesData] = await Promise.all([
                    fetchStations(),
                    fetchLines()
                ]);
                setStations(stationsData);
                setLines(linesData);
            } catch (err) {
                // Silent error for UX, store handles global error state if needed
                console.error("Failed to load metro data", err);
            }
        };
        loadData();
    }, []);

    const filteredStations = stations.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getLineColor = (lineCode) => {
        return lines.find(l => l.code === lineCode)?.color || '#999';
    };

    return (
        <div className={`w-full max-w-md relative ${className}`}>
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-metro-purple/80 backdrop-blur-md border border-metro-blue/30 hover:border-metro-blue/60 p-4 rounded-2xl shadow-lg flex items-center justify-between text-left transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-metro-blue/10 p-2.5 rounded-xl border border-metro-blue/20">
                        <Train className="text-metro-blue w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] text-metro-blue/80 uppercase tracking-[0.2em] font-bold mb-0.5">
                            {selectedStation ? 'Boarding Station' : 'Select Station'}
                        </div>
                        <div className="text-white font-bold text-lg truncate">
                            {selectedStation ? selectedStation.name : "Tap to choose..."}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-3 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-[60vh] overflow-hidden flex flex-col z-50"
                    >
                        <div className="p-4 border-b border-white/10 sticky top-0 bg-gray-900/95 z-10 backdrop-blur-xl">
                            <div className="relative group">
                                <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5 group-focus-within:text-metro-blue transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search Delhi Metro..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-metro-blue/50 placeholder:text-gray-600 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {filteredStations.map(station => (
                                <button
                                    key={station.id}
                                    onClick={() => {
                                        selectStation(station.id);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="w-full p-3 hover:bg-white/5 rounded-xl flex items-center gap-3 group transition-all border border-transparent hover:border-white/5"
                                >
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px]"
                                        style={{
                                            backgroundColor: getLineColor(station.line),
                                            boxShadow: `0 0 10px ${getLineColor(station.line)}`
                                        }}
                                    />
                                    <span className={`text-left flex-1 font-medium ${selectedStation?.id === station.id ? 'text-metro-blue' : 'text-gray-300 group-hover:text-white'}`}>
                                        {station.name}
                                    </span>
                                    {selectedStation?.id === station.id && (
                                        <motion.div layoutId="selected-dot" className="w-1.5 h-1.5 bg-metro-blue rounded-full" />
                                    )}
                                </button>
                            ))}
                            {filteredStations.length === 0 && (
                                <div className="py-8 text-center">
                                    <p className="text-gray-500 text-sm">No stations found</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
