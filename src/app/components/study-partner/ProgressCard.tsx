"use client";

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  currentValue: number;
  maxValue: number;
  unit?: string;
  icon: React.ReactNode;
  showUsageBadge?: boolean;
}

export default function ProgressCard({
  title,
  subtitle,
  currentValue,
  maxValue,
  unit = "",
  icon,
  showUsageBadge = false,
}: ProgressCardProps) {
  const percentage = Math.round((currentValue / maxValue) * 100);

  const getUsageStatus = () => {
    const ratio = currentValue / maxValue;
    if (ratio > 0.8)
      return {
        status: "High Usage",
        color: "bg-red-500/20 text-red-300 border border-red-500/30",
      };
    if (ratio > 0.6)
      return {
        status: "Moderate Usage",
        color: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
      };
    return {
      status: "Low Usage",
      color: "bg-green-500/20 text-green-300 border border-green-500/30",
    };
  };

  const usageStatus = getUsageStatus();

  return (
    <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-700/30 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            {subtitle && <p className="text-blue-300 text-sm">{subtitle}</p>}
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">{currentValue}</span>
          <span className="text-blue-300 text-md">
            /{maxValue}
            {unit}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500 ease-out relative"
            style={{
              width: `${percentage}%`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-blue-300 mt-2">
          <span>0{unit}</span>
          <span className="font-medium">
            {percentage}% {showUsageBadge ? "used" : "utilized"}
          </span>
          <span>
            {maxValue}
            {unit}
          </span>
        </div>
      </div>

      {showUsageBadge && (
        <div className="mt-3 flex items-center justify-between">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${usageStatus.color}`}
          >
            {usageStatus.status}
          </div>
          <span className="text-sm text-gray-400">
            {maxValue - currentValue} remaining
          </span>
        </div>
      )}
    </div>
  );
}
