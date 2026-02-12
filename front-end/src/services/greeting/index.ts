/**
 * Greeting Service - Main Export
 * Centralized exports for cleaner imports across the app
 * 
 * Usage Examples:
 * 
 * // Import hooks and types
 * import { useWeatherByLocation, useLocation, WeatherData } from '@/services/greeting';
 * 
 * // Import cache keys for manual operations
 * import { greetingKeys } from '@/services/greeting';
 * queryClient.invalidateQueries({ queryKey: greetingKeys.weather() });
 */

// Types
export * from './types/greetingTypes';

// All Hooks
export * from './hooks';

// Cache Keys
export * from './keys/greetingKeys';
