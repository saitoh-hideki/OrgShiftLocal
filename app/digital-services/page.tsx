'use client';
import { useEffect, useState } from 'react';

export default function DigitalServices() {
  const [items, setItems] = useState<any[]>([]);
  const [channel, setChannel] = useState('');
  const [q, setQ] = useState('');

  const load = async () => {
    const params = new URLSearchParams({
      municipality: '長野市',
      ...(channel? { channel } : {}),
      ...(q? { q } : {}),
      limit: '24'
    });
    const res = await fetch(`/functions/v1/digital-services?${params.toString()}`);
    const json = await res.json();
    setItems(json.items ?? []);
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [channel]);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-4">
      <div className="flex gap-2">
        {['','LINE','iOS','Android','Web'].map(v=>(
          <button key={v} onClick={()=>setChannel(v)}
            className={`px-3 py-2 rounded-xl border ${channel===v?'bg-black text-white':''}`}>
            {v || 'All'}
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
            <div className="text-sm opacity-60">{it.channel_type}</div>
            <div className="font-semibold text-lg">{it.title_ja}</div>
            <p className="text-sm mt-1">{it.summary_ja}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              {it.add_friend_url && <a href={it.add_friend_url} className="px-3 py-2 rounded-xl border" target="_blank">友だち追加</a>}
              {it.app_store_url && <a href={it.app_store_url} className="px-3 py-2 rounded-xl border" target="_blank">App Store</a>}
              {it.play_store_url && <a href={it.play_store_url} className="px-3 py-2 rounded-xl border" target="_blank">Google Play</a>}
              {it.service_url && <a href={it.service_url} className="px-3 py-2 rounded-xl border" target="_blank">Web</a>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
