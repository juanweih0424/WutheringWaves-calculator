import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { statsAtLevel } from "../utils/formulas";

const ResonatorContext = createContext(null);

export function ResonatorProvider({ children }) {
    const [resonators, setResonators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(null);

    const [level, setLevel] = useState(90);
    const [chain, setChain] = useState(0);
    const [basic, setBasic] = useState(10);
    const [skill, setSkill] = useState(10);
    const [forte, setForte] = useState(10);
    const [ult, setUlt] = useState(10);
    const [intro, setIntro] = useState(10);

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

    useEffect(() => {
        if (!current) return;
        setLevel(90);
        setChain(0);
        setBasic(10);
        setSkill(10);
        setForte(10);
        setUlt(10);
        setIntro(10);
    }, [current?.id]);

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
        baDmg: 0,
        haDmg: 0,
        skill: 0,
        ult: 0,

        glacio:0,
        fusion: 0,
        electro: 0,
        aero: 0,
        spectro:0,
        havoc: 0,
        heal: 0,
        };
    }, [current?.id, current?.stats, level]);

    const value = useMemo(() => ({
        resonators, loading, error,
        current, setCurrent,

        level, setLevel,
        chain, setChain,

        basic, setBasic,
        skill, setSkill,
        forte, setForte,
        ult, setUlt,
        intro, setIntro,

        currentStats, 
    }), [
        resonators, loading, error,
        current,
        level, chain, basic, skill, forte, ult, intro,
        currentStats,
    ]);

  return <ResonatorContext.Provider value={value}>{children}</ResonatorContext.Provider>;
}

export function useResonator() {
  const ctx = useContext(ResonatorContext);
  if (!ctx) throw new Error("useResonator must be used within <ResonatorProvider>");
  return ctx;
}
