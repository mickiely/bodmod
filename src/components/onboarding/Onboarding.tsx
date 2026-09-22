import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChevronRight, ShieldAlert, Heart, Scale, Target, Dumbbell } from 'lucide-react';
import { cn } from '../ui/utils';

const ALLERGY_OPTIONS = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'Oats'];
const CONDITION_OPTIONS = ['Diabetes', 'IBS', 'Celiac', 'Lactose Intolerant'];
const DIET_OPTIONS = ['Vegan', 'Keto', 'Paleo', 'Vegetarian', 'Pescatarian'];
const EXERCISE_OPTIONS = ['walking', 'calisthenics', 'strength', 'running', 'cycling', 'mobility', 'swimming', 'sport'] as const;

export const Onboarding = () => {
  const { profile, updateProfile, setCurrentView } = useGame();
  const [step, setStep] = useState(1);
  const body = profile.bodyGoal;
  const bmi = body.heightCm > 0 && body.currentWeightKg > 0 ? body.currentWeightKg / Math.pow(body.heightCm / 100, 2) : 0;
  const kgToGoal = body.currentWeightKg > 0 && body.targetWeightKg > 0 ? Math.max(0, body.currentWeightKg - body.targetWeightKg) : 0;
  const recommendedWeekly = body.currentWeightKg > 0 ? Math.min(1, Math.max(0.25, body.currentWeightKg * 0.0075)) : 0.5;
  const weeks = kgToGoal > 0 ? Math.ceil(kgToGoal / recommendedWeekly) : 0;
  const suggestedDate = weeks ? new Date(Date.now() + weeks * 7 * 86400000).toISOString().slice(0, 10) : '';
  const setBody = (updates: Partial<typeof body>) => updateProfile({ bodyGoal: { ...body, ...updates } });

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
            {[1, 2, 3, 4, 5, 6].map(i => (
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

        {/* Step 3: Body goal */}
        {step === 5 && (
          <Card className="border-0 shadow-xl"><CardContent className="p-8 space-y-5">
            <div className="text-center"><Target className="w-12 h-12 text-indigo-500 mx-auto mb-3" /><h2 className="text-2xl font-black uppercase">Set Your Target</h2><p className="text-slate-500">BODMOD turns the numbers into a practical plan.</p></div>
            <div className="grid grid-cols-2 gap-3">
              <input aria-label="Height cm" type="number" placeholder="Height cm" value={body.heightCm || ''} onChange={e=>setBody({heightCm:Number(e.target.value)})} className="p-3 rounded-xl border-2 border-slate-200" />
              <input aria-label="Age" type="number" placeholder="Age" value={body.age || ''} onChange={e=>setBody({age:Number(e.target.value)})} className="p-3 rounded-xl border-2 border-slate-200" />
              <input aria-label="Current weight kg" type="number" placeholder="Current kg" value={body.currentWeightKg || ''} onChange={e=>setBody({currentWeightKg:Number(e.target.value)})} className="p-3 rounded-xl border-2 border-slate-200" />
              <input aria-label="Goal weight kg" type="number" placeholder="Goal kg" value={body.targetWeightKg || ''} onChange={e=>setBody({targetWeightKg:Number(e.target.value)})} className="p-3 rounded-xl border-2 border-slate-200" />
            </div>
            {bmi > 0 && <div className="rounded-xl bg-slate-900 text-white p-4"><div className="text-xs uppercase font-black text-indigo-300">BMI screening estimate</div><div className="text-2xl font-black">{bmi.toFixed(1)}</div><div className="text-xs text-slate-400">One screening measure only — not a complete measure of health.</div></div>}
            {weeks > 0 && <div className="rounded-xl bg-indigo-50 p-4 text-sm"><b>{kgToGoal.toFixed(1)} kg to goal</b><br/>Suggested planning pace ~{recommendedWeekly.toFixed(1)} kg/week · about {weeks} weeks · around {suggestedDate}.</div>}
            <label className="block text-xs font-black uppercase text-slate-400">Your target date (optional)</label>
            <input type="date" value={body.targetDate} onChange={e=>setBody({targetDate:e.target.value,weeklyTargetKg:recommendedWeekly})} className="w-full p-3 rounded-xl border-2 border-slate-200" />
            <Button onClick={()=>{setBody({weeklyTargetKg:recommendedWeekly,targetDate:body.targetDate||suggestedDate});nextStep();}} disabled={!body.heightCm || !body.currentWeightKg || !body.targetWeightKg} className="w-full h-12 font-black uppercase">Build My Plan</Button>
          </CardContent></Card>
        )}

        {/* Step 4: Exercise choice */}
        {step === 6 && (
          <Card className="border-0 shadow-xl"><CardContent className="p-8 space-y-5">
            <div className="text-center"><Dumbbell className="w-12 h-12 text-emerald-500 mx-auto mb-3" /><h2 className="text-2xl font-black uppercase">Choose Your Movement</h2><p className="text-slate-500">Pick what you will actually do. Change it anytime.</p></div>
            <div className="grid grid-cols-2 gap-3">{EXERCISE_OPTIONS.map(x => {
              const active=body.exerciseTypes.includes(x);
              return <button key={x} onClick={()=>setBody({exerciseTypes:active?body.exerciseTypes.filter(v=>v!==x):[...body.exerciseTypes,x]})} className={cn("p-3 rounded-xl border-2 font-black uppercase text-xs",active?"bg-emerald-50 border-emerald-500 text-emerald-700":"border-slate-200 text-slate-500")}>{x}</button>
            })}</div>
            <Button onClick={nextStep} disabled={!body.exerciseTypes.length} className="w-full h-12 font-black uppercase">Next</Button>
          </CardContent></Card>
        )}

        {/* Step 5: Allergies */}
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

        {/* Step 6: Conditions & Diet */}
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