import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { statsAtLevel } from "../utils/formulas";

const ResonatorContext = createContext(null);

export function ResonatorProvider({ children }) {
    const [resonators, setResonators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(null);

    /* Slider control */ 
    const [level, setLevel] = useState(90);
    const [basic, setBasic] = useState(10);
    const [skill, setSkill] = useState(10);
    const [forte, setForte] = useState(10);
    const [ult, setUlt] = useState(10);
    const [intro, setIntro] = useState(10);

    /* Minor */
    const [minor1, setMinor1] = useState(null);
    const [minor2, setMinor2] = useState(null);

    const [passStacks, setPassStacks] = useState(0);

    /* Fetching character data */ 
    useEffect(() => {
        const ctrl = new AbortController();
        (async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("http://127.0.0.1:5000/v1/resonators", { signal: ctrl.signal });
            if (!res.ok) throw new Error("Failed to fetch resonators");
            const data = await res.json();
            setResonators(data);
            if (!current && data?.length) setCurrent(data[0]);
        } catch (e) {
            if (e.name !== "AbortError") setError(e.message);
        } finally {
            setLoading(false);
        }
        })();
        return () => ctrl.abort();
    }, []); 

    /* Reset slider after character change */ 
    useEffect(() => {
        if (!current) return;
        setLevel(90);
        setBasic(10);
        setSkill(10);
        setForte(10);
        setUlt(10);
        setIntro(10);
    }, [current]);

    const charPassive = useMemo(() => {
        if (!current?.self_buff?.length) return null;

        const p = current.self_buff[0]; // first passive only for now

        const stackable = p.stack === true;

        return {
            name: p.name,
            description: p.description,
            buffType: p.type,
            stackable,
            maxStacks: stackable ? p.maxStacks : null,
            valuePerStack: stackable ? (p.valuePerStack ?? 0) : null,
            value: stackable
                ? (passStacks ?? 0) * (p.valuePerStack ?? 0)
                : (p.value ?? 0),
            };
    }, [current, passStacks]);

    /* Compute base stats */ 
    const currentStats = useMemo(() => {
        if (!current?.stats) return null;
        const s = current.stats;
        return {
        hp: Math.round(statsAtLevel(level, s.hp.base, s.hp.max)),
        def: Math.round(statsAtLevel(level, s.def.base, s.def.max)),
        atk: Math.round(statsAtLevel(level, s.atk.base, s.atk.max)),
        cr: s.cr * 100,
        cd: s.cd * 100,
        er: s.er * 100,
        };
    }, [current,level]);

    const value = useMemo(() => ({
        resonators, loading, error,
        current, setCurrent,

        level, setLevel,
        basic, setBasic,
        skill, setSkill,
        forte, setForte,
        ult, setUlt,
        intro, setIntro,
        minor1, setMinor1,
        minor2, setMinor2,
        passStacks,setPassStacks, 
        currentStats, charPassive
    }), [
        resonators, loading, error,
        current,
        level, basic, skill, forte, ult, intro,
        currentStats,
        minor1, minor2, charPassive, passStacks
    ]);

  return <ResonatorContext.Provider value={value}>{children}</ResonatorContext.Provider>;
}

export function useResonator() {
  const ctx = useContext(ResonatorContext);
  if (!ctx) throw new Error("useResonator must be used within <ResonatorProvider>");
  return ctx;
}
