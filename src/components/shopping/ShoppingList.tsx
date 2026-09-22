import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ShoppingCart, Plus, Trash2, ScanBarcode, Check } from 'lucide-react';
import { cn } from '../ui/utils';

export const ShoppingList = () => {
  const { shoppingItems, addShoppingItem, toggleShoppingItem, removeShoppingItem, setCurrentView } = useGame();
  const [name, setName] = useState('');
  const add = () => { addShoppingItem(name); setName(''); };
  return <div className="space-y-5 pb-24">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-black uppercase italic">Shopping List</h1><p className="text-slate-500">Plan it. Scan it. Tick it off.</p></div><ShoppingCart className="w-8 h-8 text-indigo-600"/></div>
    <Card><CardContent className="p-4 flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Add an item…" className="flex-1 rounded-xl border-2 border-slate-200 p-3 font-bold"/><Button onClick={add} className="h-auto"><Plus/></Button></CardContent></Card>
    <Button onClick={()=>setCurrentView('scan')} variant="outline" className="w-full h-14 border-2 font-black uppercase"><ScanBarcode className="mr-2"/> Scan while shopping</Button>
    <div className="space-y-2">{shoppingItems.length===0 && <div className="text-center p-10 text-slate-400 font-bold">Your list is empty.</div>}{shoppingItems.map(item=><div key={item.id} className={cn("flex items-center gap-3 rounded-xl border-2 p-4 bg-white",item.checked&&"opacity-50 bg-slate-50")}><button onClick={()=>toggleShoppingItem(item.id)} className={cn("w-7 h-7 rounded-lg border-2 flex items-center justify-center",item.checked?"bg-emerald-500 border-emerald-500 text-white":"border-slate-300")}>{item.checked&&<Check className="w-4 h-4"/>}</button><div className={cn("flex-1 font-black",item.checked&&"line-through")}>{item.name}</div><span className="text-[10px] uppercase font-bold text-slate-400">{item.source}</span><button onClick={()=>removeShoppingItem(item.id)}><Trash2 className="w-4 h-4 text-slate-400"/></button></div>)}</div>
  </div>;
};