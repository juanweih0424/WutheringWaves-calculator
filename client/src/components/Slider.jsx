export default function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 90,
  step = 1,
  className = "",
  elementColor,
}) {
  const clamp = (n) => Math.min(max, Math.max(min, Number(n) || min));

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between gap-3">
        {label && (
          <span className="font-medium text-sm xl:text-base text-[var(--color-text)]">{label}</span>
        )}
        <div className="flex items-center gap-3">
          <span className="w-8 text-right text-sm xl:text-base text-[var(--color-text)]">{value}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(e.target.value))}
        style={{ accentColor: elementColor }}
        className="mt-3 w-full"
      />
    </div>
  );
}
