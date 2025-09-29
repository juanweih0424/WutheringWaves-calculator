const weaponImages = import.meta.glob('../assets/images/weapons/*', { eager: true });

export function getWeaponImageUrl(icon) {
  if (!icon) return null;

  const entry = Object.entries(weaponImages).find(([path]) =>
    path.includes(`/${icon}`)
  );

  return entry ? entry[1].default : null;
}