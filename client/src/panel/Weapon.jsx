import { useWeapon } from "../context/WeaponContext";
import Slider from "../components/Slider";
import { useState, useMemo } from "react";
import { getWeaponImageUrl } from "../utils/weapon";
import WeaponCard from "../components/WeaponCard"
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle }  from '@headlessui/react'

export default function Weapon() {

  const {
    weapons, loading, error,
    currentWeapon, setCurrentWeapon,
    weaponLevel, setWeaponLevel,
    refine, setRefine
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
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-between w-full px-5'>
                <p className='text-xl font-semibold text-[var(--color-highlight)]'>{currentWeapon.name}</p>
                <div className='flex'>
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
