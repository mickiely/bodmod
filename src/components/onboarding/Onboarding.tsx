import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Check, ChevronRight, ShieldAlert, Heart, Scale } from 'lucide-react';
import { cn } from '../ui/utils';

const ALLERGY_OPTIONS = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Oats'];
const CONDITION_OPTIONS = ['Diabetes', 'IBS', 'Celiac', 'Lactose Intolerant'];
const DIET_OPTIONS = ['Vegan', 'Keto', 'Paleo', 'Vegetarian', 'Pescatarian'];

export const Onboarding = () => {
  const { profile, updateProfile, setCurrentView } = useGame();
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(s => s + 1);
  const finish = () => {
      updateProfile({ onboardingCompleted: true });
      setCurrentView('dashboard');
  };

  const ChipGroup = ({ 
      options, 
      selected, 
      onToggle 
  }: { 
      options: string[], 
      selected: string[], 
      onToggle: (val: string) => void 
  }) => (
    <div className="flex flex-wrap gap-3">
        {options.map(opt => {
            const isActive = selected.includes(opt);
            return (
                <button
                    key={opt}
                    onClick={() => onToggle(opt)}
                    className={cn(
                        "px-5 py-3 rounded-xl font-bold uppercase text-sm transition-all border-2",
                        isActive 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105" 
                            : "bg-white border-slate-200 text-slate-500 hover:border-indigo-200"
                    )}
                >
                    {opt}
                </button>
            )
        })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn("w-2 h-2 rounded-full transition-all", step >= i ? "bg-indigo-600 w-6" : "bg-slate-300")} />
            ))}
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center text-3xl font-black shadow-xl rotate-3">
                    B
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase italic">Setup SOS Kit</h1>
                    <p className="text-slate-500 font-medium mt-2">Takes 30 seconds. Protects you forever.</p>
                </div>
                <Button onClick={nextStep} size="lg" className="w-full h-14 text-lg uppercase font-black tracking-wide shadow-lg hover:translate-y-[-2px] transition-transform">
                    Start Setup
                </Button>
            </div>
        )}

        {/* Step 2: Units */}
        {step === 2 && (
            <Card className="border-0 shadow-xl animate-in fade-in slide-in-from-right-8">
                <CardContent className="p-8 space-y-8">
                    <div className="text-center">
                        <Scale className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black uppercase text-slate-900">Measure Up</h2>
                        <p className="text-slate-500">How do you track energy?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => updateProfile({ energyUnit: 'kcal' })}
                            className={cn(
                                "p-4 rounded-xl border-2 font-black text-xl uppercase transition-all",
                                profile.energyUnit === 'kcal' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-400"
                            )}
                        >
                            kcal
                        </button>
                        <button 
                            onClick={() => updateProfile({ energyUnit: 'kJ' })}
                            className={cn(
                                "p-4 rounded-xl border-2 font-black text-xl uppercase transition-all",
                                profile.energyUnit === 'kJ' ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-200 text-slate-400"
                            )}
                        >
                            kJ
                        </button>
                    </div>

                    <Button onClick={nextStep} className="w-full h-12 font-black uppercase">Next</Button>
                </CardContent>
            </Card>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
            <Card className="border-0 shadow-xl animate-in fade-in slide-in-from-right-8">
                <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black uppercase text-slate-900">Safety Check</h2>
                        <p className="text-slate-500">Select any allergies to avoid.</p>
                    </div>

                    <ChipGroup 
                        options={ALLERGY_OPTIONS}
                        selected={profile.allergies}
                        onToggle={(val) => {
                            const has = profile.allergies.includes(val);
                            updateProfile({ 
                                allergies: has ? profile.allergies.filter(a => a !== val) : [...profile.allergies, val] 
                            });
                        }}
                    />

                    <Button onClick={nextStep} className="w-full h-12 font-black uppercase">Next</Button>
                </CardContent>
            </Card>
        )}

        {/* Step 4: Conditions & Diet */}
        {step === 4 && (
            <Card className="border-0 shadow-xl animate-in fade-in slide-in-from-right-8">
                 <CardContent className="p-8 space-y-6">
                    <div className="text-center">
                        <Heart className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-black uppercase text-slate-900">Final Touches</h2>
                        <p className="text-slate-500">Any conditions or preferences?</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Conditions</h3>
                        <ChipGroup 
                            options={CONDITION_OPTIONS}
                            selected={profile.conditions}
                            onToggle={(val) => {
                                const has = profile.conditions.includes(val);
                                updateProfile({ 
                                    conditions: has ? profile.conditions.filter(a => a !== val) : [...profile.conditions, val] 
                                });
                            }}
                        />

                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Diet</h3>
                         <ChipGroup 
                            options={DIET_OPTIONS}
                            selected={profile.dietPreferences}
                            onToggle={(val) => {
                                const has = profile.dietPreferences.includes(val);
                                updateProfile({ 
                                    dietPreferences: has ? profile.dietPreferences.filter(a => a !== val) : [...profile.dietPreferences, val] 
                                });
                            }}
                        />
                    </div>

                    <Button onClick={finish} size="lg" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase shadow-lg text-lg">
                        Build Momentum <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                </CardContent>
            </Card>
        )}

      </div>
    </div>
  );
};