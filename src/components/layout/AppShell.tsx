import React from 'react';
import { useGame } from '../context/GameContext';
import { LayoutDashboard, History, ScanBarcode, HeartPulse, UserCircle, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const { currentView, setCurrentView, profile } = useGame();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Loot', icon: ScanBarcode },
    { id: 'log', label: 'Food Log', icon: History },
    { id: 'wellness', label: 'Wellness', icon: HeartPulse },
    { id: 'profile', label: 'SOS Kit', icon: UserCircle },
  ];

  const NavContent = ({ mobile = false, onItemClick }: { mobile?: boolean, onItemClick?: () => void }) => (
    <div className={cn("flex flex-col h-full", mobile ? "py-4" : "py-6")}>
      <div className={cn("flex items-center gap-3 px-6 mb-8", mobile && "mb-6")}>
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-indigo-200 shadow-lg border-2 border-indigo-500">
            B
        </div>
        <span className="font-black text-xl tracking-tighter uppercase italic text-slate-800">
            BOD<span className="text-indigo-600">MOD</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
           const isActive = currentView === item.id;
           const Icon = item.icon;
           return (
             <button
               key={item.id}
               onClick={() => {
                   setCurrentView(item.id);
                   if (onItemClick) onItemClick();
               }}
               className={cn(
                 "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group font-bold uppercase tracking-wide text-sm",
                 isActive 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200 transform scale-105" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
               )}
             >
               <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={2.5} />
               {item.label}
             </button>
           );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button 
            onClick={() => {
                setCurrentView('settings');
                if (onItemClick) onItemClick();
            }}
            className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-colors",
                currentView === 'settings' ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
        >
            <Settings className="w-5 h-5" />
            Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col h-screen sticky top-0 z-30">
        <NavContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-black text-lg border-2 border-indigo-500">B</div>
                <span className="font-black text-lg tracking-tighter uppercase italic text-slate-800">BODMOD</span>
            </div>
            
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6 text-slate-700" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <NavContent mobile onItemClick={() => {}} />
                </SheetContent>
            </Sheet>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto w-full">
                {children}
            </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-30 pb-safe">
             {navItems.slice(0, 4).map((item) => {
                 const isActive = currentView === item.id;
                 const Icon = item.icon;
                 return (
                     <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                            isActive ? "text-indigo-600 bg-indigo-50" : "text-slate-400"
                        )}
                     >
                        <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                        <span className="text-[10px] font-bold uppercase">{item.label.split(' ')[0]}</span>
                     </button>
                 )
             })}
             <button
                onClick={() => setCurrentView('profile')}
                className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                    currentView === 'profile' ? "text-indigo-600 bg-indigo-50" : "text-slate-400"
                )}
             >
                <UserCircle className={cn("w-6 h-6", currentView === 'profile' && "fill-current")} />
                <span className="text-[10px] font-bold uppercase">SOS</span>
             </button>
        </div>

      </main>
    </div>
  );
};