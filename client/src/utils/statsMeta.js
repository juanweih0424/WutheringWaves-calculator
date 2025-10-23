export const statsMeta = [
  { key: "atk",     label: "Attack",                         fmt: v => `${v.toFixed(0)}` },
  { key: "hp",      label: "HP",                             fmt: v => `${v.toFixed(0)}`},
  { key: "def",     label: "Defense",                        fmt: v => `${v.toFixed(0)}`},
  { key: "cr",      label: "Crit Rate",                      fmt: v => `${v.toFixed(1)}%` },
  { key: "cd",      label: "Crit DMG",                       fmt: v => `${v.toFixed(1)}%` },
  { key: "er",      label: "Energy Regen",                   fmt: v => `${v.toFixed(1)}%` },
  { key: "baDmg",   label: "Basic Attack DMG Bonus",         fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "haDmg",   label: "Heavy Attack DMG Bonus",         fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "skill",   label: "Resonance Skill DMG Bonus",      fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "ult",     label: "Resonance Liberation DMG Bonus", fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "echoDmg",    label: "Echo DMG Bouns",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "glacio",  label: "Glacio DMG Bonus",               fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "fusion",  label: "Fusion DMG Bonus",               fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "electro", label: "Electro DMG Bonus",              fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "aero",    label: "Aero DMG Bonus",                 fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "spectro", label: "Spectro DMG Bonus",              fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "havoc",   label: "Havoc DMG Bonus",                fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "heal",    label: "Healing Bonus",                  fmt: v => `${(v*100).toFixed(1)}%` },
];

export const buffMeta = [
  { key: "atk",     label: "Attack",                         fmt: v => `${v.toFixed(0)}` },
  { key: "hp",      label: "HP",                             fmt: v => `${v.toFixed(0)}`},
  { key: "def",     label: "Defense",                        fmt: v => `${v.toFixed(0)}`},
  { key: "cr",      label: "Crit Rate",                      fmt: v => `${v.toFixed(1)}%` },
  { key: "cd",      label: "Crit DMG",                       fmt: v => `${v.toFixed(1)}%` },
  { key: "er",      label: "Energy Regen",                   fmt: v => `${v.toFixed(1)}%` },
  { key: "baDmg",   label: "Basic Attack DMG Bonus",         fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "haDmg",   label: "Heavy Attack DMG Bonus",         fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "skill",   label: "Resonance Skill DMG Bonus",      fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "ult",     label: "Resonance Liberation DMG Bonus", fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "glacio",  label: "Glacio DMG Bonus",               fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "fusion",  label: "Fusion DMG Bonus",               fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "electro", label: "Electro DMG Bonus",              fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "aero",    label: "Aero DMG Bonus",                 fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "spectro", label: "Spectro DMG Bonus",              fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "havoc",   label: "Havoc DMG Bonus",                fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "havocTm",   label: "Havoc DMG Bonus",                fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "fusionAll",   label: "Fusion",                fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "aeroTm",   label: "Fusion",                fmt: v => `${(v*100).toFixed(1)}%`, isElement: true },
  { key: "heal",    label: "Healing Bonus",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "echoDmg",    label: "Echo DMG Bouns",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "defIgnore",    label: "DEF Ignore",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "allAmp",    label: "Amplification",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "aeroShred",    label: "Aero Shred",                  fmt: v => `${(v*100).toFixed(1)}%` },
  { key: "havocShred",    label: "Havoc Shred",                  fmt: v => `${(v*100).toFixed(1)}%` },
]


export const statIcons = import.meta.glob('../assets/images/stats/*.webp', {
  eager: true,
  as: 'url'
});

export const getIconForStat = (key) =>
  statIcons[`../assets/images/stats/${key}.webp`];