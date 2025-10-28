import { useMemo } from "react";

const normaliseTags = (tags) => {
  if (!tags) return [];
  return Array.isArray(tags) ? tags : [tags];
};

export const useDetailMap = (current) =>
  useMemo(
    () => ({
      basic: current?.basic?.detail ?? null,
      skill: current?.skill?.detail ?? null,
      forte: current?.forte?.detail ?? null,
      ult: current?.ult?.detail ?? null,
      intro: current?.intro?.detail ?? null,
      outro: current?.outro?.detail ?? null,
    }),
    [current]
  );

export const collectExtensions = (activeChain, detailMap, targetKey) =>
  (activeChain ?? [])
    .map((effect, idx) => {
      const ext = effect.extend;
      if (!ext || ext.target !== targetKey) return null;

      let base = ext.base ?? null;
      let max = ext.max ?? null;
      let type = ext.type ?? null;
      const tags = normaliseTags(ext.tags);
      let ratioOfSection = null;
      let ratioOfRow = null;
      let ratioValue = null;

      if (ext.ratioOf) {
        const sectionKey = ext.ratioOf.section ?? targetKey;
        const rowKey = ext.ratioOf.row ?? "";
        const srcSection = detailMap?.[sectionKey] ?? null;
        const srcRow = srcSection?.[rowKey] ?? null;
        const ratio = Number(ext.ratioOf.ratio ?? 0);
        if (!srcRow || !ratio) return null;

        base = Number(srcRow.base ?? 0) * ratio;
        max = Number(srcRow.max ?? 0) * ratio;
        type = type ?? srcRow.type ?? null;
        if (!tags.length && srcRow.tags) {
          const srcTags = normaliseTags(srcRow.tags);
          if (srcTags.length) tags = srcTags;
        }
        ratioOfSection = sectionKey;
        ratioOfRow = rowKey;
        ratioValue = ratio;
      }

      if (base == null || max == null || !type) return null;

      return {
        key: `ext-${idx}`,
        label: ext.label ?? `Chain Extension ${idx + 1}`,
        base,
        max,
        type,
        tags,
        frazzle: ext.frazzle ?? null,
        erosion: ext.erosion ?? null,
        ratioOfSection,
        ratioOfRow,
        ratioValue,
      };
    })
    .filter(Boolean);

export const mergeAbilityWithExtensions = (baseDetail, extensions, targetKey) => {
  if (!baseDetail && !extensions.length) {
    return { ability: null, ratioMeta: {} };
  }

  const ability = baseDetail ? { ...baseDetail } : {};
  const ratioMeta = {};

  extensions.forEach((ext) => {
    let label = ext.label;
    if (ability[label]) {
      let counter = 1;
      let candidate = `${label} (Chain)`;
      while (ability[candidate]) {
        counter += 1;
        candidate = `${label} (Chain ${counter})`;
      }
      label = candidate;
    }

    ability[label] = {
      base: ext.base,
      max: ext.max,
      type: ext.type,
      tags: ext.tags,
      frazzle: ext.frazzle,
      erosion: ext.erosion,
    };

    if (ext.ratioOfRow) {
      ratioMeta[label] = {
        section: ext.ratioOfSection ?? targetKey,
        row: ext.ratioOfRow,
        ratio: ext.ratioValue,
      };
    }
  });

  return { ability, ratioMeta };
};

export const applyRatioScaling = (rows, ratioMeta = {}, sectionKey) => {
  if (!rows?.length) return rows ?? [];
  const lookup = new Map();
  rows.forEach((row) => {
    lookup.set(row.label, row);
  });

  return rows.map((row) => {
    const info = ratioMeta[row.label];
    if (!info || !info.ratio) return row;
    const section = info.section ?? sectionKey;
    if (section !== sectionKey) return row;
    const source = lookup.get(info.row);
    if (!source) return row;

    const ratio = Number(info.ratio ?? 0);
    return {
      ...row,
      baseMv: source.baseMv * ratio,
      mv: source.mv * ratio,
    };
  });
};
