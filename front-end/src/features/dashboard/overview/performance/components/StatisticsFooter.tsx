import { PerformanceData } from "../data";

interface StatisticsFooterProps {
  avgCompletion: number;
  aboveTarget: number;
  totalMonths: number;
  bestMonth: PerformanceData;
  translations: {
    avgCompletion: string;
    aboveTarget: string;
    bestMonth: string;
  };
}

export default function StatisticsFooter({
  avgCompletion,
  aboveTarget,
  totalMonths,
  bestMonth,
  translations,
}: StatisticsFooterProps) {
  return (
    <div className="mt-2 sm:mt-2.5 grid grid-cols-3 gap-2 sm:gap-4">
      <div className="text-center">
        <div className="text-[var(--text)] text-sm sm:text-base font-medium">
          {avgCompletion.toFixed(1)}%
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.avgCompletion}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[var(--text)] text-sm sm:text-base font-medium">
          {aboveTarget}/{totalMonths}
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.aboveTarget}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[var(--text)] text-sm sm:text-base font-medium">
          {bestMonth.month}
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.bestMonth}
        </div>
      </div>
    </div>
  );
}
