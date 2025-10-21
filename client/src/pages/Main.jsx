import LeftPanel from "../panel/LeftPanel"
import { useOutletContext } from "react-router-dom";
import { ResonatorProvider } from "../context/ResonatorContext";
import { EnemyProvider } from "../context/EnemyContext";
import { fetchAllResonators, fetchAllWeapons, fetchAllEcho, fetchAllSet } from "../utils/dataLoader";
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
import { EchoProvider } from "../context/EchoContext";
import { EchoSetProvider } from "../context/EchoSetContext";
import { BuffProvider } from "../context/TeamBuffContext";
import { WeaponBuffProvider } from "../context/WeaponBuffContext";
import { ResonatorBuffProvider } from "../context/ResonatorBuffContext";

export default function Main() {
  const { activePage } = useOutletContext();
  
  const [resonators, setResonators] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [echoes, setEchoes] = useState();
  const [echoSet, setEchoSet] = useState();

  const [loadingRes, setLoadingRes] = useState(true);
  const [loadingWeap, setLoadingWeap] = useState(true);
  const [loadingEcho, setLoadingEcho] = useState(true);
  const [loadingSet, setLoadingSet] = useState(true);

  const [errRes, setErrRes] = useState(null);
  const [errWeap, setErrWeap] = useState(null);
  const [errEcho, setErrEcho] = useState(null);
  const [errorSet, setErrSet] = useState(null);


  /* fetch once on mount */
  useEffect(() => {
    const cRes = new AbortController();
    const cWeap = new AbortController();
    const cEcho = new AbortController();
    const cSet = new AbortController();

    setLoadingRes(true); setErrRes(null);
    setLoadingWeap(true); setErrWeap(null);
    setLoadingEcho(true); setErrEcho(null);
    setLoadingSet(true); setErrSet(null);

    fetchAllResonators(cRes.signal)
      .then(d => setResonators(Array.isArray(d) ? d : []))
      .catch(e => { if (e.name !== "AbortError") setErrRes(String(e.message || e)); })
      .finally(() => setLoadingRes(false));

    fetchAllWeapons(cWeap.signal)
      .then(d => setWeapons(Array.isArray(d) ? d : []))
      .catch(e => { if (e.name !== "AbortError") setErrWeap(String(e.message || e)); })
      .finally(() => setLoadingWeap(false));

    fetchAllEcho(cEcho.signal)
      .then((d => setEchoes(Array.isArray(d) ? d : [])))
      .catch(e => { if (e.name !== "AbortError") setErrEcho(String(e.message || e)); })
      .finally(() => setLoadingEcho(false));
    
    fetchAllSet(cSet.signal)
      .then((d => setEchoSet(Array.isArray(d) ? d : [])))
      .catch(e => { if (e.name !== "AbortError") setErrSet(String(e.message || e)); })
      .finally(() => setLoadingSet(false));

    return () => { cRes.abort(); cWeap.abort(); cEcho.abort(); cSet.abort()};
  }, []);


  if (loadingRes || loadingWeap || loadingEcho || loadingSet) {
    return <div className="p-4">Loading…</div>;
  }

  if (errRes || errWeap || errEcho || errorSet) {
    return (
      <div className="p-4 text-red-500">
        {errRes && <div>Resonators: {errRes}</div>}
        {errWeap && <div>Weapons: {errWeap}</div>}
        {errEcho && <div>Echo: {errEcho}</div>}
        {errorSet && <div>Set: {errorSet}</div>}
      </div>
    );
  }

  return (
    <ResonatorProvider items={resonators}>
      <ResonatorChainProvider>
      <WeaponProvider weapons={weapons}>
        <EchoProvider echoes={echoes}>
          <EchoSetProvider setsCatalog={echoSet}>
          <BuffProvider>
            <ResonatorBuffProvider>
            <WeaponBuffProvider>
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
        </WeaponBuffProvider>
        </ResonatorBuffProvider>
        </BuffProvider>
        </EchoSetProvider>
        </EchoProvider>
      </WeaponProvider>
      </ResonatorChainProvider>
    </ResonatorProvider>
  )
}
