// Base Url
const BASE_URL = "http://127.0.0.1:5000/v1"

// Cache
let _cacheResonators = null;
let _cacheWeapons = null;

export async function fetchAllResonators(signal) {
  if (_cacheResonators) return _cacheResonators;
  const res = await fetch(`${BASE_URL}/resonators`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch resonators (${res.status})`);
  const json = await res.json();
  _cacheResonators = json;
  return json;
}

export async function fetchAllWeapons(signal) {
  if (_cacheWeapons) return _cacheWeapons;
  const res = await fetch(`${BASE_URL}/weapons`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch weapons (${res.status})`);
  const json = await res.json();
  _cacheWeapons = json;
  return json;
}