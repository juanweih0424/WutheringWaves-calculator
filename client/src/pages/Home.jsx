import React from 'react'

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4">

  {/* 1 col on mobile, 2 cols ≥ lg */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

    {/* LEFT pane */}
    <section className="min-h-[60vh] lg:min-h-[calc(100vh-var(--nav-h,3.5rem))] 
                        overflow-y-auto pr-1">
      ASDAD
    </section>

    {/* RIGHT pane (sticky) */}
    <aside className="lg:sticky lg:top-[var(--nav-h,3.5rem)]
                      h-fit max-h-[calc(100vh-var(--nav-h,3.5rem))] overflow-y-auto
                      border-t lg:border-t-0 lg:border-l
                      border-[var(--color-border)] pl-4">
      ASDASDD
      'DSAD
    </aside>

  </div>
</div>
  )
}
