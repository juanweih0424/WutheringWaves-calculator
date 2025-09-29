export const getCharacterImageUrl = (() => {
  const images = import.meta.glob("../assets/images/characters/avatar/*.webp", {
    eager: true,
    import: "default",
  });

  const map = {};
  for (const path in images) {
    const id = path.match(/(\d+)\.webp$/)?.[1];
    if (id) map[id] = images[path];
  }
  return (id) => map[id] ?? null;
})();

export const getCharacterWeaponUrl = (() => {
  const images = import.meta.glob("../assets/images/weapontype/*.png", {
    eager: true,
    import: "default",
  });

  const map = {};
  for (const path in images) {

    const key = path.match(/\/([^/]+)\.png$/)?.[1];
    if (key) map[key.toLowerCase()] = images[path];
  }

  return (weaponType) => {
    if (!weaponType) return null;
    const slug = weaponType.toString().trim().toLowerCase(); 
    return map[slug] ?? null;
  };
})();

export const getCharacterElementUrl = (() => {
  const images = import.meta.glob("../assets/images/element/*.webp", {
    eager: true,
    import: "default",
  });

  const map = {};
  for (const path in images) {
    const key = path.match(/\/([^/]+)\.webp$/)?.[1]; 
    if (key) map[key.toLowerCase()] = images[path]; 
  }

  return (elementName) => {
    if (!elementName) return null;
    const slug = elementName.toString().trim().toLowerCase();
    return map[slug] ?? null;
  };
})();

export const getCharacterInherentUrl = (() => {
  const images = import.meta.glob("../assets/images/characters/characterAbility/*.webp", {
    eager: true,
    import: "default",
  });

  const map = {};
  for (const path in images) {
    const key = path.match(/\/([^/]+)\.webp$/)?.[1]; 
    if (key) map[key.toLowerCase()] = images[path]; 
  }

  return (elementName) => {
    if (!elementName) return null;
    const slug = elementName.toString().trim().toLowerCase();
    return map[slug] ?? null;
  };
})();