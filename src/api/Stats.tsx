import {useEffect, useRef} from "react";
import axios from "axios";

export async function fetchStats() {
    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch statistics:", error);
        return null;
    }
}

export function useLiveStats(setStats: (data: any) => void) {
    const prevStatsRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchAndCompare = async () => {
            try {
                const response = await axios.get(`${API_URL}/stats`);
                const newStats = response.data;

                if (JSON.stringify(prevStatsRef.current) !== JSON.stringify(newStats)) {
                    prevStatsRef.current = newStats;
                    setStats(newStats);
                }
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            }
        };

        fetchAndCompare();
        const interval = setInterval(fetchAndCompare, 10000); // every 10 seconds
        return () => clearInterval(interval);
    }, [setStats]);
}