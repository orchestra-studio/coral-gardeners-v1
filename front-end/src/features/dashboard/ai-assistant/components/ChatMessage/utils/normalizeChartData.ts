/**
 * Normalizes chart data to ensure consistent structure
 * Adds a 'name' field for x-axis display
 */
export function normalizeChartData(
    data: Array<Record<string, string | number>>,
    xKey: string
): Array<{ name: string;[key: string]: string | number }> {
    return data.map((entry) => {
        const normalized: Record<string, string | number> = {};

        // Copy all valid string/number entries
        Object.entries(entry).forEach(([key, value]) => {
            if (typeof value === "string" || typeof value === "number") {
                normalized[key] = value;
            }
        });

        // Add 'name' field for x-axis display
        const category = entry[xKey];
        if (typeof category === "number") {
            normalized.name = String(category);
        } else if (typeof category === "string") {
            normalized.name = category;
        } else {
            normalized.name = "";
        }

        // Ensure xKey exists if name is set
        if (normalized[xKey] === undefined && normalized.name) {
            normalized[xKey] = normalized.name;
        }

        return normalized as { name: string;[key: string]: string | number };
    });
}
