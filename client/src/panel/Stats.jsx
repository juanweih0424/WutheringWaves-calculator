import React, {useEffect} from 'react'
import { useStats } from '../hooks/useStats'
import { getIconForStat, statsMeta } from '../utils/statsMeta';
import { useResonator } from '../context/ResonatorContext';

export default function Stats() {
    const s = useStats();
    
    const {current} = useResonator();
    if (!s) return null;


    const values = {
        atk: s.atk, hp: s.hp, def: s.def,
        cr: s.cr, cd: s.cd, er: s.er,
        baDmg: s.baDmg, haDmg: s.haDmg, skill: s.skill, ult: s.ult,
        glacio: s.glacio, fusion: s.fusion, electro: s.electro,
        spectro: s.spectro, havoc: s.havoc, aero: s.aero, heal: s.heal,
        allAmp: s.allAmp, echoDmg: s.echoDmg, defIgnore: s.defIgnore, defIgnoreScope:s.defIgnoreScope, aeroShred: s.aeroShred, havocShred:s.havocShred
    };


  return (
    <div className='shadow-xl border-0 m-4 p-4 rounded-2xl'>
        <p className='text-xl text-[var(--color-highlight)] font-semibold text-center mb-4'>{current.name} Main Stats</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statsMeta.map(({ key, label, fmt, isElement }) => {
            const raw = values[key];
            const display = raw == null ? "—" : fmt(raw);
            const icon = getIconForStat(key);

            const iconClass = [
            "h-9 w-9 object-contain",
            !isElement && "filter brightness-[var(--color-img)]"
            ].filter(Boolean).join(" ");
            return (
                <div key={key} className="flex items-center gap-3 rounded-xl bg-gray-600/25 px-3 py-2">
                    {icon && <img src={icon} alt="" className={iconClass} />}
                    <div className="min-w-0">
                    <div className="text-xs opacity-70 truncate lg:text-sm">{label}</div>
                    <div className="font-semibold truncate">{display}</div>
                    </div>
                </div>
            );
        })}
        </div>
    </div>
  );
}
