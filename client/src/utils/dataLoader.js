// Base Url
const API = (import.meta?.env?.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
export const BASE_URL = `${API}/v1`;


// Cache
let _cacheResonators = null;
let _cacheWeapons = null;
let _cacheEcho = null;
let _cacheEchoSet = null;

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

export async function fetchAllEcho(signal) {
  if (_cacheEcho) return _cacheEcho;
  const res = await fetch(`${BASE_URL}/echoes`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch echo (${res.status})`);
  const json = await res.json();
  _cacheEcho = json;
  return json;
}


export async function fetchAllSet(signal) {
  if (_cacheEchoSet) return _cacheEchoSet;
  const res = await fetch(`${BASE_URL}/echoset`, { signal });
  if (!res.ok) throw new Error(`Failed to fetch echo (${res.status})`);
  const json = await res.json();
  _cacheEchoSet = json;
  return json;
}