import React from 'react'
import { getWeaponImageUrl } from '../utils/weapon'

export default function WeaponCard({weapon, onSelect}) {

    const avatar = getWeaponImageUrl(weapon.icon);


  return (
    <div className='flex flex-col items-center border-1 border-gray-500/30 shadow-md rounded-3xl py-2 px-1 mt-2'>
        <button className='w-15 h-15 lg:w-30 lg:h-30 rounded-full cursor-pointer'
        type="button"
        onClick={() => onSelect?.(weapon)}  
        >
          <img src={avatar} className='w-full h-full object-cover transition-transform duration-300 ease-in-out border-1 border-gray-500/30 rounded-full'/>
        </button>
        <div className='flex flex-col items-center mt-2 gap-1 '>
          <p className='text-xs lg:text-lg text-[var(--color-highlight)]'>{weapon.name}</p>
          <button className='bg-[#309adb] rounded-xl border-0 text-xs py-1 px-2 lg:px-4 lg:py-1.5  lg:text-sm hover:bg-blue-600 cursor-pointer
          transition-transform duration-300 ease-in-out' onClick={() => onSelect?.(weapon)} type="button">
            Equip
          </button>
        </div>
    </div>
  )
}
