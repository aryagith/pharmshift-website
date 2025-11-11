"use client";

import { useState } from "react";

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  currentValue: number;
  maxValue: number;
  unit?: string;
  icon: React.ReactNode;
  showUsageBadge?: boolean;
  isEditable?: boolean;
  onValueChange?: (value: number) => void;
}

export default function ProgressCard({
  title,
  subtitle,
  currentValue,
  maxValue,
  unit = "",
  icon,
  showUsageBadge = false,
  isEditable = false,
  onValueChange,
}: ProgressCardProps) {
  const [localValue, setLocalValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = isEditing ? localValue : currentValue;
  const percentage = Math.round((displayValue / maxValue) * 100);

  const getUsageStatus = () => {
    const ratio = displayValue / maxValue;
    if (ratio > 0.8)
      return {
        status: "High",
        color: "bg-red-500/20 text-red-300 border border-red-500/30",
        barColor: "from-red-500 to-red-400",
      };
    if (ratio > 0.6)
      return {
        status: "Medium",
        color: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
        barColor: "from-yellow-500 to-yellow-400",
      };
    return {
      status: "Low",
      color: "bg-green-500/20 text-green-300 border border-green-500/30",
      barColor: "from-green-500 to-green-400",
    };
  };

  const usageStatus = getUsageStatus();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
  };

  const handleSave = () => {
    if (onValueChange) {
      onValueChange(localValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(currentValue);
    setIsEditing(false);
  };

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
          <span className="text-2xl font-bold text-white">{displayValue}</span>
          <span className="text-blue-300 text-md">
            /{maxValue}
            {unit}
          </span>
          {isEditable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">
                Adjust your {title.toLowerCase()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="range"
                min="0"
                max={maxValue}
                value={localValue}
                onChange={handleSliderChange}
                className="w-full h-3 bg-gray-800/50 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, 
                    ${
                      percentage <= 60
                        ? "#10b981"
                        : percentage <= 80
                        ? "#f59e0b"
                        : "#ef4444"
                    } 0%, 
                    ${
                      percentage <= 60
                        ? "#10b981"
                        : percentage <= 80
                        ? "#f59e0b"
                        : "#ef4444"
                    } ${percentage}%, 
                    #374151 ${percentage}%, 
                    #374151 100%)`,
                }}
              />
              <style jsx>{`
                .slider::-webkit-slider-thumb {
                  appearance: none;
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: ${percentage <= 60
                    ? "#10b981"
                    : percentage <= 80
                    ? "#f59e0b"
                    : "#ef4444"};
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                }
                .slider::-moz-range-thumb {
                  height: 20px;
                  width: 20px;
                  border-radius: 50%;
                  background: ${percentage <= 60
                    ? "#10b981"
                    : percentage <= 80
                    ? "#f59e0b"
                    : "#ef4444"};
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                }
              `}</style>
            </div>

            <div className="flex justify-between text-xs text-blue-300">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Low (0-{Math.round(maxValue * 0.6)})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                Medium ({Math.round(maxValue * 0.6)}-
                {Math.round(maxValue * 0.8)})
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                High ({Math.round(maxValue * 0.8)}+)
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${usageStatus.barColor} h-full rounded-full transition-all duration-500 ease-out relative`}
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
          </>
        )}
      </div>

      {showUsageBadge && !isEditing && (
        <div className="mt-3 flex items-center justify-between">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${usageStatus.color}`}
          >
            {usageStatus.status}
          </div>
          <span className="text-sm text-gray-400">
            {maxValue - displayValue} remaining
          </span>
        </div>
      )}
    </div>
  );
}
