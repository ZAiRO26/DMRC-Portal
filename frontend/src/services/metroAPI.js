import axios from 'axios';

// In production, this would point to the deployed backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/metro';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
});

export const fetchStations = async () => {
    try {
        const response = await api.get('/stations');
        return response.data.data;
    } catch (error) {
        console.error('API Error (fetchStations):', error);
        throw error;
    }
};

export const fetchLines = async () => {
    try {
        const response = await api.get('/lines');
        return response.data.data;
    } catch (error) {
        console.error('API Error (fetchLines):', error);
        throw error;
    }
};

export const fetchArrivals = async (stationId) => {
    try {
        const response = await api.get(`/arrivals/${stationId}`);
        return response.data.data;
    } catch (error) {
        console.error(`API Error (fetchArrivals ${stationId}):`, error);
        throw error;
    }
};

export default {
    fetchStations,
    fetchLines,
    fetchArrivals
};
