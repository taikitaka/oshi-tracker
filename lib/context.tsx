'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Oshi, Good, Event } from './types';
import { supabase } from './supabase';

type AppContextValue = {
  oshiList: Oshi[];
  goods: Good[];
  events: Event[];
  loading: boolean;
  addOshi: (o: Omit<Oshi, 'id' | 'createdAt'>) => Promise<void>;
  updateOshi: (o: Oshi) => Promise<void>;
  deleteOshi: (id: string) => Promise<void>;
  addGood: (g: Omit<Good, 'id'>) => Promise<void>;
  updateGood: (g: Good) => Promise<void>;
  deleteGood: (id: string) => Promise<void>;
  addEvent: (e: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (e: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

function rowToOshi(r: Record<string, unknown>): Oshi {
  return {
    id: r.id as string,
    name: r.name as string,
    category: r.category as Oshi['category'],
    color: r.color as string,
    imageUrl: r.image_url as string | undefined,
    memo: r.memo as string | undefined,
    createdAt: Number(r.created_at_ms),
  };
}

function rowToGood(r: Record<string, unknown>): Good {
  return {
    id: r.id as string,
    oshiId: r.oshi_id as string,
    name: r.name as string,
    price: Number(r.price),
    date: r.date as string,
    imageUrl: r.image_url as string | undefined,
    memo: r.memo as string | undefined,
  };
}

function rowToEvent(r: Record<string, unknown>): Event {
  return {
    id: r.id as string,
    oshiId: r.oshi_id as string,
    title: r.title as string,
    type: r.type as Event['type'],
    date: r.date as string,
    price: Number(r.price),
    attended: r.attended as boolean,
    memo: r.memo as string | undefined,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [oshiList, setOshiList] = useState<Oshi[]>([]);
  const [goods, setGoods] = useState<Good[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [{ data: od }, { data: gd }, { data: ed }] = await Promise.all([
      supabase.from('oshi').select('*').order('created_at_ms'),
      supabase.from('goods').select('*').order('date', { ascending: false }),
      supabase.from('events').select('*').order('date', { ascending: false }),
    ]);
    if (od) setOshiList(od.map(rowToOshi));
    if (gd) setGoods(gd.map(rowToGood));
    if (ed) setEvents(ed.map(rowToEvent));
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase.channel('oshi-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'oshi' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goods' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <AppContext.Provider value={{
      oshiList, goods, events, loading,
      async addOshi(data) {
        const id = Date.now().toString();
        const now = Date.now();
        const item: Oshi = { ...data, id, createdAt: now };
        setOshiList(p => [...p, item]);
        await supabase.from('oshi').insert({ id, name: data.name, category: data.category, color: data.color, image_url: data.imageUrl ?? null, memo: data.memo ?? null, created_at_ms: now });
      },
      async updateOshi(o) {
        setOshiList(p => p.map(x => x.id === o.id ? o : x));
        await supabase.from('oshi').update({ name: o.name, category: o.category, color: o.color, image_url: o.imageUrl ?? null, memo: o.memo ?? null }).eq('id', o.id);
      },
      async deleteOshi(id) {
        setOshiList(p => p.filter(x => x.id !== id));
        await Promise.all([
          supabase.from('goods').delete().eq('oshi_id', id),
          supabase.from('events').delete().eq('oshi_id', id),
          supabase.from('oshi').delete().eq('id', id),
        ]);
      },
      async addGood(data) {
        const id = Date.now().toString();
        const item: Good = { ...data, id };
        setGoods(p => [item, ...p]);
        await supabase.from('goods').insert({ id, oshi_id: data.oshiId, name: data.name, price: data.price, date: data.date, image_url: data.imageUrl ?? null, memo: data.memo ?? null });
      },
      async updateGood(g) {
        setGoods(p => p.map(x => x.id === g.id ? g : x));
        await supabase.from('goods').update({ name: g.name, price: g.price, date: g.date, image_url: g.imageUrl ?? null, memo: g.memo ?? null }).eq('id', g.id);
      },
      async deleteGood(id) {
        setGoods(p => p.filter(x => x.id !== id));
        await supabase.from('goods').delete().eq('id', id);
      },
      async addEvent(data) {
        const id = Date.now().toString();
        const item: Event = { ...data, id };
        setEvents(p => [item, ...p]);
        await supabase.from('events').insert({ id, oshi_id: data.oshiId, title: data.title, type: data.type, date: data.date, price: data.price, attended: data.attended, memo: data.memo ?? null });
      },
      async updateEvent(e) {
        setEvents(p => p.map(x => x.id === e.id ? e : x));
        await supabase.from('events').update({ title: e.title, type: e.type, date: e.date, price: e.price, attended: e.attended, memo: e.memo ?? null }).eq('id', e.id);
      },
      async deleteEvent(id) {
        setEvents(p => p.filter(x => x.id !== id));
        await supabase.from('events').delete().eq('id', id);
      },
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('Must be inside AppProvider');
  return ctx;
}
