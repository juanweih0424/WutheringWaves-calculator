export const statsMeta = [
  { key: "atk",     label: "Attack",                         fmt: v => v },
  { key: "hp",      label: "HP",                             fmt: v => v.toLocaleString()},
  { key: "def",     label: "Defense",                        fmt: v => v },
  { key: "cr",      label: "Crit Rate",                      fmt: v => `${v.toFixed(1)}%` },
  { key: "cd",      label: "Crit DMG",                       fmt: v => `${v.toFixed(1)}%` },
  { key: "er",      label: "Energy Regen",                   fmt: v => `${v.toFixed(1)}%` },
  { key: "baDmg",   label: "Basic Attack DMG Bonus",         fmt: v => `${v.toFixed(1)}%` },
  { key: "haDmg",   label: "Heavy Attack DMG Bonus",         fmt: v => `${v.toFixed(1)}%` },
  { key: "skill",   label: "Resonance Skill DMG Bonus",      fmt: v => `${v.toFixed(1)}%` },
  { key: "ult",     label: "Resonance Liberation DMG Bonus", fmt: v => `${v.toFixed(1)}%` },
  { key: "glacio",  label: "Glacio DMG Bonus",               fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "fusion",  label: "Fusion DMG Bonus",               fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "electro", label: "Electro DMG Bonus",              fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "aero",    label: "Aero DMG Bonus",                 fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "spectro", label: "Spectro DMG Bonus",              fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "havoc",   label: "Havoc DMG Bonus",                fmt: v => `${v.toFixed(1)}%`, isElement: true },
  { key: "heal",    label: "Healing Bonus",                  fmt: v => `${v.toFixed(1)}%` },
];


export const statIcons = import.meta.glob('../assets/images/stats/*.webp', {
  eager: true,
  as: 'url'
});

export const getIconForStat = (key) =>
  statIcons[`../assets/images/stats/${key}.webp`];