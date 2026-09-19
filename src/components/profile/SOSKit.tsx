import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { User, ShieldAlert, Heart, Scale, Save, Check } from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

const ALLERGY_OPTIONS = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Oats'];
const CONDITION_OPTIONS = ['Diabetes', 'IBS', 'Celiac', 'Lactose Intolerant'];
const DIET_OPTIONS = ['Vegan', 'Keto', 'Paleo', 'Vegetarian', 'Pescatarian'];

export const SOSKit = () => {
  const { profile, updateProfile, setCurrentView } = useGame();

  const toggleOption = (listName: 'allergies' | 'conditions' | 'dietPreferences', item: string) => {
    const current = profile[listName];
    if (current.includes(item)) {
        updateProfile({ [listName]: current.filter((i: string) => i !== item) });
    } else {
        updateProfile({ [listName]: [...current, item] });
    }
  };

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
      <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-wider px-1">
              <Icon className="w-4 h-4" /> {title}
          </div>
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm">
              {children}
          </div>
      </div>
  );

  const ChipGroup = ({ 
      options, 
      selected, 
      onToggle, 
      colorClass = "bg-indigo-600" 
  }: { 
      options: string[], 
      selected: string[], 
      onToggle: (item: string) => void,
      colorClass?: string
  }) => (
      <div className="flex flex-wrap gap-2">
          {options.map(opt => {
              const isActive = selected.includes(opt);
              return (
                  <button
                      key={opt}
                      onClick={() => onToggle(opt)}
                      className={cn(
                          "px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all border-2",
                          isActive 
                              ? cn("border-transparent text-white shadow-md transform scale-105", colorClass)
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                  >
                      {opt}
                  </button>
              )
          })}
      </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase italic">SOS Kit</h1>
              <p className="text-slate-500 font-medium">Your personal safety parameters.</p>
          </div>
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl">
              {profile.displayName.charAt(0)}
          </div>
      </div>

      <div className="grid gap-8">
        
        {/* Units Toggle */}
        <Section title="Units" icon={Scale}>
            <div className="flex bg-slate-100 p-1.5 rounded-xl w-fit">
                {(['kcal', 'kJ'] as const).map((u) => (
                    <button
                        key={u}
                        onClick={() => updateProfile({ energyUnit: u })}
                        className={cn(
                            "px-6 py-2 rounded-lg text-sm font-black uppercase transition-all",
                            profile.energyUnit === u 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {u}
                    </button>
                ))}
            </div>
        </Section>

        {/* Allergies */}
        <Section title="Allergies (Red Flag)" icon={ShieldAlert}>
            <ChipGroup 
                options={ALLERGY_OPTIONS} 
                selected={profile.allergies} 
                onToggle={(item) => toggleOption('allergies', item)} 
                colorClass="bg-red-500"
            />
        </Section>

        {/* Conditions */}
        <Section title="Conditions" icon={Heart}>
             <ChipGroup 
                options={CONDITION_OPTIONS} 
                selected={profile.conditions} 
                onToggle={(item) => toggleOption('conditions', item)} 
                colorClass="bg-indigo-500"
            />
        </Section>

        {/* Diet */}
        <Section title="Diet Preferences" icon={User}>
             <ChipGroup 
                options={DIET_OPTIONS} 
                selected={profile.dietPreferences} 
                onToggle={(item) => toggleOption('dietPreferences', item)} 
                colorClass="bg-emerald-500"
            />
        </Section>

      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-20">
          <Button 
            size="lg"
            className="h-16 w-16 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center p-0 hover:scale-105 transition-transform"
            onClick={() => {
                toast.success("SOS Kit Updated");
                setCurrentView('dashboard');
            }}
          >
              <Check className="w-8 h-8" />
          </Button>
      </div>

    </div>
  );
};