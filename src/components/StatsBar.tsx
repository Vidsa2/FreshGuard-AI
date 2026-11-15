import React from 'react';
import { Scale, Utensils, ShieldCheck, Truck, TrendingUp, Sparkles } from 'lucide-react';

interface StatsBarProps {
  foodSavedKg: number;
  mealsDonated: number;
  safetyVerifiedPercent: number;
  activeDeliveries: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  foodSavedKg,
  mealsDonated,
  safetyVerifiedPercent,
  activeDeliveries,
}) => {
  const stats = [
    {
      id: 'saved',
      label: 'Food Saved Today',
      value: `${foodSavedKg.toLocaleString()} kg`,
      subtext: '+24 kg from last hour',
      icon: Scale,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200/60',
    },
    {
      id: 'meals',
      label: 'Meals Donated',
      value: mealsDonated.toLocaleString(),
      subtext: 'Equivalent emergency meals',
      icon: Utensils,
      color: 'teal',
      bgColor: 'bg-teal-500/10',
      iconColor: 'text-teal-600',
      borderColor: 'border-teal-200/60',
    },
    {
      id: 'safety',
      label: 'Safety Verified',
      value: `${safetyVerifiedPercent}%`,
      subtext: 'FSANZ & HACCP certified',
      icon: ShieldCheck,
      color: 'forest',
      bgColor: 'bg-[#2d6a4f]/10',
      iconColor: 'text-[#2d6a4f]',
      borderColor: 'border-[#40916c]/30',
    },
    {
      id: 'deliveries',
      label: 'Active Deliveries',
      value: activeDeliveries.toString(),
      subtext: 'Real-time cold-chain routing',
      icon: Truck,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200/70',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white py-4 shadow-inner relative overflow-hidden">
      {/* Subtle organic background mesh */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#74c69d_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 transition-all duration-200 flex items-center gap-3.5 shadow-sm group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-medium text-emerald-200/90 truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-emerald-300/80 truncate font-light flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                    <span>{stat.subtext}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

