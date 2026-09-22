import React from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Watch, Activity, CircleDot, Scale, HeartPulse, Footprints } from 'lucide-react';

const devices=[
 {name:'Apple Health / Watch',status:'Native stage',detail:'HealthKit bridge for workouts, steps, energy, heart rate and sleep.',icon:Watch},
 {name:'Fitbit',status:'OAuth integration',detail:'Web API path for activity and wearable data.',icon:Activity},
 {name:'Garmin Connect',status:'Approval required',detail:'Activity + health data after Garmin developer approval.',icon:Watch},
 {name:'WHOOP',status:'OAuth integration',detail:'Recovery, sleep, workouts, HRV and resting heart rate.',icon:HeartPulse},
 {name:'Oura Ring',status:'OAuth integration',detail:'Sleep, activity, readiness, heart rate and workouts.',icon:CircleDot},
 {name:'Withings',status:'Planned',detail:'Useful for weight and body-composition measurements.',icon:Scale},
];

export const Connections=()=>{const {setCurrentView}=useGame();return <div className="space-y-5 pb-24"><div><h1 className="text-3xl font-black uppercase italic">Connect Your Gear</h1><p className="text-slate-500">Let your devices measure. Let BODMOD decide what to do next.</p></div>
<Card className="border-2 border-emerald-200 bg-emerald-50"><CardContent className="p-5 flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><Footprints/></div><div className="flex-1"><div className="text-xs font-black uppercase text-emerald-700">Available now</div><div className="font-black text-lg">BODMOD GPS</div><div className="text-sm text-emerald-800">Walk, run and ride tracking with distance, pace and estimated energy.</div></div><Button onClick={()=>setCurrentView('move')} className="font-black uppercase">Track</Button></CardContent></Card>
<div className="grid md:grid-cols-2 gap-3">{devices.map(d=>{const Icon=d.icon;return <Card key={d.name} className="border-2"><CardContent className="p-5 flex gap-4"><div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"><Icon className="w-5 h-5"/></div><div><div className="font-black">{d.name}</div><div className="text-[10px] font-black uppercase text-indigo-600 mb-1">{d.status}</div><div className="text-sm text-slate-500">{d.detail}</div></div></CardContent></Card>})}</div>
<div className="rounded-xl bg-slate-900 text-white p-5"><div className="text-xs font-black uppercase text-indigo-300">BODMOD Data Layer</div><p className="mt-2 text-sm text-slate-300">Connected sources will be normalised into one activity record: steps, distance, workout duration, energy, heart rate, sleep and recovery where the source provides them. Next Move can then avoid recommending work you've already done.</p></div>
<p className="text-xs text-slate-400">External device connections are shown as integration targets, not as active connections. BODMOD will only access data after explicit user permission.</p></div>;};