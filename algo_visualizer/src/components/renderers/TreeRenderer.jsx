import { useMemo } from 'react';

// --- Tree Layout Algorithm ---
// Uses in-order traversal to assign x positions (leaves get sequential x values).
// Internal nodes are centered above their children.
// Phantom nodes (_phantom: true) reserve space for layout but are not rendered.

const NODE_RADIUS = 24;
const LEVEL_HEIGHT = 80;
const NODE_H_SPACING = 58;
const PADDING = 50;

function computeLayout(root) {
  if (!root) return { nodes: [], edges: [], maxX: 0, maxDepth: 0 };

  const positions = new Map();
  let leafCounter = 0;

  function assignPositions(node, depth) {
    if (!node.children || node.children.length === 0) {
      positions.set(node.id, { x: leafCounter, depth });
      leafCounter++;
      return;
    }

    // Position first child (left subtree)
    assignPositions(node.children[0], depth + 1);

    // Position remaining children
    for (let i = 1; i < node.children.length; i++) {
      assignPositions(node.children[i], depth + 1);
    }

    // Center parent above its children
    const childXValues = node.children.map((c) => positions.get(c.id).x);
    const avgX = childXValues.reduce((a, b) => a + b, 0) / childXValues.length;
    positions.set(node.id, { x: avgX, depth });
  }

  assignPositions(root, 0);

  // Flatten tree into arrays of nodes and edges
  const nodes = [];
  const edges = [];

  function flatten(node) {
    const pos = positions.get(node.id);
    if (!node._phantom) {
      nodes.push({
        id: node.id,
        label: node.label,
        value: node.value,
        x: pos.x,
        depth: pos.depth,
      });
    }

    for (const child of node.children) {
      // Only create edges between non-phantom nodes
      if (!node._phantom && !child._phantom) {
        const childPos = positions.get(child.id);
        edges.push({
          x1: pos.x,
          y1: pos.depth,
          x2: childPos.x,
          y2: childPos.depth,
        });
      }
      flatten(child);
    }
  }

  flatten(root);

  const maxX = nodes.length > 0 ? Math.max(...nodes.map((n) => n.x)) : 0;
  const maxDepth = nodes.length > 0 ? Math.max(...nodes.map((n) => n.depth)) : 0;

  return { nodes, edges, maxX, maxDepth };
}

export default function TreeRenderer({ step }) {
  const { tree, activeNodes = [], completedNodes = [], returningNodes = [] } = step;

  const layout = useMemo(() => {
    if (!tree) return null;
    return computeLayout(tree);
  }, [tree]);

  if (!layout || layout.nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
              <circle cx="12" cy="6" r="3" />
              <line x1="12" y1="9" x2="6" y2="16" />
              <line x1="12" y1="9" x2="18" y2="16" />
              <circle cx="6" cy="18" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
          </div>
          <p className="text-slate-500 italic text-sm">Building tree...</p>
        </div>
      </div>
    );
  }

  const { nodes, edges, maxX, maxDepth } = layout;

  const svgWidth = Math.max(maxX * NODE_H_SPACING + PADDING * 2, 300);
  const svgHeight = maxDepth * LEVEL_HEIGHT + PADDING * 2 + NODE_RADIUS * 2;

  function sx(x) {
    return PADDING + x * NODE_H_SPACING;
  }
  function sy(depth) {
    return PADDING + depth * LEVEL_HEIGHT + NODE_RADIUS;
  }

  function getNodeFill(nodeId) {
    if (returningNodes.includes(nodeId)) return '#fbbf24'; // amber-400
    if (activeNodes.includes(nodeId)) return '#818cf8';    // indigo-400
    if (completedNodes.includes(nodeId)) return '#10b981'; // emerald-500
    return '#334155'; // slate-700
  }

  function getGlowFilter(nodeId) {
    if (returningNodes.includes(nodeId)) return 'drop-shadow(0 0 10px rgba(251,191,36,0.5))';
    if (activeNodes.includes(nodeId)) return 'drop-shadow(0 0 10px rgba(129,140,248,0.5))';
    if (completedNodes.includes(nodeId)) return 'drop-shadow(0 0 8px rgba(16,185,129,0.3))';
    return 'none';
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxHeight: '100%' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => (
          <line
            key={`e-${i}`}
            x1={sx(edge.x1)}
            y1={sy(edge.y1)}
            x2={sx(edge.x2)}
            y2={sy(edge.y2)}
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => {
          const cx = sx(node.x);
          const cy = sy(node.depth);
          const fill = getNodeFill(node.id);

          return (
            <g key={`n-${node.id}`}>
              <circle
                cx={cx}
                cy={cy}
                r={NODE_RADIUS}
                fill={fill}
                style={{
                  filter: getGlowFilter(node.id),
                  transition: 'fill 0.3s ease, filter 0.3s ease',
                }}
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="11"
                fontWeight="bold"
                fontFamily="ui-monospace, monospace"
              >
                {node.label}
              </text>
              {node.value !== null && node.value !== undefined && (
                <text
                  x={cx}
                  y={cy + NODE_RADIUS + 14}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                >
                  = {node.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
