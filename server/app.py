from pathlib import Path
import json
from flask import Flask, jsonify, abort, make_response
from flask_cors import CORS
import re

APP_ROOT = Path(__file__).parent

DATA_DIR = APP_ROOT / "data" / "resonators"
WEAPONS_FILE = APP_ROOT / "data" / "weapons" / "weapon.json"

app = Flask(__name__)
app.json.sort_keys = False  
CORS(app, resources={r"/v1/*": {"origins": "*"}})  
_slug_re = re.compile(r"[^a-z0-9]+")

def slugify(name: str) -> str:
    return _slug_re.sub("-", name.lower()).strip("-")


def load_all_weapons() -> list[dict]:
    if not WEAPONS_FILE.exists():
        return []
    try:
        with WEAPONS_FILE.open("r", encoding="utf-8") as f:
            items = json.load(f) or []
    except Exception:
        return []
    # normalize: add slug if missing
    for w in items:
        if "slug" not in w or not w["slug"]:
            w["slug"] = slugify(w.get("name", "weapon"))
    return items

@app.get("/v1/weapons")
def list_weapons():
    """List all weapons from the weapons JSON."""
    items = load_all_weapons()
    resp = make_response(jsonify(items), 200)
    resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp

def load_json(slug: str):
    p = (DATA_DIR / f"{slug}.json")
    if not p.exists():
        return None
    with p.open("r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/v1/resonators")
def list_resonators():
    """List available resonator slugs (and basic info)."""
    items = []
    for p in DATA_DIR.glob("*.json"):
        try:
            obj = json.loads(p.read_text(encoding="utf-8"))
            items.append({"slug": p.stem, 
        "id": obj.get("id"), "name": obj.get("name"), "element": obj.get("element"), 
        "rarity": obj.get("rarity"), "stats":obj.get("stats"), "weapon":obj.get("weapon"), 
        "basic":obj.get("basic"), "skill":obj.get("skill"), "ult":obj.get("ult"),
        "intro":obj.get("intro"),"outro":obj.get("outro"),"forte":obj.get("forte"),
        "minor":obj.get("minor"),
        "self_buff":obj.get("self_buff"),
        "chain": obj.get("chain")})
        except Exception:
            continue
    resp = make_response(jsonify(items), 200)
    resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp

@app.get("/v1/resonators/<slug>")
def get_resonator(slug: str):
    """Return a single resonator (e.g., /v1/resonators/iuno)."""
    obj = load_json(slug.lower())
    if obj is None:
        abort(404, description=f"resonator '{slug}' not found")
    resp = make_response(jsonify(obj), 200)
    resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp

if __name__ == "__main__":
    # For local dev
    app.run(host="0.0.0.0", port=5000, debug=True)
