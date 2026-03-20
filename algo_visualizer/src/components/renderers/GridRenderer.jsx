export default function GridRenderer({ step }) {
  const { grid = [], visited = [], path = [], current, start, end, frontierCells = [] } = step;

  if (grid.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500 italic text-sm">Building grid...</p>
      </div>
    );
  }

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  function getCellColor(r, c) {
    if (current && current[0] === r && current[1] === c) return 'bg-indigo-500 shadow-lg shadow-indigo-500/30';
    if (start && start[0] === r && start[1] === c) return 'bg-emerald-500';
    if (end && end[0] === r && end[1] === c) return 'bg-rose-500';
    if (path?.some(p => p[0] === r && p[1] === c)) return 'bg-amber-400';
    if (frontierCells?.some(p => p[0] === r && p[1] === c)) return 'bg-indigo-400/40';
    if (grid[r][c] === 1) return 'bg-slate-600';
    if (visited?.[r]?.[c]) return 'bg-emerald-500/25';
    return 'bg-slate-800/60';
  }

  function getCellLabel(r, c) {
    if (start && start[0] === r && start[1] === c) return 'S';
    if (end && end[0] === r && end[1] === c) return 'E';
    return '';
  }

  const cellSize = Math.min(Math.floor(500 / Math.max(rows, cols)), 56);

  return (
    <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
      <div className="inline-grid gap-[2px] p-2 bg-slate-900/50 rounded-xl border border-slate-800"
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}>
        {grid.map((row, r) =>
          row.map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-[3px] flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${getCellColor(r, c)}`}
              style={{ width: cellSize, height: cellSize }}
              title={`(${r}, ${c})`}
            >
              <span className="text-white/80">{getCellLabel(r, c)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
