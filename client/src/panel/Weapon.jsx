import { useState,useMemo } from 'react'
import { useWeapon } from '../context/WeaponContext'
import { getWeaponImageUrl } from '../utils/weapon';
import Slider from '../components/Slider';
import WeaponModal from '../modals/WeaponModal';

const SUB_LABEL = {
    cr: "Crit. Rate",
    cd: "Crit. Damage",
    er: "Energy Regen",
    atk: "ATK%",
    hp: "HP%",
    def: "DEF%"
}

const LABELS = {
  atkPctTm: "Increases Party Members' ATK by ",
  atkPct: "Increases ATK by ",
  hpPct: "Increases HP by ",
  baDmg: "Increases Basic Attack DMG by ",
  baDmgStack: "Increases Basic Attack DMG by ",
  haDmg: "Increases Heavy Attack DMG by ",
  defIgnore: "Ignore Enemy Defense by ",
  er:"Increases Energy Regen by ",
  ult:"Increases Resonance Liberation DMG by",
  allAtr: "Increases All Element Attribute DMG by",
  skill: "Increases Resonance Skill DMG by",
  fusion: "Increases Fusion DMG Bonus to all Resonators by",
  frazzle:"Amplifies Spectro Frazzle DMG dealt by ",
  echoDmg: "Increases Echo Skill DMG Amplification by ",
  additionalAtk: "When the wielder is not on the field, increases their ATK by an additional",
  frazzleTm: "Casting Outro Skill Amplifies the Spectro Frazzle DMG on targets around the active Resonator by",
  havocShred: "Ignore Enemy Havoc RES by ",
  allAmp: "the DMG taken by the target is Amplified by ",
  aeroAmpTm:" Aero DMG dealt by nearby Resonators on the field is Amplified by",
  cr:"Increases Crit Rate by",
  aeroShred: "Ignore Enemy Aero RES by ",
  aeroBouns : "Increase Aero Bouns by",
  echoDmgAmp: "Amplifies Echo DMG by ",
  haDmgAmp: "Amplifies Heavy Attack DMG by ",
  echoDmgTm: "Increase Teammates Echo Skill DMG by ",
}

const formatSubVal = (type, v) => {
  if (type in SUB_LABEL) return `${v.toFixed(2)}%`;
  return String(v);
}

export default function Weapon() {

    const {currWeap, setCurrWeap, refineLvl, setRefineLvl,
        passiveStack, setPassiveStack,
        currWeapLvl, setCurrWeapLvl,
        weaponStats, passiveStats, enabled, togglePassiveKey,weapons
    } = useWeapon();

    const rank = currWeap?.passive?.ranks?.[refineLvl - 1] ?? {};
    const keys = Object.keys(rank);

    // Handle click behavior in panel
    const [isOpen,setIsOpen] = useState(false);
    const handlePick = (r) => {
        setCurrWeap(r);     
        setIsOpen(false);   
    };

    // UI 
    const {weapon} = useMemo(()=> {
        if (!currWeap) return {weapon:null}

        return {
            weapon:getWeaponImageUrl(currWeap.icon)
        }
    },[currWeap])


  return (
    <div className='pt-8 flex flex-col'>
        <div className='flex justify-center items-center gap-2'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <button onClick={() => setIsOpen(true)} className='w-24 h-24 md:w-30 md:h-30
        lg:w-35 lg:h-35 border-1 rounded-full border-amber-400 cursor-pointer transition-transform hover:scale-105 duration-300 ease-in-out'>
            {currWeap ? (
                <img src={weapon} className="w-full h-full rounded-full" />
                
            ) : (
            <span className='text-sm'>Select a weapon</span>)}
            </button>
            <button onClick={()=>setCurrWeap(null)} className='bg-red-500/70 rounded-xl text-sm px-3 py-1 cursor-pointer hover:bg-red-600/80'>Unequip</button>
          </div>
            
            {currWeap ? (
                <div className='flex flex-col items-center w-[10rem] md:w-md p-4'>
                    <p className='text-sm lg:text-xl font-semibold text-[var(--color-highlight)]'>{currWeap.name}</p>
                    <div className='flex justify-between w-full p-2.5 border-0 shadow-md my-2 bg-gray-500/10 rounded-2xl'>
                        <p className='text-xs lg:text-sm'>ATK</p>
                        <p className='text-xs lg:text-sm'>{(weaponStats.weaponAtk).toFixed(1)}</p>
                    </div>
                    <div className='flex justify-between w-full p-2.5 border-0 shadow-md my-2 bg-gray-500/10 rounded-2xl'>
                        <p className='text-xs lg:text-sm'>{SUB_LABEL[weaponStats.subValType]}</p>
                        <p className='text-xs lg:text-sm'>{(weaponStats.subVal).toFixed(2)}</p>
                    </div>
                </div>
            ): (null)}
        </div>
        {currWeap ? (
            <div className='border flex flex-col shadow-md p-6 rounded-2xl mt-6 mx-4 border-gray-500/30'>
                <Slider
                    label="Level"
                    value={currWeapLvl}
                    onChange={setCurrWeapLvl}
                    min={1}
                    max={90}
                    step={1}
                />
                <Slider
                    label="Refinement"
                    value={refineLvl}
                    onChange={setRefineLvl}
                    min={1}
                    max={5}
                    step={1}
                />
            </div>
        ) : (null)}
        {currWeap? (
            <div className='flex flex-col p-6 mx-4 border-1 shadow-md my-4 rounded-2xl gap-2 border-gray-500/30'>
                <p className='text-[var(--color-highlight)] font-bold text-sm lg:text-base'>{passiveStats.weapPassiveName}</p>
                <div className="text-xs lg:text-sm" dangerouslySetInnerHTML={{ __html: passiveStats.weapPassiveDesc }} />
            </div>
        ):(null)}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4">
      {keys.map((k) => {
        const isStackLine = passiveStats.stackScope === k;
        const percent = (rank[k] * 100).toLocaleString(undefined, { maximumFractionDigits: 2 });
        return (
          <div key={k} className="rounded-xl border-1 p-4 shadow-md border-gray-500/30 flex flex-col">
            <p className="text-sm lg:text-base">
              <span className="text-sm font-semibold">
                {LABELS[k] ?? k}
              </span>{" "}
              <span className="text-[var(--color-highlight)] text-sm">{percent}%</span>
            </p>
            <div className="mt-2 flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!enabled[k]}
                  onChange={() => togglePassiveKey(k)}
                />
                <span className='text-xs opacity-90 lg:text-sm'>Enabled?</span>
              </label>
              {isStackLine && passiveStats.hasStack && (
                <div className="flex items-center gap-2">
                  <span className='text-xs lg:text-sm'>Stacks</span>
                  <input
                    type="number"
                    min={0}
                    max={passiveStats.maxStack}
                    value={passiveStack}
                    onChange={(e) => setPassiveStack(Number(e.target.value || 0))}
                    className="w-12 h-6 lg:w-16 lg:h-8 rounded bg-black/6 px-2"
                    disabled={!enabled[k]}
                  />
                  <span className="text-xs opacity-80">(Max {passiveStats.maxStack})</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
        <WeaponModal open={isOpen} onClose={()=>setIsOpen(false)} onSelect={handlePick}/>
    </div>
  )
}
