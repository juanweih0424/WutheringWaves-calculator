import { createContext, useContext, useEffect, useMemo, useState } from "react";


const EnemyContext = createContext(null);

export function EnemyProvider({children}) {

    const [enemylvl, setEnemylvl] = useState(100);
    const [enemyres, setEnemyres] = useState(20);

    const value = useMemo(
        () => ({
        enemylvl, setEnemylvl,
        enemyres, setEnemyres,
        }),
        [enemylvl, enemyres]
    );

    return <EnemyContext.Provider value={value}>{children}</EnemyContext.Provider>;
}

export function useEnemy() {
  const ctx = useContext(EnemyContext);
  if (!ctx) throw new Error("");
  return ctx;
}