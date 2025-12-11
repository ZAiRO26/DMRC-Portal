import { create } from 'zustand';

const useMetroStore = create((set) => ({
    selectedStation: null,
    stations: [],
    lines: [],
    arrivals: null,
    isLoading: false,
    error: null,

    // Actions
    setStations: (stations) => set({ stations }),
    setLines: (lines) => set({ lines }),

    selectStation: (stationId) => set((state) => {
        const station = state.stations.find(s => s.id === stationId);
        return { selectedStation: station, arrivals: null, error: null };
    }),

    setArrivals: (arrivalData) => set({ arrivals: arrivalData }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error }),

    resetError: () => set({ error: null })
}));

export default useMetroStore;
