import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const city = searchParams.get('city') || 'Constantine';
        const lang = searchParams.get('lang') || 'en';

        // Call WeatherAPI.com
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(city)}&lang=${lang}`,
            {
                next: { revalidate: 600 } // Cache for 10 minutes
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: {
                location: {
                    name: data.location.name,
                    region: data.location.region,
                    country: data.location.country,
                    lat: data.location.lat,
                    lon: data.location.lon,
                    timezone: data.location.tz_id,
                    localtime: data.location.localtime,
                    localtime_epoch: data.location.localtime_epoch
                },
                current: {
                    temp_c: data.current.temp_c,
                    temp_f: data.current.temp_f,
                    is_day: data.current.is_day,
                    condition: {
                        text: data.current.condition.text,
                        icon: data.current.condition.icon,
                        code: data.current.condition.code
                    },
                    wind_kph: data.current.wind_kph,
                    wind_mph: data.current.wind_mph,
                    humidity: data.current.humidity,
                    feelslike_c: data.current.feelslike_c,
                    feelslike_f: data.current.feelslike_f,
                    uv: data.current.uv
                }
            }
        });
    } catch (error) {
        console.error('Weather API Error:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch weather data'
            },
            { status: 500 }
        );
    }
}
