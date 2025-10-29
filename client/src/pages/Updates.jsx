import React, { useMemo } from "react";

const UPDATES = [
  {
    version: "v 0.8.0",
    date: "2025-10-28",
    highlights: [
      "Beta Version : Most 5 stars Main DPS Characters are added + Sanhua buff only",
      "Note: If the selected Resonator does not have any DMG output, it means I have not added the data yet"
    ],
    changes: [
      { type: "add", text: "Formula page" },
      { type: "change", text: "Augusta/Carlotta/Camellya/Phrolova description for extra damage format on their resonator chains" },
      { type: "fix", text: "Typo in Phorolva S6" },
    ],
  }
];

const TYPE_STYLES = {
  add: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  fix: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  change: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  tweak: "bg-sky-500/15 text-sky-300 ring-sky-400/20",
};

function Pill({ type }) {
  const cls = TYPE_STYLES[type] ?? "bg-slate-500/15 ring-slate-400/20";
  const label = (type ?? "change").toUpperCase();
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${cls}`}>
      {label}
    </span>
  );
}

function ChangelogItem({ item }) {
  const anchor = useMemo(() => item.version?.replace(/\s+/g, "-").toLowerCase(), [item.version]);

  return (
    <article id={anchor} className="card-surface rounded-2xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="gradient-text">{item.version}</span>
          </h2>
          <p className="mt-1 text-sm opacity-70">{new Date(item.date).toLocaleDateString()}</p>
        </div>
      </header>

      {item.highlights?.length ? (
        <ul className="mt-4 list-disc pl-5 text-sm sm:text-base  space-y-1.5">
          {item.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      ) : null}

      {item.changes?.length ? (
        <ul className="mt-4 space-y-2">
          {item.changes.map((c, i) => (
            <li key={i} className="flex gap-2">
              <Pill type={c.type} />
              <p className="text-xs lg:text-sm leading-6">{c.text}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function Updates({ items }) {
  const data = items && items.length ? items : UPDATES;

  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            <span className="gradient-text">Updates & Changelog</span>
          </h1>
          <p className="prose-custom mt-3">
            Patch notes for the **Wuthering Waves Calculator**. I maintain the data as the game updates.
          </p>
        </header>

        <div className="space-y-4">
          {data.map((item) => (
            <ChangelogItem key={item.version} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
