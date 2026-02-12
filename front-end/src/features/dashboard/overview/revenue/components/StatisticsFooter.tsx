interface StatisticsFooterProps {
  totalRevenue: number;
  avgGrowth: number;
  positiveCount: number;
  totalCount: number;
  translations: {
    totalRevenue: string;
    avgGrowth: string;
    positive: string;
  };
}

export default function StatisticsFooter({
  totalRevenue,
  avgGrowth,
  positiveCount,
  totalCount,
  translations,
}: StatisticsFooterProps) {
  return (
    <div className="mt-2 sm:mt-2.5 grid grid-cols-3 gap-2 sm:gap-4">
      <div className="text-center">
        <div className="text-[var(--text)] text-sm sm:text-base font-medium">
          ${totalRevenue.toLocaleString()}
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.totalRevenue}
        </div>
      </div>
      <div className="text-center">
        <div
          dir="ltr"
          className="text-[var(--text)] text-sm sm:text-base font-medium"
        >
          +{avgGrowth.toFixed(1)}%
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.avgGrowth}
        </div>
      </div>
      <div className="text-center">
        <div className="text-[var(--text)] text-sm sm:text-base font-medium">
          {positiveCount}/{totalCount}
        </div>
        <div className="text-[var(--text-muted)] text-xs">
          {translations.positive}
        </div>
      </div>
    </div>
  );
}
