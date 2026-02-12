/**
 * Greeting/Weather Management API
 * Get location and weather data for greeting widget
 */

import { ApiResponse } from "../client";
import { LocationData, WeatherData, WeatherParams } from "./types";

export const greetingApi = {
    // Get user location from IP
    getLocation: async (): Promise<ApiResponse<LocationData>> => {
        try {
            const response = await fetch('/api/location');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Location fetch error:', error);
            // Return USA as fallback
            return {
                success: true,
                data: {
                    country: 'United States',
                    countryCode: 'US',
                    region: 'CA',
                    regionName: 'California',
                    city: 'Los Angeles',
                    lat: 34.0522,
                    lon: -118.2437,
                    timezone: 'America/Los_Angeles'
                }
            };
        }
    },

    // Get weather data for a city
    getWeather: async (params?: WeatherParams): Promise<ApiResponse<WeatherData>> => {
        try {
            const queryParams = new URLSearchParams();
            if (params?.city) queryParams.append('city', params.city);
            if (params?.lang) queryParams.append('lang', params.lang);

            const url = `/api/weather${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Weather fetch error:', error);
            return {
                success: false,
                message: 'Failed to fetch weather data'
            };
        }
    },
};

// Export individual functions for convenience
export const {
    getLocation,
    getWeather,
} = greetingApi;
