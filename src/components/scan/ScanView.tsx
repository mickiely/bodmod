import React, { useState } from 'react';
import { useGame, FoodLogEntry } from '../context/GameContext';
import { ScanBarcode, Zap, X, Check, Search, Save, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'motion/react';
import { PowerBars } from '../shared/PowerBars';
import { Card } from '../ui/card';
import { toast } from 'sonner';
import { cn } from '../ui/utils';

const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Mega Crunch Chips',
    nutrition: { fat: 12, sugar: 2, salt: 1.5, protein: 4, calories: 150 },
    allergens: ['Peanuts'], 
    image: 'https://images.unsplash.com/photo-1566478919030-2609e87012bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'p2',
    name: 'Oat Power Bar',
    nutrition: { fat: 4, sugar: 8, salt: 0.1, protein: 12, calories: 180 },
    allergens: ['Oats'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'p3',
    name: 'Greek Yogurt',
    nutrition: { fat: 0, sugar: 4, salt: 0.1, protein: 15, calories: 90 },
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  },
  {
    id: 'p4',
    name: 'Apple',
    nutrition: { fat: 0, sugar: 10, salt: 0, protein: 0, calories: 50 },
    allergens: [],
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  }
];

export const ScanView = () => {
  const { profile, addLog, setCurrentView } = useGame();
  const [step, setStep] = useState<'camera' | 'scanning' | 'result'>('camera');
  const [scanResult, setScanResult] = useState<typeof MOCK_PRODUCTS[0] | null>(null);

  const handleScan = () => {
    setStep('scanning');
    // Simulate scan delay
    setTimeout(() => {
        const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
        setScanResult(product);
        setStep('result');
    }, 1500);
  };

  const checkSafety = (product: typeof MOCK_PRODUCTS[0]) => {
    const conflicts = product.allergens.filter(a => profile.allergies.includes(a));
    const isSafe = conflicts.length === 0;
    return { isSafe, conflicts };
  };

  const handleLog = () => {
    if (!scanResult) return;
    const { isSafe, conflicts } = checkSafety(scanResult);

    const entry: FoodLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        foodName: scanResult.name,
        isSafe,
        reason: conflicts.join(', '),
        nutrition: scanResult.nutrition
    };

    addLog(entry);
    toast.success("Logged! +5 Momentum", {
        className: 'bg-indigo-600 text-white border-0 font-bold uppercase'
    });
    setCurrentView('dashboard');
  };

  // --- Views ---

  if (step === 'camera') {
    return (
        <div className="flex flex-col h-full bg-black text-white relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 left-4 z-20 text-white hover:bg-white/20"
                onClick={() => setCurrentView('dashboard')}
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>

            {/* Camera Viewport */}
            <div className="flex-1 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574')] bg-cover bg-center opacity-40" />
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-xs aspect-square border-4 border-white/30 rounded-3xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl -mt-1 -ml-1" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl -mt-1 -mr-1" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl -mb-1 -ml-1" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl -mb-1 -mr-1" />
                        
                        <div className="w-full h-0.5 bg-red-500 absolute top-1/2 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-[scan-line_2s_ease-in-out_infinite]" />
                    </div>
                    <p className="mt-8 font-mono text-xs uppercase tracking-widest text-white/70">Align code within frame</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-black p-8 pb-12 flex flex-col items-center gap-6 rounded-t-3xl -mt-6 z-10">
                <Button 
                    size="lg" 
                    className="w-20 h-20 rounded-full bg-white text-black hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] p-0 flex items-center justify-center"
                    onClick={handleScan}
                >
                    <ScanBarcode className="w-8 h-8 stroke-[2.5]" />
                </Button>
                <Button variant="link" className="text-slate-400 font-bold uppercase tracking-wider text-xs">
                    Or search manually
                </Button>
            </div>
        </div>
    );
  }

  if (step === 'scanning') {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center space-y-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-spin-slow border-t-transparent" />
                <Zap className="w-12 h-12 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2 font-mono">Analyzing</h2>
                <p className="text-slate-400 font-medium text-sm">Checking against SOS Kit...</p>
            </div>
        </div>
    );
  }

  if (step === 'result' && scanResult) {
      const { isSafe, conflicts } = checkSafety(scanResult);
      
      return (
          <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
             
             {/* Header Image Area */}
             <div className="h-64 relative bg-slate-900 shrink-0">
                  <img src={scanResult.image} className="w-full h-full object-cover opacity-60" alt={scanResult.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h1 className="text-3xl font-black text-white uppercase italic leading-none mb-1">{scanResult.name}</h1>
                      <p className="text-slate-300 font-bold text-sm uppercase">1 Serving • {scanResult.nutrition.calories} kcal</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 left-4 text-white hover:bg-white/20"
                    onClick={() => { setStep('camera'); setScanResult(null); }}
                  >
                      <ArrowLeft className="w-6 h-6" />
                  </Button>
             </div>

             {/* Result Content */}
             <div className="flex-1 overflow-y-auto -mt-6 rounded-t-3xl bg-slate-50 relative z-10 p-6 space-y-6 pb-32">
                 
                 {/* Big Status Card */}
                 <div className={cn(
                     "p-6 rounded-2xl border-l-8 shadow-lg flex items-start gap-4",
                     isSafe 
                        ? "bg-white border-emerald-500" 
                        : "bg-red-50 border-red-500"
                 )}>
                      <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                          isSafe ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      )}>
                          {isSafe ? <Check className="w-8 h-8 stroke-[3]" /> : <X className="w-8 h-8 stroke-[3]" />}
                      </div>
                      <div>
                          <h2 className={cn(
                              "text-2xl font-black uppercase tracking-tight leading-none mb-1",
                              isSafe ? "text-emerald-800" : "text-red-800"
                          )}>
                              {isSafe ? "Safe to Eat" : "Conflict Found"}
                          </h2>
                          <p className={cn(
                              "font-bold text-sm",
                              isSafe ? "text-emerald-600" : "text-red-600"
                          )}>
                              {isSafe ? "No flags in SOS Kit." : `Contains ${conflicts.join(', ').toUpperCase()}`}
                          </p>
                      </div>
                 </div>

                 {/* Stats HUD */}
                 <div className="space-y-3">
                     <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider">Power Bars</h3>
                     <PowerBars nutrition={scanResult.nutrition} />
                 </div>

             </div>

             {/* Floating Action Bar */}
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 pb-safe">
                 <div className="grid grid-cols-[1fr_2fr] gap-4 max-w-md mx-auto">
                     <Button variant="outline" className="h-14 font-bold uppercase border-2 text-slate-500 hover:text-slate-900" onClick={() => setCurrentView('dashboard')}>
                         Close
                     </Button>
                     <Button 
                        className={cn(
                            "h-14 font-black uppercase text-lg shadow-xl",
                            isSafe ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-800 hover:bg-slate-900"
                        )}
                        onClick={handleLog}
                     >
                         <Save className="w-5 h-5 mr-2" />
                         {isSafe ? "Log It" : "Log Anyway"}
                     </Button>
                 </div>
             </div>

          </div>
      );
  }

  return null;
};