export interface GreetingWidgetProps {
    userName?: string;
    greetingMessages: GreetingMessages;
    locale?: string;
}

export interface GreetingMessages {
    morning: string[];
    afternoon: string[];
    evening: string[];
    subtitle?: string;
}

export type TimePeriod = "morning" | "afternoon" | "evening";

export interface WeatherData {
    location: {
        name: string;
    };
    current: {
        temp_c: number;
        condition: {
            text: string;
            icon: string;
        };
    };
}
