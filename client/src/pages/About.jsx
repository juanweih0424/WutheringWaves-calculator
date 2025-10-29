import React from 'react'

export default function About() {
  return (
    <div className='flex mb-4'>
        <div className='flex flex-col items-center mt-8 px-8 lg:max-w-[50vw] gap-2'>
            <p className='text-lg md:text-2xl lg:text-4xl tracking-tight font-bold italic text-[var(--color-highlight)]'>Wuthering Waves Calculator</p>
            <p className='text-sm lg:text-base opacity-95'>
                I developed this Wuthering Waves Calculator purely out of personal
                interest—both as a programming challenge and a way to better
                understand the game’s combat mechanics. I’ll keep it updated with
                new data, features, and formula improvements as the game evolves.
            </p>
            <p className='text-base lg:text-2xl italic  tracking-tight place-self-start font-semibold'>Formulas Credit - 
                <a href="https://wutheringwaves.gg/damage-calculation-guide/" target="_blank" className='underline'> WutheringWaves.gg</a>
            </p>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>ATK/HP/DEF</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    ATK/HP/DEF = (Character Base ATK/HP/DEF + Weapon Base ATK) * ( 1 + ATK/HP/DEF Percent) + Flat ATK/HP/DEF
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Skill Multiplier</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    Skill Multiplier = (SkillBase Multiplier + Additional Multiplier) * (1 + MultiplierBouns)
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Damage Bouns</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    DMG Bouns = 1 + ElementalDMG Bouns + SkillTypeDMG Bouns + DMG Increase (e.g Cartethyia Inherent Skill)
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Amplification</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    Amp = 1 + ElementalAmp + SkillTypeAmp + AllAmp
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Resistance Multiplier</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    Res = 1 - resistance + specificResShred (depending on character element)
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Defence Multiplier</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    Def = ( 800 + 8 * characterLevel) / ( 800 + 8 * characterLevel + ( 8 * EnemyLevel + 792 ) * ( 1 - defIgnore  )) 
                </p>
            </section>
            <section className='flex flex-col place-self-start gap-2'>
                <p className='text-base lg:text-xl tracking-tight font-semibold'>Final Output</p>
                <p className='italic text-sm lg:text-base opacity-95'>
                    Final = ATK/HP/DEF * Skill Multiplier * DMG Bouns * Amp * Res * Def * Crit DMG * DMG receivedBouns (e.g phrolova S6)
                </p>
            </section>
        </div>
        
    </div>
  )
}
