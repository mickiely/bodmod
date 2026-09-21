import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// --- Types ---

export type UnitSystem = 'metric' | 'imperial';
export type EnergyUnit = 'kcal' | 'kJ';

export interface AccessibilitySettings {
  fontScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
  feedbackSounds: boolean;
  voiceInput: boolean;
}

export interface PersonalProfile {
  displayName: string;
  units: UnitSystem;
  energyUnit: EnergyUnit;
  allergies: string[];
  conditions: string[];
  dietPreferences: string[];
  goal: string;
  momentum: number; // 0-100
  streak: number;
  onboardingCompleted: boolean;
  accessibility: AccessibilitySettings;
}

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
  type: 'scan' | 'log' | 'mood';
  rewardMomentum: number;
}

export interface FoodLogEntry {
  id: string;
  timestamp: Date;
  foodName: string;
  isSafe: boolean;
  reason?: string;
  nutrition: {
    fat: number;
    sugar: number;
    salt: number;
    protein: number;
    calories: number;
  };
}

export interface MoodEntry {
  id: string;
  timestamp: Date;
  score: number; // 0-100
  journal?: string;
}

// --- Default Data ---

const defaultAccessibility: AccessibilitySettings = {
  fontScale: 100,
  highContrast: false,
  reduceMotion: false,
  feedbackSounds: true,
  voiceInput: false,
};

const defaultProfile: PersonalProfile = {
  displayName: "Player 1",
  units: 'metric',
  energyUnit: 'kcal',
  allergies: [],
  conditions: [],
  dietPreferences: [],
  goal: "Eat safer",
  momentum: 30, // Start with some momentum
  streak: 0,
  onboardingCompleted: false,
  accessibility: defaultAccessibility,
};

const defaultMissions: Mission[] = [
  { id: '1', title: 'Scan 1 Item', completed: false, type: 'scan', rewardMomentum: 15 },
  { id: '2', title: 'Log 1 Meal', completed: false, type: 'log', rewardMomentum: 20 },
  { id: '3', title: 'Mood Check-in', completed: false, type: 'mood', rewardMomentum: 10 },
];

// --- Context ---

interface GameContextType {
  profile: PersonalProfile;
  updateProfile: (updates: Partial<PersonalProfile>) => void;
  missions: Mission[];
  completeMission: (id: string) => void;
  logs: FoodLogEntry[];
  addLog: (entry: FoodLogEntry) => void;
  moodLogs: MoodEntry[];
  addMood: (entry: MoodEntry) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  addMomentum: (amount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<PersonalProfile>(() => {
    try {
      const saved = localStorage.getItem('bodmod-profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch { return defaultProfile; }
  });
  const [missions, setMissions] = useState<Mission[]>(defaultMissions);
  const [logs, setLogs] = useState<FoodLogEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('bodmod-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<PersonalProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addMomentum = (amount: number) => {
    setProfile(prev => ({ 
      ...prev, 
      momentum: Math.min(prev.momentum + amount, 100) 
    }));
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.completed) {
        addMomentum(m.rewardMomentum);
        return { ...m, completed: true };
      }
      return m;
    }));
  };

  const addLog = (entry: FoodLogEntry) => {
    setLogs(prev => [entry, ...prev]);
    addMomentum(5); // Small reward for logging
    
    // Check for 'scan' or 'log' missions
    const logMission = missions.find(m => m.type === 'log' && !m.completed);
    if (logMission) completeMission(logMission.id);
    
    // If it was scanned (implied by workflow usually), maybe trigger scan mission too? 
    // For now, let's assume 'scan' mission is triggered separately or if 'addLog' is called from scan view
  };

  const addMood = (entry: MoodEntry) => {
      setMoodLogs(prev => [entry, ...prev]);
      addMomentum(5);
      
      const moodMission = missions.find(m => m.type === 'mood' && !m.completed);
      if (moodMission) completeMission(moodMission.id);
  };

  return (
    <GameContext.Provider value={{
      profile,
      updateProfile,
      missions,
      completeMission,
      logs,
      addLog,
      moodLogs,
      addMood,
      currentView,
      setCurrentView,
      addMomentum
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};