import React from 'react'
import { getCharacterElementUrl, getCharacterImageUrl, getCharacterWeaponUrl } from '../utils/character'

export default function CharacterCard({resonator, onSelect}) {

    const avatar = getCharacterImageUrl(resonator.id);
    const weapon = getCharacterWeaponUrl(resonator.weapon);
    const element = getCharacterElementUrl(resonator.element);

  return (
    <div className='flex flex-col items-center border-1 border-gray-500/30 shadow-md rounded-3xl py-2 px-1 mt-2'>
        <button className='w-15 h-15  lg:w-30 lg:h-30 rounded-full cursor-pointer'
        type="button"
        onClick={() => onSelect?.(resonator)}
        >
          <img src={avatar} className="w-full h-full object-cover transition-transform duration-300 ease-in-out border-1 border-gray-500/30 rounded-full"/>
        </button>
        <div className='flex flex-col items-center mt-2 gap-1'>
          <p className='text-sm lg:text-lg text-[var(--color-highlight)]'>{resonator.name}</p>
          <div className='flex justify-center'>
            <img src={element} className='size-6 lg:size-10'/>
            <img src={weapon} className='size-5.5 lg:size-10 brightness-[var(--color-img)]'/>
          </div>
          <button className='bg-[#309adb] rounded-2xl border-0 text-xs py-1 px-2 lg:px-3  lg:text-base hover:bg-blue-600 cursor-pointer
          transition-transform duration-300 ease-in-out' onClick={() => onSelect?.(resonator)} type="button">
            Resonate
          </button>
        </div>
    </div>
  )
}
