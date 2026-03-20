import { useMemo } from 'react';

const NODE_RADIUS = 22;
const PADDING = 40;

export default function GraphRenderer({ step }) {
  const { nodes = [], edges = [], activeNodes = [], visitedNodes = [], activeEdges = [], visitedEdges = [], queue = [] } = step;

  const dims = useMemo(() => {
    if (nodes.length === 0) return { w: 600, h: 400 };
    return { w: 600, h: 400 };
  }, [nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500 italic text-sm">Building graph...</p>
      </div>
    );
  }

  const { w, h } = dims;

  function getNodeFill(id) {
    if (activeNodes.includes(id)) return '#818cf8';
    if (visitedNodes.includes(id)) return '#10b981';
    return '#334155';
  }
  function getNodeGlow(id) {
    if (activeNodes.includes(id)) return 'drop-shadow(0 0 10px rgba(129,140,248,0.5))';
    if (visitedNodes.includes(id)) return 'drop-shadow(0 0 6px rgba(16,185,129,0.3))';
    return 'none';
  }
  function getEdgeColor(from, to) {
    if (activeEdges?.some(e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from))) return '#818cf8';
    if (visitedEdges?.some(e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from))) return '#10b981';
    return '#475569';
  }
  function getEdgeWidth(from, to) {
    if (activeEdges?.some(e => (e[0] === from && e[1] === to) || (e[0] === to && e[1] === from))) return 3;
    return 2;
  }

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-3">
      <div className="flex-1 flex items-center justify-center min-h-0">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '100%' }}>
          {/* Edges */}
          {edges.map(([from, to], i) => {
            const n1 = nodeMap[from], n2 = nodeMap[to];
            if (!n1 || !n2) return null;
            return (
              <line key={`e-${i}`}
                x1={PADDING + n1.x * (w - 2 * PADDING)} y1={PADDING + n1.y * (h - 2 * PADDING)}
                x2={PADDING + n2.x * (w - 2 * PADDING)} y2={PADDING + n2.y * (h - 2 * PADDING)}
                stroke={getEdgeColor(from, to)} strokeWidth={getEdgeWidth(from, to)} strokeLinecap="round"
                style={{ transition: 'stroke 0.3s ease' }}
              />
            );
          })}
          {/* Nodes */}
          {nodes.map(node => {
            const cx = PADDING + node.x * (w - 2 * PADDING);
            const cy = PADDING + node.y * (h - 2 * PADDING);
            return (
              <g key={node.id}>
                <circle cx={cx} cy={cy} r={NODE_RADIUS} fill={getNodeFill(node.id)}
                  style={{ filter: getNodeGlow(node.id), transition: 'fill 0.3s ease, filter 0.3s ease' }} />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize="14" fontWeight="bold" fontFamily="ui-monospace, monospace">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* Queue / Stack Display */}
      {queue && queue.length > 0 && (
        <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold shrink-0">
            {step.queueLabel || 'Queue'}:
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {queue.map((id, i) => (
              <span key={i} className="px-2 py-0.5 bg-indigo-600/20 text-indigo-300 rounded text-xs font-mono font-bold border border-indigo-500/20">
                {id}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
