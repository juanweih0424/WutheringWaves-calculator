import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useWeapon } from "../context/WeaponContext"; 
import { useEnemy } from "../context/EnemyContext";
import { useResonatorChain } from "../context/ResonatorChainContext";

export function useStats() {
    const {charBaseStats, minor, trackEnable,current} = useResonator();
    const {weaponStats, passiveStats} = useWeapon();
    const {enemylvl, enemyres} = useEnemy();
    const {activeChain} = useResonatorChain();

    // Declare stats
    const stats = useMemo(()=>{
        if (!charBaseStats) return null;
        let baseAtk = (charBaseStats?.charAtk ?? 0) + (weaponStats?.weaponAtk ?? 0)
        let baseDef = charBaseStats?.charDef;
        let baseHp = charBaseStats?.charHp;
        let er = charBaseStats?.energyRegen;
        let cr = charBaseStats?.critRate;
        let cd = charBaseStats?.critDmg;
        let baDmg = 0;
        let haDmg = 0;
        let skillDmg = 0;
        let ultDmg = 0;
        let electro = 0;
        let fusion = 0;
        let spectro = 0;
        let glacio = 0;
        let havoc = 0;
        let aero = 0;
        let heal = 0
        let allAmp = 0;
        let echoDmg = 0;
        let defIgnore = 0;

        let havocShred = 0;
        let aeroShred = 0;

        //declare multiplier
        let atkPct = 0;
        let defPct = 0;
        let hpPct = 0;

        // weapon stats
        const weapSubVal = weaponStats?.subVal ?? null;
        const weapSubValType = weaponStats?.subValType ?? null;
        const defIgnoreScope = passiveStats?.defIgnoreScope ?? null;
        
        // apply substats percent
        const applySub = (type, v) => {
            switch (type) {
                case "atk": atkPct += v / 100; break;
                case "def": defPct += v / 100; break;
                case "hp":  hpPct  += v / 100; break;
                case "cr":     cr += v; break;  
                case "cd":     cd += v; break;
                case "er":     er += v; break;
                default: break;
            }
        };
        applySub(weapSubValType, weapSubVal);
        // Include minor stats -> normally atk/hp with cr/cd, rare case is elemental bouns
        for (const [key, obj] of Object.entries(minor ?? {})) {
        if (!obj?.enable) continue;
        const v = Number(obj.value) || 0;
        switch (key) {
            case "atkPct": atkPct += v; break;
            case "hpPct":  hpPct  += v; break;
            case "defPct": defPct += v; break;

            case "cr": cr += v * 100; break;
            case "cd": cd += v * 100; break;
            case "er": er += v * 100; break;
            // others.. elemental ....
            default: break;
        }
        }

        // Weapon Passive stats
        for (const [key, raw] of Object.entries(passiveStats ?? {})) {
            const v = Number(raw) || 0;
            switch (key) {
                case "atkPct": atkPct += v; break;
                case "hpPct": hpPct += v; break;
                case "defPct": defPct += v; break;
                case "additionalAtk": atkPct += v;break;
                case "aeroBouns": aero += v; break;
                case "allAmp": allAmp += v; break;
                case "baDmg": baDmg += v; break;
                case "baDmgStack": baDmg+= v; break;
                case "cd": cd += v * 100; break;
                case "cr": cr += v * 100; break;
                case "er": er += v * 100; break;
                case "echoDmg": echoDmg += v;break;
                case "fusion": fusion += v;break;
                case "haDmg": haDmg += v; break;
                case "ult": ultDmg += v; break;
                case "skill": skillDmg += v;break;
                case "defIgnore": defIgnore += v; break;
                case "heal": heal += v;break;
                case "allAtr": aero += v; spectro +=v;
                fusion += v; electro +=v; havoc += v; glacio += v; break;
                case "aeroShred": aeroShred += v;break;
                case "havocShred": havocShred +=v; break;
                default:break;
            }
        }

        // check enabled buffs from character;
        const scopedInherent = []
        for (const e of trackEnable){
            if (!e.appliesTo){
                switch (e.stat){
                    case "atkPct": atkPct += e.amount;break;
                    case "hpPct": hpPct += e.amount;break;
                    case "defPct": defPct += e.amount;break;
                    case "cr": cr += e.amount;break;
                    case "cd": cd += e.amount;break;
                    case "er": er += e.amount;break;

                    case "baDmg":  baDmg  += e.amount; break;
                    case "haDmg":  haDmg  += e.amount; break;
                    case "skill":  skillDmg += e.amount; break;
                    case "ult":    ultDmg   += e.amount; break;

                    case "fusion": fusion  += e.amount; break;
                    case "aero":   aero    += e.amount; break;
                    case "electro":electro += e.amount; break;
                    case "spectro":spectro += e.amount; break;
                    case "glacio": glacio  += e.amount; break;
                    case "havoc":  havoc   += e.amount; break;   
                    
                    case "echoDmg": echoDmg += e.amount; break;
                    case "allAmp":  allAmp  += e.amount; break;
                    case "defIgnore": defIgnore += e.amount; break;
                    case "heal":    heal += e.amount; break;

                    default: break;
                } 
            } else {
                scopedInherent.push(e);
            }
        }

        //chain
        const scopedChain = [];
        for (const e of activeChain){
            if (!e.appliesTo){
                switch (e.stat){
                    case "atkPct": atkPct += e.amount;break;
                    case "hpPct": hpPct += e.amount;break;
                    case "defPct": defPct += e.amount;break;
                    case "cr": cr += e.amount*100;break;
                    case "cd": cd += e.amount;break;
                    case "er": er += e.amount;break;

                    case "baDmg":  baDmg  += e.amount; break;
                    case "haDmg":  haDmg  += e.amount; break;
                    case "skill":  skillDmg += e.amount; break;
                    case "ult":    ultDmg   += e.amount; break;

                    case "fusion": fusion  += e.amount; break;
                    case "aero":   aero    += e.amount; break;
                    case "electro":electro += e.amount; break;
                    case "spectro":spectro += e.amount; break;
                    case "glacio": glacio  += e.amount; break;
                    case "havoc":  havoc   += e.amount; break;   
                    
                    case "echoDmg": echoDmg += e.amount; break;
                    case "allAmp":  allAmp  += e.amount; break;
                    case "defIgnore": defIgnore += e.amount; break;
                    case "heal":    heal += e.amount; break;
                    default: break;
                } 
            } else {
                scopedChain.push(e);
            }
        }

        // enemy level and res
        const enemylevel = enemylvl;
        const enemyRes = enemyres;

        // calc final atk/hp/def
        const atk = baseAtk * (1+atkPct);
        const hp = baseHp * (1+hpPct) 
        const def = baseDef * (1+defPct)
        
        return {
            atkPct, atk, hp, def, cr, cd, er, baDmg, haDmg, ult:ultDmg, skill:skillDmg, echoDmg, allAmp, defIgnore, baseAtk,
            fusion, aero, electro, spectro,havoc,glacio, heal, defIgnoreScope, enemylevel, enemyRes, aeroShred,havocShred, scopedInherent, scopedChain
        }

    }, [charBaseStats, weaponStats,passiveStats,minor,enemylvl,enemyres, trackEnable, activeChain])
   

    return stats;
}
