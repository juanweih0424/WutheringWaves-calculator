import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const EchoContext = createContext(undefined);

const MAX_SLOTS = 5;

const E = 0.3; // elemental %

const MAX_MAIN = {
  1: { hpPct: 0.228, atkPct: 0.18, defPct: 0.18 },
  3: {
    hpPct: 0.3,
    atkPct: 0.3,
    defPct: 0.38,
    er: 0.32,
    aero: E,
    glacio: E,
    fusion: E,
    electro: E,
    havoc: E,
    spectro: E,
  },
  4: { hpPct: 0.33, atkPct: 0.33, defPct: 0.415, cr: 0.22, cd: 0.44, heal: 0.26 },
};

const MAX_SUB = {
  1: { hp: 2280 },
  3: { atk: 100 },
  4: { atk: 150 },
};

// UI options (labels)
export const MAIN_OPTIONS = {
  1: ["HP%", "ATK%", "DEF%"],
  3: [
    "HP%",
    "ATK%",
    "DEF%",
    "Energy Regen",
    "Aero Bouns DMG",
    "Glacio Bouns DMG",
    "Fusion Bouns DMG",
    "Electro Bouns DMG",
    "Havoc Bouns DMG",
    "Spectro Bouns DMG",
  ],
  4: ["ATK%", "HP%", "DEF%", "Crit Rate", "Crit DMG", "Healing Bouns"],
};

export const SUB_OPTIONS = { 1: ["HP"], 3: ["ATK"], 4: ["ATK"] };

/** ===== Substat roll ranges from the image ===== */
export const SUBSTAT_RANGES = {
  cr: [0.063, 0.069, 0.075, 0.081, 0.087, 0.093, 0.099, 0.105],
  cd: [0.126, 0.138, 0.15, 0.162, 0.174, 0.186, 0.198, 0.21],
  hp: [320, 360, 390, 430, 470, 510, 540, 580],
  defPct: [0.081, 0.09, 0.109, 0.109, 0.118, 0.128, 0.138, 0.147],
  atkPct: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  hpPct: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  ult: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  haDmg: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  skill: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  baDmg: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  er: [0.068, 0.076, 0.084, 0.092, 0.1, 0.108, 0.116, 0.124],
  atk: [30, 40, 50, 60],
  def: [40, 50, 60, 70],
};

// label <-> key mapping
const LABEL_TO_KEY = {
  "HP%": "hpPct",
  "ATK%": "atkPct",
  "DEF%": "defPct",
  "Energy Regen": "er",
  "Crit Rate": "cr",
  "Crit DMG": "cd",
  "Healing Bouns": "heal",
  "Aero Bouns DMG": "aero",
  "Glacio Bouns DMG": "glacio",
  "Fusion Bouns DMG": "fusion",
  "Electro Bouns DMG": "electro",
  "Havoc Bouns DMG": "havoc",
  "Spectro Bouns DMG": "spectro",
  "HP": "hp",
  "ATK": "atk",
  "DEF": "def",
  "Basic Bouns DMG": "baDmg",
  "Heavy Bouns DMG": "haDmg",
  "Resonance Skill Bouns DMG": "skill",
  "Resonance Liberation Bouns DMG": "ult",
};

const KEY_TO_LABEL = {
  hpPct: "HP%",
  atkPct: "ATK%",
  defPct: "DEF%",
  er: "Energy Regen",
  cr: "Crit Rate",
  cd: "Crit DMG",
  heal: "Healing Bouns",
  aero: "Aero Bouns DMG",
  glacio: "Glacio Bouns DMG",
  fusion: "Fusion Bouns DMG",
  electro: "Electro Bouns DMG",
  havoc: "Havoc Bouns DMG",
  spectro: "Spectro Bouns DMG",
  hp: "HP",
  atk: "ATK",
  def: "DEF",
  baDmg: "Basic Bouns DMG",
  haDmg: "Heavy Bouns DMG",
  skill: "Resonance Skill Bouns DMG",
  ult: "Resonance Liberation Bouns DMG",
};

export function statKeyFromLabel(label) {
  return LABEL_TO_KEY[label] || null;
}
export function labelFromStatKey(key) {
  return KEY_TO_LABEL[key] || key?.toUpperCase() || "";
}

export const ELEMENT_KEYS = new Set([
  "aero",
  "glacio",
  "fusion",
  "electro",
  "havoc",
  "spectro",
]);

// ---------- helpers ----------
function fromLabel(label) {
  return LABEL_TO_KEY[label] || null;
}
function getRangeForKey(key) {
  const arr = SUBSTAT_RANGES[key];
  if (!arr) return null;
  return { min: arr[0], max: arr[arr.length - 1] };
}
function clampToRange(key, value) {
  const r = getRangeForKey(key);
  if (!r) return Number(value);
  return Math.min(Math.max(Number(value), r.min), r.max);
}
const ensureList = (a) => (Array.isArray(a) ? a : []);

// fixed auto-sub by cost
function getAutoSub(cost) {
  if (!cost || !MAX_SUB[cost]) return null;
  const key = Object.keys(MAX_SUB[cost])[0];
  const value = MAX_SUB[cost][key];
  return {
    stat: key,
    value,
    statLabel: KEY_TO_LABEL[key] ?? key.toUpperCase(),
  };
}

function normalizeStatKey(stat) {
  if (!stat) return null;
  if (KEY_TO_LABEL[stat]) return stat;          // already a key (e.g., "ult")
  if (LABEL_TO_KEY[stat]) return LABEL_TO_KEY[stat]; // came as label -> map
  return null;
}

export function EchoProvider({ echoes = [], children }) {
  const catalog = Array.isArray(echoes) ? echoes : [];

  const emptySlot = {
    echo: null,
    cost: null,
    main: null,
    sub: null,       // fixed, from cost
    subStats: [],    // user minis (no duplicates allowed)
    skillEnabled: false,
  };

  const [equipped, setEquipped] = useState(
    Array.from({ length: MAX_SLOTS }, () => ({ ...emptySlot }))
  );

  // Normalize state in case HMR kept old shape
  useEffect(() => {
    setEquipped((prev) =>
      prev.map((s) => ({
        ...emptySlot,
        ...s,
        subStats: ensureList(s?.subStats),
      }))
    );
  }, []);

  // actions
  const equipEcho = (slot, echo) =>
    setEquipped((prev) => {
      const next = prev.slice();
      const cost = Number(echo?.cost) || null;
      next[slot] = {
        echo,
        cost,
        main: null,
        sub: getAutoSub(cost),
        subStats: [],
        skillEnabled: false,
      };
      return next;
    });

  const unequipEcho = (slot) =>
    setEquipped((prev) => {
      const next = prev.slice();
      next[slot] = { ...emptySlot };
      return next;
    });

  const clearEquipped = () =>
    setEquipped(Array.from({ length: MAX_SLOTS }, () => ({ ...emptySlot })));

  const setSkillEnabled = (slot, enabled) =>
    setEquipped((prev) => {
      const cur = prev[slot];
      if (!cur?.echo) return prev;
      const next = prev.slice();
      next[slot] = { ...cur, skillEnabled: !!enabled };
      return next;
    });

  const setMainStat = (slot, label) =>
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item?.cost) return prev;
      const key = fromLabel(label);
      if (!key) return prev;
      const val = MAX_MAIN[item.cost]?.[key];
      if (val == null) return prev;
      const next = prev.slice();
      next[slot] = {
        ...item,
        main: { stat: key, value: val, statLabel: label },
      };
      return next;
    });

  // ----- user mini-stats (up to 5, NO duplicates) -----
  const addSubStat = (slot) =>
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item?.echo) return prev;
      const list = ensureList(item.subStats);
      if (list.length >= 5) return prev;
      const next = prev.slice();
      next[slot] = {
        ...item,
        subStats: [...list, { stat: null, statLabel: "", value: null }],
      };
      return next;
    });

  const removeSubStat = (slot, idx) =>
    setEquipped((prev) => {
      const item = prev[slot];
      if (!item?.echo) return prev;
      const list = ensureList(item.subStats);
      if (!list[idx]) return prev;
      const copy = list.slice();
      copy.splice(idx, 1);
      const next = prev.slice();
      next[slot] = { ...item, subStats: copy };
      return next;
    });

  const setSubStatLabel = (slot, idx, label) =>
    setEquipped((prev) => {
      const item = prev[slot];
      const list = ensureList(item?.subStats);
      const row = list[idx];
      const key = fromLabel(label);
      if (!item?.echo || !row || !key) return prev;

      // BLOCK duplicates (exclude current row from the check)
      const used = new Set(
        list.map((r, k) => (k === idx ? null : r?.stat)).filter(Boolean)
      );
      if (used.has(key)) {
        // duplicate -> ignore change
        return prev;
      }

      const copy = list.slice();
      // reset to a valid tier (lowest) when label changes
      const tiers = SUBSTAT_RANGES[key];
      const initial = Array.isArray(tiers) && tiers.length ? tiers[0] : null;
      copy[idx] = { stat: key, statLabel: label, value: initial };
      const next = prev.slice();
      next[slot] = { ...item, subStats: copy };
      return next;
    });

  const setSubStatValue = (slot, idx, value) =>
    setEquipped((prev) => {
      const item = prev[slot];
      const list = ensureList(item?.subStats);
      const row = list[idx];
      if (!item?.echo || !row?.stat) return prev;
      const copy = list.slice();
      copy[idx] = { ...row, value: clampToRange(row.stat, value) };
      const next = prev.slice();
      next[slot] = { ...item, subStats: copy };
      return next;
    });

  // derived totals
  const count = useMemo(
    () => equipped.filter((s) => !!s.echo).length,
    [equipped]
  );

  const echoTotals = useMemo(() => {
    const t = Object.create(null);
    equipped.forEach((s, idx) => {
      if (s?.main) t[s.main.stat] = (t[s.main.stat] ?? 0) + s.main.value;
      if (s?.sub) t[s.sub.stat] = (t[s.sub.stat] ?? 0) + s.sub.value; // fixed
      if (s?.subStats?.length) {
        for (const row of s.subStats) {
          if (row?.stat && typeof row.value === "number") {
            t[row.stat] = (t[row.stat] ?? 0) + row.value;
          }
        }
      }
    if (idx === 0 && s?.skillEnabled) {
      const effects = s?.echo?.skill?.effects || [];
      for (const ef of effects) {
        const key = normalizeStatKey(ef?.stat ?? ef?.key ?? ef?.id);
        const val = Number(ef?.value);
        if (key && Number.isFinite(val)) {
          t[key] = (t[key] ?? 0) + val;
        }
      }
    }
    });
    return t;
  }, [equipped]);

  const value = useMemo(
    () => ({
      catalog,
      equipped,
      MAX_SLOTS,
      count,
      echoTotals,
      // actions
      equipEcho,
      unequipEcho,
      clearEquipped,
      setMainStat,
      setSkillEnabled,
      addSubStat,
      removeSubStat,
      setSubStatLabel,
      setSubStatValue,
      // options for UI
      MAIN_OPTIONS,
      SUB_OPTIONS,
      // expose helpers
      statKeyFromLabel,
      labelFromStatKey,
      ELEMENT_KEYS,
      getRangeForKey,
      SUBSTAT_RANGES, // expose tiers so UI can build discrete slider
    }),
    [catalog, equipped, count, echoTotals]
  );

  return (
    <EchoContext.Provider value={value}>{children}</EchoContext.Provider>
  );
}

export function useEcho() {
  const ctx = useContext(EchoContext);
  if (!ctx) throw new Error("useEcho must be used within <EchoProvider>");
  return ctx;
}
