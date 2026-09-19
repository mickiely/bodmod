import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Sun, Moon, Zap, Coffee, CloudRain, Smile, Meh, Frown, Save } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

export const WellnessHub = () => {
  const { addMood, setCurrentView } = useGame();
  const [moodScore, setMoodScore] = useState([50]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const dailyTags = [
    { id: 'tired', label: 'Tired', icon: Moon },
    { id: 'energetic', label: 'Energized', icon: Zap },
    { id: 'stressed', label: 'Stressed', icon: CloudRain },
    { id: 'focused', label: 'Focused', icon: Coffee },
  ];
  
  const toggleTag = (id: string) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleSave = () => {
      addMood({
          id: Date.now().toString(),
          timestamp: new Date(),
          score: moodScore[0],
          journal: selectedTags.join(',')
      });
      toast.success("Mood Checked. +5 Momentum");
      setCurrentView('dashboard');
  };

  const getMoodIcon = (val: number) => {
      if (val < 30) return <Frown className="w-16 h-16 text-indigo-400" />;
      if (val < 70) return <Meh className="w-16 h-16 text-indigo-400" />;
      return <Smile className="w-16 h-16 text-indigo-400" />;
  };

  return (
    <div className="space-y-6 pb-24 h-full flex flex-col justify-center max-w-lg mx-auto">
        
        <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-black uppercase italic text-slate-900">System Check</h1>
            <p className="text-slate-500 font-medium">How is your engine running?</p>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl overflow-visible">
            <CardContent className="p-8 space-y-10">
                
                {/* Mood Slider */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center animate-bounce-slow">
                        {getMoodIcon(moodScore[0])}
                    </div>
                    <div className="px-4">
                        <Slider 
                            value={moodScore} 
                            onValueChange={setMoodScore} 
                            max={100} 
                            step={1}
                            className="py-4"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-black uppercase text-slate-300 px-2">
                        <span>Low Energy</span>
                        <span>High Energy</span>
                    </div>
                </div>

                {/* Tags */}
                <div className="grid grid-cols-2 gap-3">
                    {dailyTags.map(tag => {
                        const Icon = tag.icon;
                        const isActive = selectedTags.includes(tag.id);
                        return (
                            <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={cn(
                                    "p-4 rounded-xl border-2 flex items-center justify-center gap-2 transition-all",
                                    isActive 
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-600 shadow-md" 
                                        : "bg-white border-slate-200 text-slate-400 hover:border-indigo-200"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-bold uppercase text-xs">{tag.label}</span>
                            </button>
                        )
                    })}
                </div>

                <Button 
                    className="w-full h-14 bg-indigo-600 text-white font-black uppercase text-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200"
                    onClick={handleSave}
                >
                    Save Check-in
                </Button>

            </CardContent>
        </Card>

    </div>
  );
};