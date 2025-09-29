// src/utils/stats.js
export function characterToStats(c) {
  const base = c?.stats ?? {};
  return {
    // core
    atk: base.atk?.base ?? 0,
    hp: base.hp?.base ?? 0,
    def: base.def?.base ?? 0,
    cd: base.cd ?? 0,
    cr: base.cr ?? 0,
    er: base.er ?? 0,

    // dmg bonuses (default 0 until you compute gear/buffs)
    baDmg: 0,
    haDmg: 0,
    skill: 0,
    ult: 0,

    // element bonuses (if you use them in statsMeta)
    glacio: 0,
    fusion: 0,
    electro: 0,
    aero: 0,
    spectro: 0,
    havoc: 0,
    heal: 0,
  };
}
