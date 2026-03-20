import { useRef, useEffect } from 'react';

function formatValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
  if (typeof value === 'object') {
    try { return JSON.stringify(value); } catch { return String(value); }
  }
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

function MiniArrayViz({ arr }) {
  if (!Array.isArray(arr) || arr.length === 0 || arr.length > 20) return null;
  const max = Math.max(...arr.map(v => (typeof v === 'number' ? Math.abs(v) : 0)), 1);

  return (
    <div className="flex items-end gap-[2px] h-8 mt-1">
      {arr.map((v, i) => {
        const h = typeof v === 'number' ? Math.max((Math.abs(v) / max) * 100, 8) : 30;
        return (
          <div
            key={i}
            className="bg-indigo-500/60 rounded-[2px] min-w-[4px] transition-all duration-200"
            style={{ height: `${h}%`, flex: 1 }}
            title={`[${i}] = ${v}`}
          />
        );
      })}
    </div>
  );
}

export default function DebuggerRenderer({ step }) {
  const { variables = {}, output = [], line } = step;
  const varEntries = Object.entries(variables).filter(([, v]) => v !== undefined);
  const prevVarsRef = useRef({});

  useEffect(() => {
    prevVarsRef.current = variables;
  }, [variables]);

  const prevVars = prevVarsRef.current;

  function didChange(name, value) {
    if (!(name in prevVars)) return true;
    return JSON.stringify(prevVars[name]) !== JSON.stringify(value);
  }

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-auto p-1">
      {/* Variables Panel */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden flex-1">
        <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Variables
          </span>
          {line >= 0 && (
            <span className="text-xs text-slate-500 ml-auto font-mono">Line {line + 1}</span>
          )}
        </div>
        <div className="p-3 overflow-auto" style={{ maxHeight: '320px' }}>
          {varEntries.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-slate-500 italic">No variables in scope yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {varEntries.map(([name, value]) => {
                const changed = didChange(name, value);
                const isArray = Array.isArray(value);
                return (
                  <div
                    key={name}
                    className={`rounded-lg px-3 py-2 transition-all duration-300 ${
                      changed ? 'bg-indigo-500/10 border border-indigo-500/20' : 'border border-transparent hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-amber-400 font-mono text-[13px] font-semibold shrink-0">{name}</span>
                        <span className="text-slate-600 text-[10px] uppercase tracking-wider">
                          {isArray ? 'array' : typeof value}
                        </span>
                      </div>
                      <span className={`font-mono text-[13px] break-all text-right ${
                        changed ? 'text-emerald-300' : 'text-emerald-400/70'
                      }`}>
                        {formatValue(value)}
                      </span>
                    </div>
                    {isArray && <MiniArrayViz arr={value} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Console Output Panel */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shrink-0">
        <div className="px-4 py-2.5 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Console Output
          </span>
          {output.length > 0 && (
            <span className="text-[10px] text-slate-600 ml-auto">{output.length} entries</span>
          )}
        </div>
        <div className="p-3 font-mono text-[13px] overflow-auto" style={{ maxHeight: '180px' }}>
          {output.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-slate-600 italic text-xs">No output yet</p>
            </div>
          ) : (
            output.map((line, i) => (
              <div
                key={i}
                className="flex gap-2 py-0.5 hover:bg-slate-800/30 rounded px-1 -mx-1"
              >
                <span className="text-slate-600 select-none shrink-0">›</span>
                <span className={`${line.startsWith('❌') ? 'text-rose-400' : 'text-slate-300'}`}>
                  {line}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
