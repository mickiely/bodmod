import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { PowerBars } from '../shared/PowerBars';
import { Calendar, Filter, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../ui/utils';

export const FoodHistory = () => {
  const { logs } = useGame();
  const [filter, setFilter] = useState<'all' | 'danger'>('all');

  const filteredLogs = filter === 'danger' ? logs.filter(l => !l.isSafe) : logs;

  return (
    <div className="space-y-6 pb-24">
      
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black uppercase italic text-slate-900">Loot History</h1>
          <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="font-bold uppercase text-xs"
              >
                  All
              </Button>
              <Button 
                variant={filter === 'danger' ? 'destructive' : 'outline'}
                onClick={() => setFilter('danger')}
                className="font-bold uppercase text-xs gap-2"
              >
                  <AlertTriangle className="w-3 h-3" /> Conflicts
              </Button>
          </div>
      </div>

      {logs.length === 0 ? (
          <div className="text-center py-20 opacity-50">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-600 uppercase">No data found</h3>
          </div>
      ) : (
          <div className="space-y-4">
              {filteredLogs.map((log) => (
                  <div key={log.id} className="group relative">
                      {/* Connector Line */}
                      <div className="absolute left-6 top-16 bottom-[-1rem] w-0.5 bg-slate-200 group-last:hidden" />
                      
                      <Card className="flex flex-col md:flex-row gap-4 p-4 border-2 border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors">
                          {/* Time / Status Badge */}
                          <div className="flex md:flex-col items-center gap-3 shrink-0 md:w-24">
                              <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md border-2 border-white",
                                  log.isSafe ? "bg-emerald-500" : "bg-red-500"
                              )}>
                                  {log.isSafe ? "OK" : "!"}
                              </div>
                              <div className="text-xs font-bold font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                  {format(log.timestamp, 'HH:mm')}
                              </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <h3 className="font-black text-slate-800 uppercase text-lg truncate">{log.foodName}</h3>
                                      {!log.isSafe && (
                                          <p className="text-red-500 text-xs font-bold uppercase flex items-center gap-1">
                                              <AlertTriangle className="w-3 h-3" /> {log.reason}
                                          </p>
                                      )}
                                  </div>
                                  <div className="text-right">
                                      <span className="block font-black text-slate-900 text-lg">{log.nutrition.calories}</span>
                                      <span className="block text-[10px] font-bold text-slate-400 uppercase">kcal</span>
                                  </div>
                              </div>

                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                   <PowerBars nutrition={log.nutrition} variant="mini" />
                              </div>
                          </div>
                      </Card>
                  </div>
              ))}
          </div>
      )}

    </div>
  );
};