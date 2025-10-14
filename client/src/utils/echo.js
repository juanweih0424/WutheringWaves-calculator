const echoImgMap = (() => {
  // This MUST match your folder: src/assets/images/characters/echos/*.png
  const mods = import.meta.glob(
    "/src/assets/images/echos/*.png",
    { eager: true, import: "default" }
  );

  const byId = Object.create(null);
  for (const [path, url] of Object.entries(mods)) {
    // path looks like: "/src/assets/images/characters/echos/726.png"
    const m = path.match(/\/echos\/(\d+)\.png$/i);
    if (m) byId[m[1]] = url; // e.g. "726" -> "/assets/.../726.png"
  }
  return byId;
})();

/** Get echo image URL by numeric/string id. Returns null if not found. */
export function getEchoImageUrl(id) {
  if (id == null) return null;
  return echoImgMap[String(id)] ?? null;
}


const setImgs = import.meta.glob(
  "/src/assets/images/echoset/*.png",
  { eager: true, import: "default" }
);

// Build map: "1000" -> URL
const setMap = {};
for (const [path, url] of Object.entries(setImgs)) {
  const m = path.match(/\/echoset\/(\d+)\.png$/);
  if (m) setMap[m[1]] = url;
}

/** Get echo-set image by id (number|string). Returns null if not found. */
export function getEchoSetImageUrl(id) {
  if (id == null) return null;
  return setMap[String(id)] ?? null;
}