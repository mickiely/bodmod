import React from 'react';
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
import { AuthGate } from './components/auth/AuthGate';

const MainContent = () => {
  const { currentView, profile } = useGame();

  if (!profile.onboardingCompleted) {
      return <Onboarding />;
  }

  switch (currentView) {
    case 'dashboard':
      return (
        <AppShell>
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
    <AuthGate>
      <GameProvider>
        <MainContent />
        <Toaster position="top-center" />
      </GameProvider>
    </AuthGate>
  );
};

export default App;