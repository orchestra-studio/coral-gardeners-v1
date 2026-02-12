/**
 * Greeting TanStack Query Hooks - Queries
 */

import { useQuery } from '@tanstack/react-query';
import { greetingApi } from '@/lib/api/greeting';
import { LocationData, WeatherData } from '../types/greetingTypes';
import { greetingKeys } from '../keys/greetingKeys';

/**
 * Hook to get user location from IP
 */
export function useLocation() {
    return useQuery<LocationData>({
        queryKey: greetingKeys.location(),
        queryFn: async () => {
            const response = await greetingApi.getLocation();
            if (!response.success || !response.data) {
                console.error('[useLocation] Failed:', response.message);
                throw new Error(response.message || 'Failed to fetch location');
            }
            return response.data;
        },
        staleTime: 60 * 60 * 1000, // 1 hour - location doesn't change frequently
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchOnWindowFocus: false,
        retry: 1, // Only retry once on failure
    });
}

/**
 * Hook to get weather data for a city
 */
export function useWeather(city?: string, lang?: string) {
    return useQuery<WeatherData>({
        queryKey: greetingKeys.weather(city),
        queryFn: async () => {
            const response = await greetingApi.getWeather({ city, lang });
            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch weather');
            }
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        enabled: !!city, // Only fetch if city is provided
        retry: 2,
    });
}

/**
 * Hook to get weather based on user's location
 */
export function useWeatherByLocation(lang?: string) {
    const { data: location, isSuccess: locationSuccess } = useLocation();


    return useQuery<WeatherData>({
        queryKey: greetingKeys.weather(location?.city),
        queryFn: async () => {
            const response = await greetingApi.getWeather({
                city: location?.city,
                lang
            });
            if (!response.success || !response.data) {
                console.error('[useWeatherByLocation] Failed:', response.message);
                throw new Error(response.message || 'Failed to fetch weather');
            }
            return response.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        enabled: locationSuccess && !!location?.city,
        retry: 2,
    });
}
