import { useState,useEffect, useMemo } from 'react'
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle }  from '@headlessui/react'
import CharacterCard from "../components/CharacterCard.jsx"
import { getCharacterElementUrl,getCharacterImageUrl,getCharacterWeaponUrl } from '../utils/character.js'
import fourstars from "../assets/images/ui/Icon_4_Stars.webp"
import fivestars from "../assets/images/ui/Icon_5_Stars.webp"
import { useResonator } from "../context/ResonatorContext";
import Slider from '../components/Slider.jsx'


const elementColors = {
  Aero: "#22c55e",  
  Glacio: "#3b82f6", 
  Fusion: "#ef4444",  
  Electro: "#a855f7", 
  Spectro: "#facc15", 
  Havoc: "#64748b",   
};

export default function Resonator() {
  const { resonators, loading, error, current, setCurrent,level,setLevel, chain, setChain,basic,setBasic,ult,setUlt, skill, setSkill, forte,setForte, intro,setIntro } = useResonator();
  const [isOpen, setIsOpen] = useState(false);

  const handlePick = (r) => {
    setCurrent(r);     
    setIsOpen(false);   
  };

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
      <div className='flex justify-center'>
        <button onClick={() => setIsOpen(true)} className='w-35 h-35 border-1 rounded-full border-amber-400 cursor-pointer transition-transform hover:scale-110 duration-300 ease-in-out'>
        {current ? (
            <img src={avatar} className="w-full h-full rounded-full" />
          ) : (
          <span>Select a resonator</span>)}
        </button>
         {current ? (
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-between w-full px-5'>
                <p className='text-xl font-semibold text-[var(--color-highlight)]'>{current.name}</p>
                <div className='flex'>
                <img src={element} className='size-12'/>
                <img src={weapon} className='brightness-[var(--color-img)] size-11'/>
                </div>
              </div>
              {current.rarity === 5 ? (
                <img src={fivestars} className='w-70 h-20 brightness-105'/>
              ) : (
                <img src={fourstars} className='w-70 h-20'/>
              )}
            </div>
            ):(
              null
        )}       
      </div>
      {current? (<div className='border-0 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 '>
        
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
        <Slider
          label="Resonance Chain"
          value={chain}
          onChange={setChain}
          min={0}
          max={6}
          step={1}
          elementColor={elementColors[current.element]}
          className=""
        />
      </div>) : (null)}

      {current? (<div className='border-0 flex flex-col shadow-[0_4px_16px_rgba(0,0,0,0.15)] p-6 rounded-2xl mt-6 mx-4 mb-4'>
        
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
              {resonators.map((r) => (
                <CharacterCard key={r.id} resonator={r} onSelect={() => handlePick(r)} />
              ))}
            </DialogPanel>
          </div>
        </Dialog>
    </div>
  )
}
