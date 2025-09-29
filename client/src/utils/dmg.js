// --- Enemy terms ---
export function defMultiplier(attackerLevel = 90, enemyLevel = 100, defIgnore = 0, defReduction = 0) {
  const att = 800 + 8 * (attackerLevel ?? 0);
  const enemyDef = 8 * (enemyLevel ?? 0) + 792;
  const effectiveDef = enemyDef * (1 - (defReduction ?? 0)) * (1 - (defIgnore ?? 0));
  return att / (att + effectiveDef);
}

export function resMultiplier(resistance = 0, resShred = 0) {
  return 1 - (resistance - (resShred ?? 0));
}


export function talentMv(baseLevel = 1, maxLevel = 10, baseMV, maxMV, level) {
  const L = Math.max(baseLevel, Math.min(maxLevel, level ?? baseLevel));
  const step = (maxMV - baseMV) / ((maxLevel - baseLevel) || 1);
  return baseMV + step * (L - baseLevel);
}

// --- Core pieces ---
export function skillHit(atk, mv, scalingBonus = 0) {
  // scalingBonus as decimal; applies to MV
  return atk * (mv * (1 + (scalingBonus ?? 0)));
}

export function expectedNonCrit({
  atk,
  mv,
  scalingBonus = 0,
  elementBonus = 0,   
  skillBonus = 0,    
  allAmp = 0,         
  elementAmp = 0,
  skillTypeAmp = 0,
  attackerLevel = 90,
  enemyLevel = 100,
  defIgnore = 0,
  defReduction = 0,
  resistance = 0,
  resShred = 0,
}) {
  const base = skillHit(atk, mv, scalingBonus);
  const damageBonusFactor = 1 + (elementBonus ?? 0) + (skillBonus ?? 0);
  const deepenFactor = 1 + (allAmp ?? 0) + (elementAmp ?? 0) + (skillTypeAmp ?? 0);
  const defMult = defMultiplier(attackerLevel, enemyLevel, defIgnore, defReduction);
  const resMult = resMultiplier(resistance, resShred);
  return base * damageBonusFactor * deepenFactor * defMult * resMult;
}

export function finalHit({
  atk,
  mv,
  scalingBonus = 0,
  elementBonus = 0,
  skillBonus = 0,
  allAmp = 0,
  elementAmp = 0,
  skillTypeAmp = 0,
  attackerLevel = 90,
  enemyLevel = 100,
  defIgnore = 0,
  defReduction = 0,
  resistance = 0,
  resShred = 0,
  critRate = 0,     // 0..1
  critDmgMult = 1,  // crit damage multiplier, e.g. 2.4 for +140%
}) {
  const nonCrit = expectedNonCrit({
    atk, mv, scalingBonus,
    elementBonus, skillBonus,
    allAmp, elementAmp, skillTypeAmp,
    attackerLevel, enemyLevel, defIgnore, defReduction,
    resistance, resShred,
  });

  const crit = nonCrit * (critDmgMult ?? 1);
  const avg = nonCrit * (1 + Math.max(0, Math.min(1, critRate ?? 0)) * ((critDmgMult ?? 1) - 1));
  return { nonCrit, crit, avg };
}