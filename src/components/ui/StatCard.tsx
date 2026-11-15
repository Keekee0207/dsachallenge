import React, { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  gauge?: ReactNode;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gauge,
  trend,
}) => {
  return (
    <div className="habit-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex items-center justify-between transition-all duration-200">
      <div className="flex-1 pr-3">
        <div className="flex items-center gap-2 mb-1.5">
          {icon && <span className="text-neutral-400">{icon}</span>}
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 font-normal">{subtitle}</p>
        )}
      </div>

      {gauge && <div className="flex-shrink-0">{gauge}</div>}
    </div>
  );
};
