import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Eye, Type, Speaker, Mic, Lock, Battery, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useGame } from '../context/GameContext';
import { cn } from '../ui/utils';

export const Settings = () => {
  const { profile, updateProfile } = useGame();

  const updateAccess = (key: keyof typeof profile.accessibility, val: any) => {
      updateProfile({
          accessibility: { ...profile.accessibility, [key]: val }
      });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4">
      <h1 className="text-3xl font-black uppercase italic text-slate-900">System Config</h1>

      <div className="grid gap-6">
          
          {/* Accessibility Section */}
          <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-wider">
                      <Eye className="w-4 h-4" /> Accessibility
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                  
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <Label className="font-bold text-slate-800 uppercase">High Contrast</Label>
                          <p className="text-xs text-slate-500 font-bold">Increase visual distinction</p>
                      </div>
                      <Switch 
                        checked={profile.accessibility.highContrast} 
                        onCheckedChange={(c) => updateAccess('highContrast', c)}
                      />
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <Label className="font-bold text-slate-800 uppercase">Reduce Motion</Label>
                          <p className="text-xs text-slate-500 font-bold">Minimize animations</p>
                      </div>
                      <Switch 
                        checked={profile.accessibility.reduceMotion} 
                        onCheckedChange={(c) => updateAccess('reduceMotion', c)}
                      />
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <Label className="font-bold text-slate-800 uppercase flex items-center gap-2">
                              <Volume2 className="w-4 h-4" /> Sound Feedback
                          </Label>
                          <p className="text-xs text-slate-500 font-bold">Play rewards sounds</p>
                      </div>
                      <Switch 
                        checked={profile.accessibility.feedbackSounds} 
                        onCheckedChange={(c) => updateAccess('feedbackSounds', c)}
                      />
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label className="font-bold text-slate-800 uppercase flex items-center gap-2">
                            <Type className="w-4 h-4" /> Font Scale
                        </Label>
                        <span className="text-xs font-bold text-slate-400">{profile.accessibility.fontScale}%</span>
                      </div>
                      <Slider 
                        value={[profile.accessibility.fontScale]} 
                        onValueChange={(v) => updateAccess('fontScale', v[0])}
                        max={150} step={10} min={80} 
                      />
                  </div>

                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <Label className="font-bold text-slate-800 uppercase flex items-center gap-2">
                              <Mic className="w-4 h-4" /> Voice Input
                          </Label>
                          <p className="text-xs text-slate-500 font-bold">Use speech for logging</p>
                      </div>
                      <Switch 
                        checked={profile.accessibility.voiceInput} 
                        onCheckedChange={(c) => updateAccess('voiceInput', c)}
                      />
                  </div>

              </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="border-2 border-slate-200 shadow-sm">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-500 uppercase tracking-wider">
                      <Battery className="w-4 h-4" /> Power Settings
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                          <Label className="font-bold text-slate-800 uppercase">Energy Unit</Label>
                      </div>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                          <button 
                            onClick={() => updateProfile({ energyUnit: 'kcal' })}
                            className={cn(
                                "px-4 py-1.5 rounded text-xs font-black uppercase transition-all",
                                profile.energyUnit === 'kcal' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                              kcal
                          </button>
                          <button 
                             onClick={() => updateProfile({ energyUnit: 'kJ' })}
                             className={cn(
                                "px-4 py-1.5 rounded text-xs font-black uppercase transition-all",
                                profile.energyUnit === 'kJ' ? "bg-white shadow-sm text-slate-900" : "text-slate-400 hover:text-slate-600"
                            )}
                          >
                              kJ
                          </button>
                      </div>
                  </div>
              </CardContent>
          </Card>

          {/* Pro Features Stub */}
          <Card className="border-2 border-slate-900 bg-slate-900 text-white shadow-xl">
              <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                      <h3 className="font-black uppercase text-lg text-yellow-400 flex items-center gap-2">
                          <Lock className="w-5 h-5" /> Pro Mode
                      </h3>
                      <p className="text-slate-400 text-xs font-bold uppercase">Unlock AI Analysis & Cloud Sync</p>
                  </div>
                  <Button className="bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-black uppercase">
                      Upgrade
                  </Button>
              </CardContent>
          </Card>

      </div>
    </div>
  );
};