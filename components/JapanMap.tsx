'use client';
import { memo, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import { PREFS } from '@/data/prefectures';

const TOPO_URL = '/japan.topo.json'; // public/ に配置

export default memo(function JapanMap() {
  const router = useRouter();
  const hoverStyle = { fill: '#3A9BDC', stroke: '#1B1B1B', outline: 'none' };
  const defStyle   = { fill: '#E6EBEE', stroke: '#9aa4ae', outline: 'none' };
  const click = (nameJa: string) => router.push(`/?pref=${encodeURIComponent(nameJa)}`);

  return (
    <div className="w-full rounded-2xl bg-white border border-slate-200 p-3">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 900, center: [137.0, 37.5] }}>
        <Geographies geography={TOPO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nameJa = (geo.properties as any).name_ja || (geo.properties as any).nam_ja || (geo.properties as any).name || '';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => click(nameJa)}
                  style={{
                    default: defStyle,
                    hover: hoverStyle,
                    pressed: hoverStyle,
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <div className="text-xs text-slate-500 px-2">地図をクリックして都道府県を選択</div>
    </div>
  );
});
