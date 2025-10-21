import { useResonator } from "../context/ResonatorContext";
import { useResonatorChain } from "../context/ResonatorChainContext";
import { tokenizeDescription } from '../utils/formatDescription.js';

export default function ChainPanel() {
  const { current } = useResonator();
  const { enabledChain, chainStacks, toggleChain, setChainStack, activeChain } = useResonatorChain();

  if (!current?.chain) return null;


  return (
    <section className="mx-4 mt-6 rounded-2xl p-4">

      <p className="text-xl font-semibold mb-3 text-center text-[var(--color-highlight)]">{current.name} Resonance Chain</p>
      {current?.id === 25 && (
        <p className="text-center mb-4 text-lg font-bold text-[var(--color-highlight)]/75">For August Chains, Make sure only enable the highest chain of 1/2/6, and when Node 1/2/6 is enabled, disable the Crown of Wills in character page.</p>
      )}
      <div className="space-y-6">
        {Object.entries(current.chain).map(([name, node]) => {
          const enabled = !!enabledChain[name];
          const effects = node.effects ?? [];
          const stackable = effects.some(e => e.stack);
          const maxStacks = Math.max(1, ...effects.filter(e => e.stack).map(e => e.maxStack ?? 1));
          const stacks = chainStacks[name] ?? 0;

          return (
            <div key={name} className="rounded-xl border-0 shadow-md p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium text-[var(--color-highlight)]">{name}</div>
                  {node.desc && (
                                      <p className="text-base mt-1">
                                        {tokenizeDescription(node.desc).map((tok, i) => (
                                          <span
                                            key={i}
                                            className={tok.highlight ? "text-[var(--color-highlight)] font-medium" : undefined}
                                          >
                                            {tok.text}
                                          </span>
                                        ))}
                                      </p>
                                    )}
                </div>
                <label className="flex items-center gap-2">
                  <span className="text-sm">Enable</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-500"
                    checked={enabled}
                    onChange={() => toggleChain(name)}
                  />
                </label>
              </div>

              {stackable && enabled && (
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={maxStacks}
                    value={stacks}
                    onChange={(e) => setChainStack(name, e.target.value)}
                    className="w-16 h-8 rounded-md border bg-transparent px-2 py-1"
                  />
                  <span className="text-xs opacity-70">/ {maxStacks}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
