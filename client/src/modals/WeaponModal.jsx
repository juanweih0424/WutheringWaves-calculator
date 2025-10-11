import {useMemo} from 'react'
import WeaponCard from "../components/WeaponCard"
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle }  from '@headlessui/react'
import { useWeapon } from '../context/WeaponContext'
import { useResonator } from '../context/ResonatorContext';

export default function WeaponModal({open, onClose, onSelect}) {
    const {weapons} = useWeapon();
    const {current} = useResonator();

    // Only render weapon type that is matched with current resonator
    const filiteredWeapons = useMemo(()=>{
        const want = String(current.weapon).toLowerCase().trim();
        return weapons.filter(w => String(w.weapon).toLowerCase().trim() === want);
    },[weapons,current])

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
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
                    <button type="button" onClick={onClose} className="absolute top-3 right-3 rounded-full p-2 hover:bg-black/10 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-6">                    
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                    </svg>         
                    </button>
                    {filiteredWeapons.map((w) => (
                        <WeaponCard key={w.name} weapon={w} onSelect={onSelect}/>
                    ))}        
                </DialogPanel>
            </div>
        </Dialog>
    )
}
