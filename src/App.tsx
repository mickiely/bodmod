import React, { useState } from 'react';
import { GameProvider, useGame } from './components/context/GameContext';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { ScanView } from './components/scan/ScanView';
import { SOSKit } from './components/profile/SOSKit';
import { FoodHistory } from './components/log/FoodHistory';
import { WellnessHub } from './components/wellness/WellnessHub';
import { Settings } from './components/settings/Settings';
import { Onboarding } from './components/onboarding/Onboarding';
import { Toaster } from './components/ui/sonner';
import { ShoppingList } from './components/shopping/ShoppingList';
import { MoveTracker } from './components/move/MoveTracker';
import { Connections } from './components/connections/Connections';

const MainContent = () => {
  const [demo, setDemo] = useState(() => sessionStorage.getItem('bodmod-demo') === 'yes');
  const { currentView, profile, updateProfile } = useGame();

  if (!profile.onboardingCompleted && !demo) {
      return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-5"><div className="max-w-md w-full space-y-5"><div className="text-indigo-400 font-black tracking-widest">BODMOD</div><h1 className="text-4xl font-black uppercase italic">See it before you set it up.</h1><p className="text-slate-300">Take a free look around. No account, password or personal details.</p><button className="w-full rounded-xl bg-indigo-500 p-4 font-black uppercase" onClick={()=>{sessionStorage.setItem('bodmod-demo','yes');setDemo(true);}}>Try the demo →</button><button className="w-full rounded-xl border border-slate-600 p-4 font-black uppercase" onClick={()=>{sessionStorage.removeItem('bodmod-demo');setDemo(false);updateProfile({onboardingCompleted:false});}}>Set up my BODMOD</button><p className="text-xs text-slate-400">Demo is a preview. No sample data is written to your profile.</p></div></div>;
  }

  switch (currentView) {
    case 'dashboard':
      return (
        <AppShell>
            {demo && <div className="mb-4 rounded-xl bg-indigo-100 border border-indigo-200 p-4 text-indigo-900 font-bold">DEMO MODE · Explore BODMOD. <button className="underline ml-2" onClick={()=>{sessionStorage.removeItem('bodmod-demo');setDemo(false);}}>Set up mine →</button></div>}
            <Dashboard />
        </AppShell>
      );
    case 'scan':
      // Scan view might want to be fullscreen or have minimal shell
      return <ScanView />; 
    case 'profile':
      return (
        <AppShell>
            <SOSKit />
        </AppShell>
      );
    case 'log':
       return (
        <AppShell>
            <FoodHistory />
        </AppShell>
      );
    case 'wellness':
       return (
        <AppShell>
            <WellnessHub />
        </AppShell>
      );
    case 'shopping':
       return <AppShell><ShoppingList /></AppShell>;
    case 'move':
       return <AppShell><MoveTracker /></AppShell>;
    case 'connections':
       return <AppShell><Connections /></AppShell>;
    case 'settings':
       return (
        <AppShell>
            <Settings />
        </AppShell>
      );
    default:
      return (
        <AppShell>
            <Dashboard />
        </AppShell>
      );
  }
};

const App = () => {
  return (
    <GameProvider>
        <MainContent />
        <Toaster position="top-center" />
    </GameProvider>
  );
};

export default App;