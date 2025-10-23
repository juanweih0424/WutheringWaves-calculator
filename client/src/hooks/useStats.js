import { useMemo } from "react";
import { useResonator } from "../context/ResonatorContext";
import { useWeapon } from "../context/WeaponContext"; 
import { useEnemy } from "../context/EnemyContext";
import { useResonatorChain } from "../context/ResonatorChainContext";
import { useEcho } from "../context/EchoContext";
import { useEchoSet } from "../context/EchoSetContext";
import { useBuff } from "../context/TeamBuffContext";
import { useWeaponBuff } from "../context/WeaponBuffContext";
import { useResonatorBuffs } from "../context/ResonatorBuffContext";

export function useStats() {
    const {charBaseStats, minor, trackEnable,current} = useResonator();
    const {weaponStats, passiveStats} = useWeapon();
    const {enemylvl, enemyres} = useEnemy();
    const {activeChain} = useResonatorChain();
    const {setTotals} = useEchoSet();
    const {echoTotals} = useEcho();
    const {echoTeamTotals} = useBuff();
    const {activeStats} = useWeaponBuff();
    const {activeStatsResonator} = useResonatorBuffs();

    const scopedInherent = useMemo(
    () => (trackEnable ?? []).filter(e => !!e.appliesTo),
    [trackEnable]
    );

    const scopedChain = useMemo(
    () => (activeChain ?? []).filter(e => !!e.appliesTo),
    [activeChain]
    );


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
        let spectroShred = 0;
        let aeroAmp = 0;
        let frazzleAmp = 0;
        let echoDmgAmp = 0;
        let erosionAmp = 0;
        let receivedAmp = 0;
        let haAmp = 0;
        let dmgInc = 0;

        //declare multiplier
        let atkPct = 0;
        let defPct = 0;
        let hpPct = 0;

        // flat
        let flatDef = 0;
        let flatAtk = 0;
        let flatHp = 0;
        

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

        // handle chain-> buff inherent logic

        {
        // 1) collect total multiplier per receive key from scopedChain
        const receiveMulByKey = {};

        for (const c of scopedChain) {
            if (!c?.appliesTo) continue;
            if (c.stat === "skillBouns") {
            const amt = Number(c.amount) || 0;
            // combine multiple sources multiplicatively
            receiveMulByKey[c.appliesTo] = (receiveMulByKey[c.appliesTo] ?? 1) * (1 + amt);
            }
        }


        // 2) apply to scopedInherent from a stable baseline so toggling doesn’t stack
        for (const e of scopedInherent) {
            // remember the original amount once
            const base = e.__baseAmount ?? (e.__baseAmount = Number(e.amount) || 0);
            
            // check if this inherent receives multiplier from chain
            const recv = e?.receive;
            const mul = recv ? (receiveMulByKey[recv] ?? 1) : 1;

            // recompute every time from base (not cumulative)
            e.amount = base * mul;
        }
        for (const e of trackEnable) {
            // remember the original amount once
            const base = e.__baseAmount ?? (e.__baseAmount = Number(e.amount) || 0);
            
            // check if this inherent receives multiplier from chain
            const recv = e?.receive;
            const mul = recv ? (receiveMulByKey[recv] ?? 1) : 1;

            // recompute every time from base (not cumulative)
            e.amount = base * mul;
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
                case "echoDmgAmp": echoDmgAmp += v; break;
                case "frazzleAmp": frazzleAmp += v; break;
                case "haDmgAmp": haAmp += v; break;
                default:break;
            }
        }


        // check enabled buffs from character;
        for (const e of trackEnable){
            if (!e.appliesTo){
                switch (e.stat){
                    case "atkPct": atkPct += e.amount;break;
                    case "hpPct": hpPct += e.amount;break;
                    case "defPct": defPct += e.amount;break;
                    case "cr": cr += e.amount*100;break;
                    case "cd": cd += e.amount*100;break;
                    case "er": er += e.amount*100;break;

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

                    case "frazzleAmp": frazzleAmp += e.amount;break;
                    case "erosionAmp": erosionAmp += e.amount;break;
                    case "receivedAmp": receivedAmp += e.amount;break;
                    case "dmgInc": dmgInc += e.amount;break;
                    default: break;
                } 
            }
        }


        //chain
        for (const e of activeChain){
            if (!e.appliesTo){
                switch (e.stat){
                    case "atkPct": atkPct += e.amount;break;
                    case "hpPct": hpPct += e.amount;break;
                    case "defPct": defPct += e.amount;break;
                    case "cr": cr += e.amount*100;break;
                    case "cd": cd += e.amount*100;break;
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
                    case "echoDmgAmp": echoDmgAmp += e.amount;break;
                    case "allAtr": aero += e.amount; spectro +=e.amount;
                    fusion += e.amount; electro +=e.amount; havoc += e.amount; glacio += e.amount; break;
                    default: break;
                } 
            } 
        }


        

        for (const [key, value] of Object.entries(echoTotals)) {
            switch (key) {
                case "atkPct":  atkPct  += value; break;
                case "hpPct":   hpPct   += value; break;
                case "defPct":  defPct  += value; break;
                case "cr":      cr      += value*100; break;
                case "cd":      cd      += value*100; break;
                case "er":      er      += value*100; break;

                case "baDmg":   baDmg   += value; break;
                case "haDmg":   haDmg   += value; break;

                case "skill":   skillDmg += value; break;
                case "ult":     ultDmg   += value; break;
                case "fusion":  fusion  += value; break;
                case "aero":    aero    += value; break;
                case "electro": electro += value; break;
                case "spectro": spectro += value; break;
                case "glacio":  glacio  += value; break;
                case "havoc":   havoc   += value; break;
                case "echoDmg":   echoDmg   += value; break;     
                case "defIgnore": defIgnore += value; break;
                case "heal":      heal      += value; break;
                case "atk":     flatAtk += value;break;
                case "hp":     flatHp += value;break;
                case "def":     flatDef += value;break;

                default:
                    break;
            }
        }

        for (const [key, value] of Object.entries(setTotals)) {
            switch (key) {
                case "atkPct":  atkPct  += value; break;
                case "hpPct":   hpPct   += value; break;
                case "defPct":  defPct  += value; break;
                case "cr":      cr      += value*100; break;
                case "cd":      cd      += value*100; break;
                case "er":      er      += value*100; break;

                case "baDmg":   baDmg   += value; break;
                case "haDmg":   haDmg   += value; break;

                case "skill":   skillDmg += value; break;
                case "ult":     ultDmg   += value; break;
                case "fusion":  fusion  += value; break;
                case "fusionAll": fusion += value; break;
                case "aero":    aero    += value; break;
                case "aeroTm": aero += value; break;
                case "electro": electro += value; break;
                case "spectro": spectro += value; break;
                case "glacio":  glacio  += value; break;
                case "havoc":   havoc   += value; break;
                case "echoDmg":   echoDmg   += value; break;
                case "echoDmgAll": echoDmg += value; break;     
                case "defIgnore": defIgnore += value; break;
                case "heal":      heal      += value; break;
                case "allAtr": aero += value; spectro+=value;fusion+=value; electro+=value; glacio+=value; havoc+= value; break;

                default:
                    break;
            }
        }

        for (const [key, value] of Object.entries(echoTeamTotals)){
            switch (key) {
                case "atkPct":  atkPct  += value; break
                case "allAtr": aero += value; spectro+=value;fusion+=value; electro+=value; glacio+=value; havoc+= value; break;
                case "havoc":   havoc   += value; break;
                case "aero":    aero    += value; break;
                case "fusion":  fusion  += value; break;
                case "echoDmg":   echoDmg   += value; break;
                default:break;
            }
        }

        // weapon Team buff

        for (const [key, value] of Object.entries(activeStats)){
            switch (key) {
                case "atkPct":  atkPct  += value; break;
                case "fusion": fusion += value;break;
                case "aeroShred":   aeroShred   += value; break;
                case "aeroAmp":    aeroAmp    += value; break;
                case "frazzleTm":  frazzleAmp  += value; break;
                case "echoDmg": echoDmg += value;break;
                default:break;
            }
        }

        // define scope buff amp: aero amp predefiend and frazzleAmp predefined
        let baAmp = 0;
        let skillAmp = 0;
        let ultAmp = 0;
        let havocAmp = 0;
        let electroAmp = 0;
        
        let fusionAmp = 0;
        let glacioAmp = 0;
        let spectroAmp = 0;

        // resonator buff

        for (const [key, value] of Object.entries(activeStatsResonator)) {
            switch (key) {
                case "haAmp": haAmp += value; break;
                case "baAmp": baAmp += value; break;
                case "skillAmp": skillAmp += value; break;
                case "ultAmp": ultAmp += value; break;
                case "havocAmp": havocAmp += value; break;
                case "electroAmp": electroAmp += value; break;
                case "echoDmgAmp": echoDmgAmp += value; break;
                case "fusionAmp": fusionAmp += value; break;
                case "glacioAmp": glacioAmp += value; break;
                case "spectroAmp": spectroAmp += value; break;
                case "erosionAmp": erosionAmp += value; break;
                case "aeroAmp": aeroAmp += value;break;
                case "atkPct": atkPct += value; break;
                case "allAmp": allAmp += value;break;
                case "frazzleAmp": frazzleAmp += value;break;
                case "allAtr": havoc += value; electro += value; spectro += value; glacio += value; aero += value; fusion += value; break;
                case "skill": skillDmg += value; break;
                case "atkPct": atkPct += value;break;
                case "cr" : cr += value * 100; break;
                case "cd": cd += value * 100; break;
                case "spectroShred": spectroShred += value; break;
                case "echoDmg": echoDmg += value;break;
                case "aero": aero += value; break;
                default: break;
            }
        }
        

        // enemy level and res
        const enemylevel = enemylvl;
        const enemyRes = enemyres;

        // calc final atk/hp/def
        const atk = baseAtk * (1+atkPct) + flatAtk;
        const hp = baseHp * (1+hpPct) + flatHp;
        const def = baseDef * (1+defPct) + flatDef;

        if (current.id == 25 && cr > 100){
            cd += (cr-100)*2
        }
        
        return {
            atkPct, atk, hp, hpPct, def, defPct, cr, cd, er, baDmg, haDmg, ult:ultDmg, skill:skillDmg, echoDmg, allAmp, defIgnore, baseAtk, flatAtk, flatDef, flatHp, baseHp, baseDef,
            fusion, aero, electro,spectroShred, spectro,havoc,glacio, heal, defIgnoreScope, enemylevel, enemyRes, aeroShred,havocShred, scopedInherent, scopedChain, aeroAmp, frazzleAmp,
            haAmp, baAmp, skillAmp,ultAmp, havocAmp,electroAmp, echoDmgAmp, fusionAmp, glacioAmp, spectroAmp, erosionAmp,  receivedAmp , dmgInc
        }

    }, [charBaseStats, weaponStats,passiveStats,minor,enemylvl,enemyres, trackEnable, activeChain, echoTotals, setTotals, echoTeamTotals,activeStats, activeStatsResonator, scopedChain,
        scopedInherent
    ])
   

    return stats;
}
