import LeftPanel from "../panel/LeftPanel"
import { useOutletContext } from "react-router-dom";
import { ResonatorProvider } from "../context/ResonatorContext";
import { EnemyProvider } from "../context/EnemyContext";
import { fetchAllResonators, fetchAllWeapons } from "../utils/dataLoader";
import {useState, useEffect} from 'react';
import { WeaponProvider } from "../context/WeaponContext";
import { ResonatorChainProvider } from "../context/ResonatorChainContext";
import { useResonator } from "../context/ResonatorContext";
import Stats from "../panel/Stats";
import Basic from '../components/Basic';
import Skill from "../components/Skill";
import Forte from "../components/Forte";
import Ult from "../components/Ult";
import Intro from "../components/Intro";
import Outro from "../components/Outro";

export default function Main() {
  const { activePage } = useOutletContext();
  
  const [resonators, setResonators] = useState([]);
  const [weapons, setWeapons] = useState([]);

  const [loadingRes, setLoadingRes] = useState(true);
  const [loadingWeap, setLoadingWeap] = useState(true);

  const [errRes, setErrRes] = useState(null);
  const [errWeap, setErrWeap] = useState(null);


  /* fetch once on mount */
  useEffect(() => {
    const cRes = new AbortController();
    const cWeap = new AbortController();

    setLoadingRes(true); setErrRes(null);
    setLoadingWeap(true); setErrWeap(null);

    fetchAllResonators(cRes.signal)
      .then(d => setResonators(Array.isArray(d) ? d : []))
      .catch(e => { if (e.name !== "AbortError") setErrRes(String(e.message || e)); })
      .finally(() => setLoadingRes(false));

    fetchAllWeapons(cWeap.signal)
      .then(d => setWeapons(Array.isArray(d) ? d : []))
      .catch(e => { if (e.name !== "AbortError") setErrWeap(String(e.message || e)); })
      .finally(() => setLoadingWeap(false));

    return () => { cRes.abort(); cWeap.abort(); };
  }, []);


  if (loadingRes || loadingWeap) {
    return <div className="p-4">Loading…</div>;
  }

  if (errRes || errWeap) {
    return (
      <div className="p-4 text-red-500">
        {errRes && <div>Resonators: {errRes}</div>}
        {errWeap && <div>Weapons: {errWeap}</div>}
      </div>
    );
  }
  return (
    <ResonatorProvider items={resonators}>
      <ResonatorChainProvider>
      <WeaponProvider weapons={weapons}>
        <EnemyProvider>
        <div className="w-full p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4">
            <aside className="lg:sticky
              h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto
              ">
                <LeftPanel activePanel={activePage}/>
            </aside>

            <aside className="lg:sticky
              h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto flex gap-y-6 flex-col
              ">
                <Stats/>
                <Basic/>
                <Skill/>
                <Forte/>
                <Ult/>
                <Intro/>
                <Outro/>
            </aside>
          </div>
        </div>
        </EnemyProvider>
      </WeaponProvider>
      </ResonatorChainProvider>
    </ResonatorProvider>
  )
}
