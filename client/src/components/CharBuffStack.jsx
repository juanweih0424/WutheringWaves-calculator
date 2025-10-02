// components/CharPassiveStacks.jsx
import { useResonator } from "../context/ResonatorContext";
import {tokenizeDescription} from "../utils/formatDescription"

export default function CharBuffStack() {

  const { passStacks, setPassStacks,charPassive } = useResonator();

  if (!charPassive?.stackable) return null;

  const tokens = tokenizeDescription(charPassive.description);
  const max = charPassive.maxStacks ?? 0;

  const onChange = (v) => {
    const n = Math.max(0, Math.min(max, Number(v) || 0));
    setPassStacks(n);
  };

  return (
    <div className="rounded-xl border-0 shadow-2xl grid gap-3 mx-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-medium text-lg text-[var(--color-highlight)]">
          {charPassive.name ?? "Self Buff"}
        </p>
      </div>
    {charPassive.description && (
    <p className="text-sm leading-relaxed">
      {tokens.map((t, i) =>
        t.highlight ? (
          <span key={i} className="text-[var(--color-highlight)] font-semibold">
            {t.text}
          </span>) : (<span key={i}>{t.text}</span>))}</p>)}
      <div className="flex items-center">
        <label className="text-base w-16">Stacks :</label>
        <input
          type="number"
          min={0}
          max={max}
          value={passStacks}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded-md bg-gray-500/20 px-2 py-1"
        />
      </div>
    </div>
  );
}
