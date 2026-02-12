/**
 * Greeting/Weather API Types
 */

export interface LocationData {
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    lat: number;
    lon: number;
    timezone: string;
}

export interface WeatherCondition {
    text: string;
    icon: string;
    code: number;
}

export interface WeatherLocation {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
    localtime: string;
    localtime_epoch: number;
}

export interface CurrentWeather {
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherCondition;
    wind_kph: number;
    wind_mph: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
}

export interface WeatherData {
    location: WeatherLocation;
    current: CurrentWeather;
}

export interface WeatherParams {
    city?: string;
    lang?: string;
}
