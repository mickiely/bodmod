import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/button';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <>{children}</>;
  if (!ready) return <div className="min-h-screen grid place-items-center font-black">LOADING BODMOD…</div>;
  if (session) return <>{children}</>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMessage('');
    if (!supabase) return;
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setMessage(result.error.message);
    else if (mode === 'signup' && !result.data.session) setMessage('Check your email to confirm your BODMOD account.');
  };

  return <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-6">
    <div className="w-full max-w-md">
      <div className="mb-8"><div className="text-indigo-400 font-black tracking-widest text-sm">BODMOD</div><h1 className="text-4xl font-black italic uppercase mt-2">{mode === 'signin' ? 'Welcome back' : 'Create your profile'}</h1><p className="text-slate-400 mt-2">Your momentum. Your data. Your BODMOD.</p></div>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4 outline-none focus:border-indigo-500" type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl bg-slate-900 border border-slate-700 p-4 outline-none focus:border-indigo-500" type="password" required minLength={6} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 font-black uppercase">{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
      </form>
      {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}
      <button className="mt-6 text-sm text-slate-400 hover:text-white" onClick={()=>{setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage('')}}>{mode === 'signin' ? 'New to BODMOD? Create account' : 'Already have an account? Sign in'}</button>
    </div>
  </div>;
};
