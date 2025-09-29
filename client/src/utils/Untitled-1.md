

Formula:

Character base Atk / Hp / Def -> (Character atk/hp/def associated with level + Weapon atk/def/hp associated with Level) -> Character Base

AtkPct/HpPct/DefPct -> (all source of pct attack including echoes, inherent skill, resonance chain, character ability, ...etc) we can conclude this value as AtkPct/HpPct/DefPct  (some character skills are based on hp/def not atk inclusively)

FlatAtk/FlatHp/FlatDef -> (same as above)

Skill Multiplier -> (each ability specific multiplier * (1+ special bouns multiplier if any, could be none, usually from resonance chain))

The first part of the Expected Damage Hit is from the above variable we can get: (CharacterBase * Pct + Flat) * Skill Multiplier = ExpectedHit

Then we take this EH variable -> EH * (specific element bouns based on Character[aero/glacio/fusion/havoc/spectro/electro] from all sources + the specific skill dmg bouns (normalatk/heavyatk/liberation/skill/echo) ) * alldeepen effect * critdmg

Then we use this variable acquired as FinalHit then FinalHit*(eneymy defenceMultiplier * (1-resis+resisReduction[from all sources])) 

Lastly the result is final dmg