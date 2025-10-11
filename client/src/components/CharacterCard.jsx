import React from 'react'
import { getCharacterElementUrl, getCharacterImageUrl, getCharacterWeaponUrl } from '../utils/character'

export default function CharacterCard({resonator, onSelect}) {

    const avatar = getCharacterImageUrl(resonator.id);
    const weapon = getCharacterWeaponUrl(resonator.weapon);
    const element = getCharacterElementUrl(resonator.element);

  return (
    <div className='flex flex-col items-center border-1 border-gray-400/20 shadow-xl rounded-2xl mt-4 p-4'>
        <button className='w-30 h-30 rounded-full cursor-pointer'
        type="button"
        onClick={() => onSelect?.(resonator)}
        >
          <img src={avatar} className='w-full aspect-square rounded-full transition-transform hover:scale-110 duration-300 ease-in-out border border-amber-400'/>
        </button>
        <div className='flex flex-col items-center mt-2'>
          <p className='text-xl text-[var(--color-highlight)]'>{resonator.name}</p>
          <div className='flex justify-center'>
            <img src={element} className='size-10'/>
            <img src={weapon} className='size-10 brightness-[var(--color-img)]'/>
          </div>
        </div>
    </div>
  )
}
