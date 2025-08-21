'use client';
import { useEffect, useState } from 'react';

export default function Subsidies() {
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('open');
  const [q, setQ] = useState('');

  const load = async () => {
    const params = new URLSearchParams({
      municipality: '長野市',
      status,
      ...(q? { q } : {}),
      limit: '24'
    });
    const res = await fetch(`/functions/v1/subsidies?${params.toString()}`);
    const json = await res.json();
    setItems(json.items ?? []);
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [status]);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex gap-2">
        {['open','upcoming','closed','paused'].map(v=>(
          <button key={v} onClick={()=>setStatus(v)}
            className={`px-3 py-2 rounded-xl border ${status===v?'bg-black text-white':''}`}>
            {v}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="検索" className="border rounded-xl px-3"/>
          <button onClick={load} className="px-3 py-2 rounded-xl border">検索</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it=>(
          <div key={it.id} className="rounded-2xl border p-4">
            <div className="font-semibold text-lg">{it.title_ja}</div>
            <p className="text-sm mt-1 line-clamp-3">{it.summary_ja}</p>
            <div className="mt-3 text-sm opacity-70">
              上限: {it.amount_max ?? '—'} / 締切: {it.application_end ?? '随時'} / {it.status}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
