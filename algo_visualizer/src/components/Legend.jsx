const LEGEND_CONFIGS = {
  'bar-chart': [
    { color: 'bg-indigo-400', label: 'Comparing' },
    { color: 'bg-rose-500', label: 'Swapping / Action' },
    { color: 'bg-amber-400', label: 'Current Element' },
    { color: 'bg-emerald-500', label: 'Sorted' },
  ],
  'tree': [
    { color: 'bg-indigo-400', label: 'Visiting' },
    { color: 'bg-amber-400', label: 'Returning' },
    { color: 'bg-emerald-500', label: 'Completed' },
    { color: 'bg-slate-600', label: 'Unvisited' },
  ],
  'graph': [
    { color: 'bg-indigo-400', label: 'Active Node' },
    { color: 'bg-emerald-500', label: 'Visited' },
    { color: 'bg-slate-600', label: 'Unvisited' },
  ],
  'grid': [
    { color: 'bg-indigo-500', label: 'Current Cell' },
    { color: 'bg-emerald-500/25', label: 'Visited' },
    { color: 'bg-amber-400', label: 'Shortest Path' },
    { color: 'bg-slate-600', label: 'Wall' },
  ],
  'debugger': [
    { color: 'bg-amber-400', label: 'Variable Name' },
    { color: 'bg-emerald-400', label: 'Variable Value' },
    { color: 'bg-indigo-400', label: 'Current Line' },
    { color: 'bg-slate-500', label: 'Console Output' },
  ],
};

const DEFAULT_LEGEND = LEGEND_CONFIGS['bar-chart'];

export default function Legend({ renderer }) {
  const items = LEGEND_CONFIGS[renderer] || DEFAULT_LEGEND;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800"
        >
          <div className={`w-3 h-3 rounded-full ${item.color}`} />
          <span className="text-xs text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
