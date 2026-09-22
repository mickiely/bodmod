import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// --- Types ---

export type UnitSystem = 'metric' | 'imperial';
export type EnergyUnit = 'kcal' | 'kJ';
export type ExerciseType = 'walking' | 'calisthenics' | 'strength' | 'running' | 'cycling' | 'mobility' | 'swimming' | 'sport';

export interface BodyGoal {
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  age: number;
  targetDate: string;
  weeklyTargetKg: number;
  exerciseTypes: ExerciseType[];
}

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
  bodyGoal: BodyGoal;
  momentum: number; // 0-100
  healthyBank: number; // behavioural reward credits, not calories
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

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  source?: 'manual' | 'scan' | 'recipe';
  quantity?: number;
  estimatedPrice?: number;
  actualPrice?: number;
  retailer?: 'Woolworths' | 'Coles' | 'IGA' | 'Other';
  special?: boolean;
}

export interface SavedRecipe {
  id: string;
  name: string;
  servings: number;
  ingredients: string[];
  favourite: boolean;
  createdAt: string;
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
  goal: "Build momentum",
  bodyGoal: {
    heightCm: 0,
    currentWeightKg: 0,
    targetWeightKg: 0,
    age: 0,
    targetDate: '',
    weeklyTargetKg: 0,
    exerciseTypes: ['walking'],
  },
  momentum: 30, // Start with some momentum
  healthyBank: 0,
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
  savedRecipes: SavedRecipe[];
  addRecipe: (recipe: Omit<SavedRecipe, 'id' | 'createdAt'>) => void;
  removeRecipe: (id: string) => void;
  addRecipeToShopping: (id: string) => void;
  shoppingItems: ShoppingItem[];
  addShoppingItem: (name: string, source?: ShoppingItem['source']) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;
  addMood: (entry: MoodEntry) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  addMomentum: (amount: number) => void;
  addHealthyBank: (amount: number) => void;
  spendHealthyBank: (amount: number) => boolean;
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
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(() => {
    try { return JSON.parse(localStorage.getItem('bodmod-recipes') || '[]'); } catch { return []; }
  });
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('bodmod-shopping') || '[]'); } catch { return []; }
  });
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('bodmod-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('bodmod-shopping', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem('bodmod-recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const updateProfile = (updates: Partial<PersonalProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addMomentum = (amount: number) => {
    setProfile(prev => ({ 
      ...prev, 
      momentum: Math.min(prev.momentum + amount, 100) 
    }));
  };

  const addHealthyBank = (amount: number) => {
    setProfile(prev => ({ ...prev, healthyBank: Math.max(0, (prev.healthyBank || 0) + amount) }));
  };

  const spendHealthyBank = (amount: number) => {
    if ((profile.healthyBank || 0) < amount) return false;
    setProfile(prev => ({ ...prev, healthyBank: Math.max(0, (prev.healthyBank || 0) - amount) }));
    return true;
  };

  const completeMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.completed) {
        addMomentum(m.rewardMomentum);
        addHealthyBank(m.rewardMomentum);
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

  const addShoppingItem = (name: string, source: ShoppingItem['source'] = 'manual') => {
    const clean = name.trim();
    if (!clean) return;
    setShoppingItems(prev => prev.some(i => i.name.toLowerCase() === clean.toLowerCase() && !i.checked) ? prev : [{ id: Date.now().toString(), name: clean, checked: false, source }, ...prev]);
  };
  const toggleShoppingItem = (id: string) => setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const removeShoppingItem = (id: string) => setShoppingItems(prev => prev.filter(i => i.id !== id));
  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => setShoppingItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));

  const addRecipe = (recipe: Omit<SavedRecipe, 'id' | 'createdAt'>) => {
    setSavedRecipes(prev => [{ ...recipe, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]);
  };
  const removeRecipe = (id: string) => setSavedRecipes(prev => prev.filter(r => r.id !== id));
  const addRecipeToShopping = (id: string) => {
    const recipe = savedRecipes.find(r => r.id === id);
    if (!recipe) return;
    recipe.ingredients.forEach(name => addShoppingItem(name, 'recipe'));
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
      savedRecipes,
      addRecipe,
      removeRecipe,
      addRecipeToShopping,
      addMood,
      currentView,
      setCurrentView,
      addMomentum,
      addHealthyBank,
      spendHealthyBank,
      shoppingItems,
      addShoppingItem,
      toggleShoppingItem,
      removeShoppingItem,
      updateShoppingItem
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