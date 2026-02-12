import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // Get IP from headers (works with most deployments)
        const forwarded = request.headers.get('x-forwarded-for');
        let ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip');


        // If no IP or localhost, get public IP from ipify
        if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipResponse.json();
                ip = ipData.ip;
            } catch (err) {
                console.error('[Location API] Failed to get public IP:', err);
                ip = null;
            }
        }

        // Call ip-api.com with the detected IP
        const locationUrl = ip
            ? `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone`
            : `http://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone`;


        const response = await fetch(locationUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }

        const data = await response.json();

        // If API fails or user is using VPN/proxy, return USA as fallback
        if (data.status !== 'success') {
            console.warn('[Location API] API returned failure status, using fallback');
            return NextResponse.json({
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
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                country: data.country,
                countryCode: data.countryCode,
                region: data.region,
                regionName: data.regionName,
                city: data.city,
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone
            }
        });
    } catch (error) {
        console.error('Location API Error:', error);

        // Return USA as fallback on error
        return NextResponse.json({
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
        });
    }
}
