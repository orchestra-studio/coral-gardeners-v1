/**
 * Greeting API - Main Export
 * Centralized exports for greeting/weather API operations
 */

// Export the main API object
export { greetingApi } from "./greetingApi";

// Export individual functions for convenience
export { getLocation, getWeather } from "./greetingApi";

// Export types
export * from "./types";
