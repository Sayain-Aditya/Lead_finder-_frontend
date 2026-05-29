"use client";

const SkeletonLine = ({ width = "100%", height = 10, className = "" }) => (
  <div className={`skeleton-line ${className}`} style={{ width, height }} />
);

export function StatsSkeleton() {
  return (
    <div className="stats-grid" aria-label="Loading lead statistics">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="skeleton-stat" key={i}>
          <div className="skeleton-icon" />
          <SkeletonLine width="48%" height={24} />
          <SkeletonLine width="66%" height={10} />
        </div>
      ))}
    </div>
  );
}

export function LeadListSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-list" aria-label="Loading leads">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-card-top">
            <div className="skeleton-card-title">
              <SkeletonLine width={i % 2 ? "52%" : "64%"} height={15} />
              <div className="skeleton-pill-row">
                <SkeletonLine width={64} height={20} className="skeleton-pill" />
                <SkeletonLine width={86} height={20} className="skeleton-pill" />
              </div>
            </div>
            <SkeletonLine width={22} height={22} className="skeleton-square" />
          </div>
          <div className="skeleton-meta-row">
            <SkeletonLine width="18%" height={11} />
            <SkeletonLine width="16%" height={11} />
            <SkeletonLine width="22%" height={11} />
            <SkeletonLine width="10%" height={11} />
          </div>
          <div className="skeleton-action-row">
            <SkeletonLine width={124} height={28} className="skeleton-button" />
            <SkeletonLine width={90} height={28} className="skeleton-button" />
            <SkeletonLine width={96} height={28} className="skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KanbanSkeleton() {
  return (
    <div className="kanban-board" aria-label="Loading board">
      {Array.from({ length: 5 }).map((_, col) => (
        <div key={col} style={{ minWidth: 180 }}>
          <div className="skeleton-kanban-head">
            <SkeletonLine width="44%" height={12} />
            <SkeletonLine width={28} height={18} className="skeleton-pill" />
          </div>
          <div className="skeleton-kanban-stack">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="skeleton-kanban-card" key={i}>
                <SkeletonLine width={i % 2 ? "62%" : "78%"} height={13} />
                <SkeletonLine width="52%" height={10} />
                <SkeletonLine width="42%" height={10} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
