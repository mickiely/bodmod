import React from 'react';
import { cn } from '../ui/utils';

interface PowerBarsProps {
  nutrition: {
    fat: number;
    sugar: number;
    salt: number;
    protein: number;
    calories: number;
  };
  variant?: 'full' | 'compact' | 'mini';
  labels?: boolean;
}

export const PowerBars = ({ nutrition, variant = 'full', labels = true }: PowerBarsProps) => {
  
  // Mock thresholds (g)
  const getStatus = (type: string, val: number) => {
      // Logic for "Safe" (Green), "Medium" (Yellow), "Danger" (Red)
      // High is bad for Fat/Sugar/Salt. Low is bad for Protein (inverted logic visually perhaps)
      
      if (type === 'protein') {
          if (val > 20) return { color: 'bg-indigo-500', text: 'text-indigo-600', label: 'HIGH' };
          if (val > 10) return { color: 'bg-blue-400', text: 'text-blue-500', label: 'MED' };
          return { color: 'bg-slate-300', text: 'text-slate-400', label: 'LOW' };
      }
      
      // Bad stuff
      if (val < 5) return { color: 'bg-green-500', text: 'text-green-600', label: 'LOW' }; // Good
      if (val < 15) return { color: 'bg-yellow-400', text: 'text-yellow-600', label: 'MED' };
      return { color: 'bg-red-500', text: 'text-red-600', label: 'HIGH' };
  };

  const items = [
    { key: 'fat', label: 'FAT', val: nutrition.fat, ...getStatus('fat', nutrition.fat) },
    { key: 'sugar', label: 'SUGR', val: nutrition.sugar, ...getStatus('sugar', nutrition.sugar) },
    { key: 'salt', label: 'SALT', val: nutrition.salt, ...getStatus('salt', nutrition.salt) },
    { key: 'protein', label: 'PROT', val: nutrition.protein, ...getStatus('protein', nutrition.protein) },
  ];

  if (variant === 'mini') {
      return (
          <div className="flex gap-0.5 h-1.5 w-full bg-slate-100 rounded-sm overflow-hidden">
              {items.map((item) => (
                  <div key={item.key} className={cn("flex-1", item.color)} />
              ))}
          </div>
      )
  }

  if (variant === 'compact') {
      return (
        <div className="grid grid-cols-4 gap-2">
            {items.map((item) => (
                <div key={item.key} className="flex flex-col gap-1">
                    <div className="h-2 w-full bg-slate-200 rounded-sm overflow-hidden">
                        <div className={cn("h-full", item.color)} style={{ width: '100%' }} />
                    </div>
                    {labels && <span className="text-[10px] font-black uppercase text-slate-400">{item.label}</span>}
                </div>
            ))}
        </div>
      );
  }

  return (
    <div className="space-y-4 w-full bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
        <div className="flex justify-between items-end border-b-2 border-slate-200 pb-2 mb-2">
            <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Energy Output</span>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{nutrition.calories}</span>
                <span className="text-xs font-bold text-slate-500 uppercase">kcal</span>
            </div>
        </div>

        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.key} className="grid grid-cols-[3rem_1fr_3rem] gap-3 items-center">
                    <span className="text-xs font-black text-slate-500 uppercase">{item.label}</span>
                    
                    <div className="h-4 w-full bg-slate-200 rounded-md overflow-hidden relative shadow-inner">
                        <div 
                            className={cn("h-full transition-all duration-500 ease-out border-r-2 border-black/10", item.color)} 
                            style={{ width: `${Math.min(item.val * 5, 100)}%` }} 
                        />
                        {/* Grid lines overlay */}
                        <div className="absolute inset-0 flex">
                            <div className="flex-1 border-r border-white/20 h-full" />
                            <div className="flex-1 border-r border-white/20 h-full" />
                            <div className="flex-1 border-r border-white/20 h-full" />
                            <div className="flex-1 h-full" />
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={cn("text-xs font-black", item.text)}>{item.val}g</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};