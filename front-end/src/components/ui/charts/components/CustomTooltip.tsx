"use client";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: string | number;
    name?: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  formatTooltip?: (value: string | number, name: string) => [string, string];
}

export default function CustomTooltip({
  active,
  payload,
  label,
  formatTooltip,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] p-3 border border-[var(--border)] rounded-md shadow-lg">
        <p className="text-sm font-medium text-[var(--text)] mb-2">{label}</p>
        {payload.map((entry, index) => {
          const [formattedValue, formattedName] = formatTooltip
            ? formatTooltip(entry.value, entry.name || entry.dataKey)
            : [entry.value, entry.name || entry.dataKey];

          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {formattedName}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
}
