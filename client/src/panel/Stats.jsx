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
        echoDmg: s.echoDmg
    };


  return (
    <div className='shadow-md border-1 border-gray-500/30 m-4 pt-4 px-3 py-2 rounded-xl space-y-4'>
        <p className='text-sm lg:text-lg text-[var(--color-highlight)] font-semibold text-center'>{current.name} Main Stats</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {statsMeta.map(({ key, label, fmt, isElement }, i) => {
            const raw = values[key];
            const display = raw == null ? "—" : fmt(raw);
            const icon = getIconForStat(key);
            const mobileStripe = i % 2 === 1 ? "bg-gray-500/15" : "";

            
            const mdRowStripe = Math.floor(i / 2) % 2 === 1 ? "md:bg-gray-500/15" : "md:bg-transparent";
            const lgRowStripe = Math.floor(i / 3) % 2 === 1 ? "lg:bg-gray-500/15" : "lg:bg-transparent";
            const iconClass = [
            "h-7 w-7 lg:h-9 lg:w-9 object-contain",
            !isElement && "filter brightness-[var(--color-img)]"
            ].filter(Boolean).join(" ");
            return (
                <div key={key} className={`flex items-center gap-3 p-2 w-full ${mobileStripe} ${mdRowStripe} ${lgRowStripe}`}>
                    {icon && <img src={icon} alt="" className={iconClass} />}
                    <div className="min-w-0">
                    <div className="text-xs opacity-80 truncate lg:text-sm">{label}</div>
                    <div className="text-xs  lg:text-base font-semibold truncate">{display}</div>
                    </div>
                </div>
            );
        })}
        </div>
    </div>
  );
}
