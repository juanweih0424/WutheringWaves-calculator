import { useWeapon } from "../context/WeaponContext";
import Slider from "../components/Slider";
import { useState, useMemo } from "react";
import { getWeaponImageUrl } from "../utils/weapon";
import WeaponCard from "../components/WeaponCard"
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle }  from '@headlessui/react'
import { useEffectiveStats } from "../hooks/useEffectiveStats";

export default function Weapon() {

  const {
    weapons, loading, error,
    currentWeapon, setCurrentWeapon,
    weaponLevel, setWeaponLevel,
    refine, setRefine, weaponPassive, stacks, setStacks,weaponStats
  } = useWeapon();

  const [isOpen, setIsOpen] = useState(false);

  const handlePick = (r) => {
    setCurrentWeapon(r);     
    setIsOpen(false);   
  };

  const { avatar } = useMemo(() => {
    if (!currentWeapon) return { avatar: null };

    return {
      avatar: getWeaponImageUrl(currentWeapon.icon),
    };
  }, [currentWeapon]);

  if (loading) return <div className="p-4">Loading weapons…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  
  const subKeyLabels = {
    atk: "ATK",
    hp: "HP",
    def: "DEF",
    cr: "Crit. Rate",
    cd: "Crit. Dmg",
    er: "Energy Regen"
  };
  return (
    <div className="p-4 space-y-4">
      <div className='flex justify-center items-center'>
        <button onClick={() => setIsOpen(true)} className='w-35 h-35 border-1 rounded-full border-amber-400 cursor-pointer transition-transform hover:scale-110 duration-300 ease-in-out'>
        {currentWeapon ? (
            <img src={avatar} className="w-full h-full rounded-full" />
          ) : (
          <span>Select a Weapon</span>)}
        </button>
         {currentWeapon ? (
            <div className='flex flex-col items-center h-full'>
              <div className='flex flex-col items-center justify-between xl:min-w-md px-5 gap-2'>
                <p className='text-xl font-semibold text-[var(--color-highlight)]'>{currentWeapon.name}</p>
                <div className="flex justify-between w-full bg-gray-500/20 p-2 rounded-xl">
                  <p>ATK </p>
                  <p>{weaponStats.atk}</p>
                </div>
                <div className="flex justify-between w-full bg-gray-500/20 p-2 rounded-xl">
                  <p>{subKeyLabels[weaponStats.subKey]} </p>
                  <p>{(weaponStats.subValue * 100).toFixed(2)}%</p>
                </div>
                
              </div>
            </div>
            ):(
              null
            )}       
      </div>
      {currentWeapon? (<div className='border-0 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 '>
        
        <Slider
          label="Level"
          value={weaponLevel}
          onChange={setWeaponLevel}
          min={1}
          max={90}
          step={1}
          className=""
        />

        <Slider
          label="Refinement"
          value={refine}
          onChange={setRefine}
          min={1}
          max={5}
          step={1}
          className=""
        />
      </div>) : (null)}
      { currentWeapon?.passive?.stack ? (<div className='border-0 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 gap-2'>
        <p className="font-semibold text-lg text-[var(--color-highlight)]">{weaponPassive.name}</p>
        <p>{weaponPassive.description}</p>
        {weaponPassive.stacksMax > 0 && (<div className="flex gap-2 items-center">
          <label className="text-[var(--color-highlight)]">Stacks:</label>
          <input
          type="number"
          min={0}
          max={weaponPassive.stacksMax}
          value={stacks}
          onChange={(e) => setStacks(Number(e.target.value))}
          className="w-12 h-10 rounded bg-black/10 p-1"
        />
          <p>Max Stacks: {weaponPassive.stacksMax}</p>
        </div>)}
      </div>) : (null)}

      { currentWeapon?.passive && currentWeapon.passive.stack === false ? (<div className='border-0 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 gap-2'>
        <p className="font-semibold text-lg text-[var(--color-highlight)]">{weaponPassive.name}</p>
        <p>{weaponPassive.description}</p>
      </div>) : (null)}



      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
              className="
                relative
                w-2/3
                max-h-[85vh]
                overflow-y-auto         
                rounded-2xl bg-[var(--color-bg)] p-12
                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6
              "
            >
              <button type="button" onClick={() => setIsOpen(false)} className="absolute top-3 right-3 rounded-full p-2 hover:bg-black/10 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6">                    
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>                 
              </button>
              {weapons.map((w) => (
                 <WeaponCard key={w.slug ?? w.name} weapon={w} onSelect={() => handlePick(w)} />
              ))}
            </DialogPanel>
          </div>
        </Dialog>
    </div>
  );
  
}
