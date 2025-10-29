import { useState,useEffect, useMemo } from 'react'
import { getCharacterElementUrl,getCharacterImageUrl,getCharacterWeaponUrl } from '../utils/character.js'
import fourstars from "../assets/images/ui/Icon_4_Stars.webp"
import fivestars from "../assets/images/ui/Icon_5_Stars.webp"
import { useResonator } from "../context/ResonatorContext";
import Slider from '../components/Slider.jsx'
import CharModal from '../modals/CharModal.jsx'
import { tokenizeDescription } from '../utils/formatDescription.js';
import ResonatorBuff from '../components/ResonatorBuff.jsx';

const elementColors = {
  Aero: "#22c55e",  
  Glacio: "#3b82f6", 
  Fusion: "#ed744d",  
  Electro: "#a855f7", 
  Spectro: "#facc15", 
  Havoc: "#94224a",   
};

const STAT_LABEL = {
  atkPct: "ATK %",
  hpPct: "HP %",
  defPct: "DEF %",
  cr: "Crit. Rate",
  cd: "Crit. DMG"
};

const statTitle = (k) =>
  `Stat Bonus: ${STAT_LABEL[k] ?? k}`;

const statDesc = (k, v) => {
  const asPct = (v * 100).toFixed(0);
  switch (k) {
    case "cr": return `Crit. Rate increased by ${asPct}%.`;
    case "cd": return `Crit. DMG increased by ${asPct}%.`;
    case "er": return `Energy Regen increased by ${asPct}%.`;
    case "atkPct": return `ATK increased by ${asPct}%.`;
    case "hpPct": return `HP increased by ${asPct}%.`;
    case "defPct": return `DEF increased by ${asPct}%.`;
    case "atk": return `ATK increased by ${v}.`;
    case "hp":  return `HP increased by ${v}.`;
    case "def": return `DEF increased by ${v}.`;
    default:    return `Value: ${v}`;
  }
};


export default function Resonator() {
  
    // Expose resonator
    const {current,setCurrent,
          level,setLevel,
          basic,setBasic,
          skill,setSkill,
          intro,setIntro,
          ult,setUlt,
          forte,setForte,
          minor, toggleMinor} = useResonator();
    
    // Handle click behavior in panel
    const [isOpen,setIsOpen] = useState(false);
    const handlePick = (r) => {
      setCurrent(r);     
      setIsOpen(false);   
    };

    // UI fetch 
    const { weapon, element, avatar } = useMemo(() => {
      if (!current) return { weapon: null, element: null, avatar: null };

      return {
        weapon: getCharacterWeaponUrl(current.weapon),
        element: getCharacterElementUrl(current.element),
        avatar: getCharacterImageUrl(current.id),
      };
    }, [current]);

    
  return (
    <div className='pt-8 flex flex-col'>
      <div className='flex justify-center items-center'>
        <button onClick={() => setIsOpen(true)} className='w-22 h-22 md:w-30 md:h-30
        lg:w-35 lg:h-35 border-1 rounded-full border-amber-400 cursor-pointer transition-transform hover:scale-110 duration-300 ease-in-out'>
        {current ? (
            <img src={avatar} className="w-full h-full rounded-full" />
          ) : (
          <span>Select a resonator</span>)}
        </button>
         {current ? (
            <div className='flex flex-col items-center'>
              <div className='px-2 flex items-center justify-between w-full lg:px-5'>
                <p className=' lg:text-xl font-semibold text-[var(--color-highlight)]'>{current.name}</p>
                <div className='flex items-center'>
                <img src={element} className='size-8 lg:size-12'/>
                <img src={weapon} className='brightness-[var(--color-img)] size-7 lg:size-10'/>
                </div>
              </div>
              {current.rarity === 5 ? (
                <img src={fivestars} className='w-40 h-13 lg:w-70 lg:h-20 brightness-105'/>
              ) : (
                <img src={fourstars} className='lg:w-70 lg:h-20'/>
              )}
            </div>
            ):(
              null
        )}       
      </div>
      {current? (<div className='border-1 border-gray-500/30 flex flex-col shadow-md p-6 rounded-2xl mt-6 mx-4 '>
        
        <Slider
          label="Level"
          value={level}
          onChange={setLevel}
          min={1}
          max={90}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />
      </div>) : (null)}

      {current? (<div className='border-1 border-gray-500/30 flex flex-col shadow-md p-6 rounded-2xl mt-6 mx-4 mb-4'>
        
        <Slider
          label="Basic Attack"
          value={basic}
          onChange={setBasic}
          min={1}
          max={10}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />

        <Slider
          label="Resonance Skill"
          value={skill}
          onChange={setSkill}
          min={1}
          max={10}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />

        <Slider
          label="Forte Circuit"
          value={forte}
          onChange={setForte}
          min={1}
          max={10}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />

        <Slider
          label="Resonance Liberation"
          value={ult}
          onChange={setUlt}
          min={1}
          max={10}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />

        <Slider
          label="Intro Skill"
          value={intro}
          onChange={setIntro}
          min={1}
          max={10}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />
      </div>) : (null)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-4 mt-4">
        {Object.entries(minor).map(([key, { value, enable }]) => (
          <div
            key={key}
            className="rounded-xl border-1 border-gray-500/30 shadow-md px-4 py-3 flex items-center justify-between hover:border-white/20 transition mb-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold tracking-tight">{statTitle(key)}</p>
              </div>
              <p className="text-xs  opacity-80 mt-0.5">
                {statDesc(key, value)}
              </p>
            </div>
      <label className="ml-6 inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={enable}
          onChange={() => toggleMinor(key)}
          className="peer sr-only"
        />
        <span
          className="
            relative w-11 h-6 rounded-full bg-gray-500 transition-colors
            after:content-[''] after:absolute after:top-0.5 after:left-0.5
            after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow
            after:transition-transform after:duration-200
            peer-checked:bg-emerald-500/70 peer-checked:after:translate-x-5
          "
        />
        <span className="ml-3 text-xs opacity-80 w-16 text-right">
          {enable ? 'Enabled' : 'Disabled'}
        </span>
      </label>
      </div>
      ))}
      </div>
      <ResonatorBuff/>
      <CharModal open={isOpen} onClose={()=>setIsOpen(false)} onSelect={handlePick}/>
    </div>
  )
}
