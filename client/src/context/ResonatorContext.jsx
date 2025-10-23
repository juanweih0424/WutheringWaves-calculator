import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { statsAtLevel } from "../utils/formulas";
import { talentMv } from "../utils/dmg";
import { useResonatorChain } from "./ResonatorChainContext";

const ResonatorContext = createContext(null);

const CRIT_RATE = 5;
const CRIT_DMG = 150;
const ENERGY_REGEN = 100;

export function ResonatorProvider({ items=[], children }) {
    const [current, setCurrent] = useState(null)

    // Initialize a character
    useEffect(()=>{
        setCurrent(items[5])
    },[items])

    /* Slider control */ 
    const [level, setLevel] = useState(90);
    const [basic, setBasic] = useState(10);
    const [skill, setSkill] = useState(10);
    const [forte, setForte] = useState(10);
    const [ult, setUlt] = useState(10);
    const [intro, setIntro] = useState(10);

    // enable inherent and minor forte
    const [minor, setMinor] = useState({});
    useEffect(() => {
    if (!current) { setMinor({}); return; }
    const next = Object.fromEntries(
        Object.entries(current.minor ?? {}).map(([k, v]) => [k, { value: v, enable: false }])
    );
    setMinor(next); 
    }, [current?.id]); 

    const toggleMinor = (key) =>
    setMinor(prev => ({ ...prev, [key]: { ...prev[key], enable: !prev[key].enable } }));

    useEffect(() => {
        if (!current) return;
        setLevel(90);
        setBasic(10);
        setSkill(10);
        setForte(10);
        setUlt(10);
        setIntro(10);
    }, [current]);

    // Compute base stats for current character
    const charBaseStats = useMemo(() => {
    if (!current?.stats) return null;
    return {
        charHp:  statsAtLevel(level, current.stats.hp.base,  current.stats.hp.max),
        charDef: statsAtLevel(level, current.stats.def.base,  current.stats.def.max),
        charAtk: statsAtLevel(level, current.stats.atk.base,  current.stats.atk.max),
        critRate: CRIT_RATE,
        critDmg:  CRIT_DMG,
        energyRegen: ENERGY_REGEN,
    };
    }, [current, level]);

    // Character buff
    const [enabledBuffs, setEnabledBuffs] = useState({});
    const [buffStacks, setBuffStacks] = useState({});
    useEffect(() => {
        if (!current?.buff) { setEnabledBuffs({}); setBuffStacks({}); return; }

        const initEnabled = {};
        const initStacks  = {};

        for (const [name, data] of Object.entries(current.buff)) {
            
            initEnabled[name] = false;                 
            initStacks[name]  = 0;                     
        }
        setEnabledBuffs(initEnabled);
        setBuffStacks(initStacks);
    }, [current?.id]);

    function toggleBuff(name) {
        setEnabledBuffs(prev => ({ ...prev, [name]: !prev[name] }));
    }

    const getMaxStacks = (name) =>
        Math.max(
            1,
            ...((current?.buff?.[name]?.effects ?? [])
                .filter(e => e.stack)
                .map(e => e.maxStack ?? 1))
    );

    function setBuffStack(name, value) {
        const max = getMaxStacks(name);
        const n = Math.max(0, Math.min(max, Number(value) || 0));
        setBuffStacks(prev => ({ ...prev, [name]: n }));
    }

    const trackEnable = useMemo(() => {
        if (!current?.buff) return [];

        const effects = [];

        for (const [name, buff] of Object.entries(current.buff)) {
            if (!enabledBuffs?.[name]) continue;

            for (const e of (buff.effects ?? [])) {
            const max = e.maxStack ?? 1;
            const stacks = e.stack
                ? Math.min(max, Math.max(0, buffStacks?.[name] ?? 0))
                : 1;
            
            const minBase = e.min ?? 0;
            const value = talentMv(1,10, minBase, e.value, basic)
            if (minBase == 0){
            effects.push({
                source: name,
                stat: e.stat,                
                amount: (e.value ?? 0) * stacks,
                stacks,
                appliesTo: e.tags ?? null,
                receive: e.receive ?? null
            });
            } else {
            effects.push({
                source: name,
                stat: e.stat,                
                amount: (value ?? 0) * stacks,
                stacks,
                appliesTo: e.tags ?? null,
                receive: e.receive ?? null,
            });
            }
            }
        }

        return effects;
    }, [current?.id, enabledBuffs, buffStacks,basic]);


    const value = useMemo(() => ({
        items,
        current,setCurrent,
        level,setLevel,
        basic,setBasic,
        skill,setSkill,
        intro,setIntro,
        ult,setUlt,
        forte,setForte,
        charBaseStats,
        minor,setMinor, toggleMinor,
        enabledBuffs,
        toggleBuff,
        buffStacks,
        setBuffStack,
        trackEnable
    }), [items, current,level,basic,skill,intro,ult,forte, charBaseStats, minor, enabledBuffs, buffStacks, trackEnable
    ]);

  return <ResonatorContext.Provider value={value}>{children}</ResonatorContext.Provider>;
}

export function useResonator() {
  const ctx = useContext(ResonatorContext);
  if (!ctx) throw new Error("useResonator must be used within <ResonatorProvider>");
  return ctx;
}
