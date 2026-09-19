import React from 'react';
import { useGame, Mission } from '../context/GameContext';
import { PowerBars } from '../shared/PowerBars';
import { Button } from '../ui/button';
import { ScanBarcode, Utensils, HeartPulse, UserCircle, Settings as SettingsIcon, Zap, CheckCircle2, ChevronRight, Flame } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { format } from 'date-fns';
import { cn } from '../ui/utils';
import { Progress } from '../ui/progress';

export const Dashboard = () => {
  const { profile, missions, logs, setCurrentView } = useGame();

  // Determine "Next Step"
  const getNextStep = () => {
      if (logs.length === 0) return { title: "Scan your first item", action: "scan", icon: ScanBarcode, desc: "Start building your safe food list." };
      const lastLog = logs[0];
      if (new Date().getTime() - lastLog.timestamp.getTime() > 1000 * 60 * 60 * 4) {
          return { title: "Log your lunch", action: "log", icon: Utensils, desc: "Keep your energy levels tracked." };
      }
      return { title: "Check your mood", action: "wellness", icon: HeartPulse, desc: "How is the fuel affecting you?" };
  };

  const nextStep = getNextStep();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      
      {/* Header & Momentum HUD */}
      <div className="space-y-4">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
                     {profile.momentum}
                 </div>
                 <div>
                     <h1 className="text-xl font-black text-slate-900 uppercase italic leading-none">Momentum</h1>
                     <p className="text-xs font-bold text-slate-400 uppercase">Daily Goal</p>
                 </div>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1 bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200">
                     <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                     <span className="text-orange-700 font-black text-sm">{profile.streak}</span>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setCurrentView('settings')}>
                     <SettingsIcon className="w-5 h-5 text-slate-400" />
                 </Button>
             </div>
          </div>

          {/* Momentum Bar */}
          <div className="space-y-1">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000 ease-out relative overflow-hidden" 
                    style={{ width: `${profile.momentum}%` }} 
                  >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
              </div>
          </div>
      </div>

      {/* Next Step Card */}
      <div onClick={() => setCurrentView(nextStep.action)} className="cursor-pointer group">
          <Card className="bg-slate-900 border-2 border-slate-900 text-white shadow-xl overflow-hidden relative transform transition-all hover:scale-[1.01] hover:shadow-2xl">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none" />
              <CardContent className="p-6 flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase tracking-wider mb-1">
                          <Zap className="w-3 h-3" /> Recommended Action
                      </div>
                      <h2 className="text-2xl font-black uppercase italic tracking-wide group-hover:text-indigo-200 transition-colors">{nextStep.title}</h2>
                      <p className="text-slate-400 text-sm font-medium">{nextStep.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <ChevronRight className="w-6 h-6 text-white" />
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Today's Missions */}
      <div className="space-y-3">
          <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider px-1">Today's Missions</h3>
          <div className="grid gap-3">
              {missions.map((mission) => (
                  <div 
                    key={mission.id} 
                    className={cn(
                        "flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                        mission.completed 
                            ? "bg-emerald-50 border-emerald-200 opacity-80" 
                            : "bg-white border-slate-200"
                    )}
                  >
                      <div className="flex items-center gap-4">
                          <div className={cn(
                              "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                              mission.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                          )}>
                              {mission.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <span className={cn(
                              "font-bold uppercase text-sm",
                              mission.completed ? "text-emerald-700 line-through" : "text-slate-700"
                          )}>{mission.title}</span>
                      </div>
                      <span className={cn(
                          "text-xs font-black px-2 py-1 rounded",
                          mission.completed ? "bg-emerald-200 text-emerald-800" : "bg-slate-100 text-slate-500"
                      )}>
                          +{mission.rewardMomentum}
                      </span>
                  </div>
              ))}
          </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setCurrentView('scan')}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-sm hover:border-indigo-500 hover:text-indigo-600 rounded-2xl"
          >
              <ScanBarcode className="w-8 h-8" />
              <span className="font-black uppercase text-sm">Scan</span>
          </Button>

          <Button 
            onClick={() => setCurrentView('log')}
            className="h-24 flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-sm hover:border-emerald-500 hover:text-emerald-600 rounded-2xl"
          >
              <Utensils className="w-8 h-8" />
              <span className="font-black uppercase text-sm">Log</span>
          </Button>

          <Button 
            onClick={() => setCurrentView('wellness')}
            className="h-20 flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-sm hover:border-pink-500 hover:text-pink-600 rounded-2xl"
          >
              <HeartPulse className="w-6 h-6" />
              <span className="font-bold uppercase text-xs">Mood</span>
          </Button>

          <Button 
            onClick={() => setCurrentView('profile')}
            className="h-20 flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 shadow-sm hover:border-slate-800 hover:text-slate-900 rounded-2xl"
          >
              <UserCircle className="w-6 h-6" />
              <span className="font-bold uppercase text-xs">SOS Kit</span>
          </Button>
      </div>

    </div>
  );
};