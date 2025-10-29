import React, { useEffect, useState } from "react";
import { fetchAllResonators, fetchAllWeapons, fetchAllEcho, fetchAllSet } from "../utils/dataLoader";

import { ResonatorProvider } from "../context/ResonatorContext";
import { ResonatorChainProvider } from "../context/ResonatorChainContext";
import { WeaponProvider } from "../context/WeaponContext";
import { EchoProvider } from "../context/EchoContext";
import { EchoSetProvider } from "../context/EchoSetContext";
import { BuffProvider } from "../context/TeamBuffContext";
import { ResonatorBuffProvider } from "../context/ResonatorBuffContext";
import { WeaponBuffProvider } from "../context/WeaponBuffContext";
import { EnemyProvider } from "../context/EnemyContext";

export default function AppProvider({ children }) {
  const [resonators, setResonators] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [echoes, setEchoes] = useState([]);
  const [echoSet, setEchoSet] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const cRes = new AbortController();
    const cWeap = new AbortController();
    const cEcho = new AbortController();
    const cSet = new AbortController();

    async function load() {
      try {
        setLoading(true); setErr(null);
        const [r, w, e, s] = await Promise.all([
          fetchAllResonators(cRes.signal),
          fetchAllWeapons(cWeap.signal),
          fetchAllEcho(cEcho.signal),
          fetchAllSet(cSet.signal),
        ]);
        setResonators(Array.isArray(r) ? r : []);
        setWeapons(Array.isArray(w) ? w : []);
        setEchoes(Array.isArray(e) ? e : []);
        setEchoSet(Array.isArray(s) ? s : []);
      } catch (e) {
        if (e?.name !== "AbortError") setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { cRes.abort(); cWeap.abort(); cEcho.abort(); cSet.abort(); };
  }, []);

  if (err) return <div className="p-4 text-red-500">Data load error: {err}</div>;

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
                      {children}
                    </EnemyProvider>
                  </WeaponBuffProvider>
                </ResonatorBuffProvider>
              </BuffProvider>
            </EchoSetProvider>
          </EchoProvider>
        </WeaponProvider>
      </ResonatorChainProvider>
    </ResonatorProvider>
  );
}
