import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ShoppingCart, Plus, Trash2, ScanBarcode, Check, WalletCards, Tag } from 'lucide-react';
import { cn } from '../ui/utils';

export const ShoppingList = () => {
  const { shoppingItems, addShoppingItem, toggleShoppingItem, removeShoppingItem, updateShoppingItem, setCurrentView } = useGame();
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(() => Number(localStorage.getItem('bodmod-shopping-budget') || 0));
  const add = () => { addShoppingItem(name); setName(''); };
  const planned = shoppingItems.reduce((sum,i)=>sum + (i.estimatedPrice || 0) * (i.quantity || 1),0);
  const trolley = shoppingItems.filter(i=>i.checked).reduce((sum,i)=>sum + (i.actualPrice ?? i.estimatedPrice ?? 0) * (i.quantity || 1),0);
  const remaining = Math.max(0,budget-trolley);
  const setBudgetValue=(v:number)=>{setBudget(v);localStorage.setItem('bodmod-shopping-budget',String(v));};

  return <div className="space-y-5 pb-24">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-black uppercase italic">Shop</h1><p className="text-slate-500">Plan it. Price it. Scan it. Tick it off.</p></div><ShoppingCart className="w-8 h-8 text-indigo-600"/></div>

    <Card className="bg-slate-900 text-white border-0"><CardContent className="p-5 space-y-4">
      <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase"><WalletCards className="w-4 h-4"/> Shopping Budget</div>
      <div className="grid grid-cols-3 gap-3 text-center"><div><div className="text-xs text-slate-400 uppercase font-bold">Planned</div><div className="font-black text-lg">${planned.toFixed(2)}</div></div><div><div className="text-xs text-slate-400 uppercase font-bold">Trolley</div><div className="font-black text-lg">${trolley.toFixed(2)}</div></div><div><div className="text-xs text-slate-400 uppercase font-bold">Remaining</div><div className="font-black text-lg text-emerald-400">${remaining.toFixed(2)}</div></div></div>
      <div className="flex items-center gap-2"><span className="font-black">$</span><input type="number" min="0" step=".01" value={budget || ''} onChange={e=>setBudgetValue(Number(e.target.value))} placeholder="Set budget" className="w-full rounded-xl bg-white/10 border border-white/20 p-3 text-white font-black"/></div>
    </CardContent></Card>

    <Card><CardContent className="p-4 flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()} placeholder="Add an item…" className="flex-1 rounded-xl border-2 border-slate-200 p-3 font-bold"/><Button onClick={add} className="h-auto"><Plus/></Button></CardContent></Card>
    <Button onClick={()=>setCurrentView('scan')} variant="outline" className="w-full h-14 border-2 font-black uppercase"><ScanBarcode className="mr-2"/> Supermarket Mode — Scan While Shopping</Button>

    <div className="space-y-2">{shoppingItems.length===0 && <div className="text-center p-10 text-slate-400 font-bold">Your planned shopping list is empty.</div>}{shoppingItems.map(item=><div key={item.id} className={cn("rounded-xl border-2 p-4 bg-white space-y-3",item.checked&&"bg-slate-50")}><div className="flex items-center gap-3"><button onClick={()=>toggleShoppingItem(item.id)} className={cn("w-7 h-7 rounded-lg border-2 flex items-center justify-center",item.checked?"bg-emerald-500 border-emerald-500 text-white":"border-slate-300")}>{item.checked&&<Check className="w-4 h-4"/>}</button><div className={cn("flex-1 font-black",item.checked&&"line-through")}>{item.name}</div>{item.special&&<span className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1"><Tag className="w-3 h-3"/> Special</span>}<button onClick={()=>removeShoppingItem(item.id)}><Trash2 className="w-4 h-4 text-slate-400"/></button></div>
      <div className="grid grid-cols-3 gap-2"><input aria-label="Quantity" type="number" min="1" value={item.quantity||1} onChange={e=>updateShoppingItem(item.id,{quantity:Number(e.target.value)})} className="min-w-0 rounded-lg border p-2 text-sm" placeholder="Qty"/><input aria-label="Estimated price" type="number" min="0" step=".01" value={item.estimatedPrice??''} onChange={e=>updateShoppingItem(item.id,{estimatedPrice:Number(e.target.value)})} className="min-w-0 rounded-lg border p-2 text-sm" placeholder="Est. $"/><input aria-label="Actual price" type="number" min="0" step=".01" value={item.actualPrice??''} onChange={e=>updateShoppingItem(item.id,{actualPrice:Number(e.target.value)})} className="min-w-0 rounded-lg border p-2 text-sm" placeholder="Actual $"/></div>
      <div className="flex gap-2 flex-wrap">{(['Woolworths','Coles','IGA','Other'] as const).map(r=><button key={r} onClick={()=>updateShoppingItem(item.id,{retailer:r})} className={cn("px-2 py-1 rounded-lg border text-[10px] font-black uppercase",item.retailer===r?"bg-indigo-50 border-indigo-500 text-indigo-700":"border-slate-200 text-slate-400")}>{r}</button>)}<button onClick={()=>updateShoppingItem(item.id,{special:!item.special})} className={cn("px-2 py-1 rounded-lg border text-[10px] font-black uppercase",item.special?"bg-emerald-50 border-emerald-500 text-emerald-700":"border-slate-200 text-slate-400")}>Special</button></div>
    </div>)}</div>
    <p className="text-xs text-slate-400">Prices entered here are estimates or shelf prices you record. Live retailer specials will be connected through a separate pricing data source.</p>
  </div>;
};