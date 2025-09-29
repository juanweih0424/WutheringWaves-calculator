import React from 'react'
import { getWeaponImageUrl } from '../utils/weapon'

export default function WeaponCard({weapon, onSelect}) {

    const avatar = getWeaponImageUrl(weapon.icon);


  return (
    <div className='flex flex-col items-center border-1 border-gray-400/20 shadow-xl rounded-2xl mt-4 p-4'>
        <button className='w-30 h-30 rounded-full cursor-pointer'
        type="button"
        onClick={onSelect}
        >
          <img src={avatar} className='w-full aspect-square rounded-full transition-transform hover:scale-110 duration-300 ease-in-out border border-amber-400'/>
        </button>
        <div className='flex flex-col items-center mt-2'>
          <p className='text-xl text-[var(--color-highlight)]'>{weapon.name}</p>
          <div className='flex justify-center'>
          </div>
        </div>
    </div>
  )
}
