import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { statsAtLevel } from "../utils/formulas";
import { useResonator } from "./ResonatorContext";

const WeaponContext = createContext(null);

export function WeaponProvider({weapons=[], children}) {

    
    const [currWeap, setCurrWeap] = useState(null);
    const [refineLvl, setRefineLvl] = useState(1);
    const [currWeapLvl, setCurrWeapLvl] = useState(90);
    const {current} = useResonator();
    // Stack control for weapone passive
    const [passiveStack, setPassiveStack] = useState(0)

    const [enabled, setEnabled] = useState({});
    // whenever weapon/refine changes, (re)build the enabled map from rank keys
    useEffect(() => {
    if (!currWeap) { setEnabled({}); return; }
    const keys = Object.keys(currWeap.passive?.ranks?.[refineLvl - 1] ?? {});
    // default ON; flip to false if you want everything off by default
    setEnabled(Object.fromEntries(keys.map(k => [k, false])));
    }, [currWeap]);

    // small helper to flip one key
    const togglePassiveKey = (key) =>
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));

    useEffect(()=>{
        if (!current) return;
        setCurrWeap(null);
    },[current])

    useEffect(()=> {
        if (!currWeap) return;
        setRefineLvl(1);
        setCurrWeapLvl(90);
        setPassiveStack(0);
    },[currWeap]);

    // Compute current weapon stats => main attack and subval field(hp,def,er,cr,cd)
    const weaponStats = useMemo(()=>{
        if (!currWeap) return;
        const weaponAtk = statsAtLevel(currWeapLvl, currWeap.atk.base, currWeap.atk.max);
        const subValType = currWeap.substat;
        const subVal = statsAtLevel(currWeapLvl, currWeap.subval.base, currWeap.subval.max) * 100;
        return {
            weaponAtk,subVal,subValType
        }
    },[currWeap,currWeapLvl])


    const passiveStats = useMemo(()=>{
        if (!currWeap) return null;

        const wPassive = currWeap.passive 
        const currRankStats = wPassive.ranks[refineLvl-1];
        const g = (key) => (enabled[key] ? (currRankStats[key] ?? 0) : 0);
        
        // render method for weapon description
        const dict = {
            atkPct: currRankStats?.atkPct != null ? (currRankStats.atkPct * 100).toFixed(0) : "0",
            hpPct : currRankStats?.hpPct != null ? (currRankStats.hpPct * 100).toFixed(1) : "0",
            ult: currRankStats?.ult != null ? (currRankStats.ult * 100).toFixed(1) : "0",
            haDmg: currRankStats?.haDmg != null ? (currRankStats.haDmg * 100).toFixed(1) : "0",
            allAtr: currRankStats?.allAtr != null ? (currRankStats.allAtr * 100) : "0",
            baDmg: currRankStats?.baDmg != null ? (currRankStats.baDmg * 100).toFixed(0) : "0",
            er: currRankStats?.er != null ? (currRankStats.er * 100).toFixed(1) : "0",
            skill: currRankStats?.skill != null ? (currRankStats.skill * 100).toFixed(0) : "0",
            frazzle: currRankStats?.frazzle != null ? (currRankStats.frazzle * 100).toFixed(1) : "0",
            defIgnore: currRankStats?.defIgnore != null ? (currRankStats.defIgnore * 100).toFixed(1) : "0", 
            fusion: currRankStats?.fusion != null ? (currRankStats.fusion * 100).toFixed(0) : "0",
            echoDmg: currRankStats?.echoDmg != null ? (currRankStats.echoDmg * 100).toFixed(0) : "0",
            atkPctTm: currRankStats?.atkPctTm != null ? (currRankStats.atkPctTm * 100).toFixed(0) : "0",
            additionalAtk: currRankStats?.additionalAtk != null ? (currRankStats.additionalAtk * 100).toFixed(0) : "0",
            frazzleTm: currRankStats?.frazzleTm != null ? (currRankStats.frazzle * 100).toFixed(1) : "0",
            baDmgStack: currRankStats?.baDmgStack != null ? (currRankStats.baDmgStack*100) : "0",
            havocShred:currRankStats?.havocShred != null ? (currRankStats.havocShred*100).toFixed(0):"0",
            allAmp:currRankStats?.allAmp != null ? (currRankStats.allAmp*100).toFixed(0):"0",
            aeroAmpTm:currRankStats?.aeroAmpTm != null ? (currRankStats.aeroAmpTm*100).toFixed(1):"0",
            cr:currRankStats?.cr != null ? (currRankStats.cr * 100).toFixed(1) : "0",
            aeroBouns: currRankStats?.aeroBouns != null ? (currRankStats.aeroBouns * 100).toFixed(0) : "0",
            aeroShred:currRankStats?.aeroShred != null ? (currRankStats.aeroShred*100).toFixed(1):"0",
            echoDmgAmp: currRankStats?.echoDmgAmp != null ? (currRankStats.echoDmgAmp * 100).toFixed(0):"0",
            haDmgAmp: currRankStats?.haDmgAmp != null ? (currRankStats.haDmgAmp * 100).toFixed(0) : "0",
            echoDmgTm: currRankStats?.echoDmgTm != null ? (currRankStats.echoDmgTm * 100).toFixed(0): "0"
        }

        const primary = "#e0c707"
        const description = (wPassive?.description || "").replace(/\{(\w+)\}%?/g, (_, key) => {
            const val = dict[key] ?? key;
            return `<span style="color:${primary}">${val}%</span>`;
        });
        
        // Every weapon's passive must increase one of these below
        let hpPct   = g("hpPct");
        let defPct  = g("defPct");
        let atkPct  = g("atkPct");
        const allAtr = g("allAtr");
        let baDmg   = g("baDmg");
        let haDmg   = g("haDmg");
        let skill   = g("skill");
        let ult     = g("ult");
        let echoDmg = g("echoDmg");
        let er      = g("er");
        const heal  = g("heal");
        let defIgnore = g("defIgnore");
        let cr      = g("cr");
        let cd      = g("cd");
        let fusion  = g("fusion");
        let additionalAtk = g("additionalAtk");
        let baDmgStack = g("baDmgStack");
        let havocShred = g("havocShred");
        let allAmp = g("allAmp");
        let aeroAmpTm = g("aeroAmpTm");
        let aeroBouns = g("aeroBouns");
        let aeroShred = g("aeroShred");
        let echoDmgAmp = g("echoDmgAmp");
        let frazzleAmp = g("frazzle");
        let haDmgAmp = g("haDmgAmp");

        // Find if a passive has a stack variable
        const hasStack = wPassive?.stack === true;
        const maxStack = hasStack ? (wPassive?.maxStack ?? 0) : 0;
        const stackScope = hasStack ? (wPassive?.stackScope ?? null) : null
        // e.g stackScope->defIgnore currRankStats[defIgnore] (0.072) * currentStacks (0-5)
        const currentStackVal = hasStack ? (currRankStats?.[stackScope] * passiveStack) : null;
        // check if it is defence ignorance stack and it has a scope e.g Applies on basic/ult/skill/heavy only, handle the calculation outside the context during rendering
        const defIgnoreScope = wPassive?.defIgnoreScope ?? null;
         
        switch (stackScope){
            case "baDmg":
                baDmg = currentStackVal;
                break;
            case "baDmgStack":
                baDmgStack = currentStackVal;
                break;
            case "haDmg":
                haDmg = currentStackVal;
                break;
            case "skill":
                skill = currentStackVal;
                break;
            case "ult":
                ult = currentStackVal;
                break;
            case "atkPct":
                atkPct = currentStackVal;
                break;
            case "hpPct":
                hpPct = currentStackVal;
                break;
            case "defPct":
                defPct = currentStackVal;
                break;
            case "defIgnore":
                defIgnore = currentStackVal;
                break;
            case "cr":
                cr = currentStackVal;
                break;
            case "cd":
                cd = currentStackVal;
                break;
            case "er":
                er = currentStackVal;
                break;
            default:
                break;
        }
        
        
        return {
            hpPct, defPct,atkPct, allAtr, baDmg, haDmg, skill, ult, echoDmg , er, heal, defIgnore, cr,cd, maxStack, currentStackVal, defIgnoreScope, fusion, additionalAtk, haDmgAmp,
            weapPassiveName: currWeap.passive.name, weapPassiveDesc: description, stackScope, hasStack,baDmgStack,havocShred,allAmp,aeroAmpTm,aeroBouns, aeroShred, echoDmgAmp,frazzleAmp
        }
    },[currWeap, refineLvl, passiveStack,enabled])

    
    const value = useMemo(()=>({
        currWeap, setCurrWeap,
        weaponStats, passiveStats,
        refineLvl,setRefineLvl,
        passiveStack,setPassiveStack,
        currWeapLvl, setCurrWeapLvl,
        weapons, enabled, togglePassiveKey,    
    }),[currWeapLvl, passiveStack, refineLvl, currWeap, weaponStats, passiveStats,weapons,enabled]);

    return <WeaponContext.Provider value={value}>{children}</WeaponContext.Provider>;
}



export function useWeapon() {
  const ctx = useContext(WeaponContext);
  if (!ctx) throw new Error("useWeapon must be used within <WeaponProvider>");
  return ctx;
}