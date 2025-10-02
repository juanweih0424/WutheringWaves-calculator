import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useResonator } from "./ResonatorContext";

const ChainContext = createContext(null);

function normalizeChain(rawChain = []) {
  return rawChain.map((node, index) => ({
    id: index + 1,          
    ...node,
  }));
}

export function ChainProvider({children}){

    const {current} = useResonator();
    const rawChain = current?.chain ?? [];


    
    const value = useMemo(() => normalizeChain(rawChain ?? []), [rawChain]);

    return <ChainContext.Provider value={value}>{children}</ChainContext.Provider>;
}

export function useChain() {
  const ctx = useContext(ChainContext);
  if (!ctx) throw new Error("");
  return ctx;
}