import React from 'react'
import weapon from "../assets/images/ui/weapon.webp"
import team from "../assets/images/ui/Icon_Team.webp"
import echo from "../assets/images/ui/databank.webp"
import resonator from "../assets/images/ui/resonator.png"
import forte from "../assets/images/ui/Icon_Forte.webp"
import chain from "../assets/images/ui/chain.png"
import enemy from "../assets/images/ui/enemy.webp"

export default function Header({ onSelect = () => {}, activePage }) {
  return (
    <div className='flex h-full md:justify-start md:items-center'>
        <button onClick={() => onSelect("resonator")} className="cursor-pointer h-full p-1 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={resonator}
            title="Resonator"
            className="w-full h-full object-contain filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150 "
            />
        </button>
        <button onClick={() => onSelect("weapon")} className="cursor-pointer h-full p-2 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={weapon}
            title="Weapon"
            className="w-full h-full object-contain filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150"
            />
        </button>
        <button onClick={() => onSelect("echo")} className="cursor-pointer h-full p-2 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={echo}
            title="Echo"
            className="w-full h-full object-contain filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150"
            />
        </button>
        <button onClick={() => onSelect("team")} className="cursor-pointer h-full p-2 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={team}
            title="Teammates"
            className="w-full h-full object-contain filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150"
            />
        </button>
        <button onClick={() => onSelect("chain")} className="cursor-pointer h-full pr-0.5 pb-0.75 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={chain}
            title="Resonator Chain"
            className="w-full h-full object-contain filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150"
            />
        </button>

        <button onClick={() => onSelect("enemy")} className="cursor-pointer h-full pr-0.5 pb-0.75 hover:bg-[var(--color-hover)] border-0 border-solid rounded-full">
            <img
            src={enemy}
            title="Enemy Setting"
            className="w-full h-full object-contain pt-3 pb-1 px-1 filter brightness-[var(--color-img)] 
            hover:scale-[1.1] transition-transform duration-150"
            />
        </button>
    </div>
  )
}
