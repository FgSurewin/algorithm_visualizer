import { useState, useRef, useEffect } from 'react';
import {
  BarChart3,
  GitBranch,
  Network,
  Share2,
  Grid3X3,
  ChevronDown,
  ChevronRight,
  Library,
} from 'lucide-react';
import { CATEGORIES, getAlgorithmsByCategory } from '../algorithms/registry';
import CodePanel from './CodePanel';

const CATEGORY_ICONS = {
  BarChart3: BarChart3,
  GitBranch: GitBranch,
  Network: Network,
  Share2: Share2,
  Grid3X3: Grid3X3,
};

export default function Sidebar({ selectedId, onSelect, algorithm, onVisualize, currentStep }) {
  const [expandedCategories, setExpandedCategories] = useState(['sorting']);

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const [libraryHeight, setLibraryHeight] = useState('50%');
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'row-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      // Calculate new height, constrain it between 100px and browser height - 100px
      const newHeight = Math.min(Math.max(e.clientY - 64, 100), window.innerHeight - 200); // 64 is approx navbar height
      setLibraryHeight(newHeight);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'default';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <aside className="w-full shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden">
      {/* Algorithm Library */}
      <div style={{ height: libraryHeight }} className="flex flex-col min-h-0 shrink-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Library size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            Algorithm Library
          </h2>
        </div>

        {CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || BarChart3;
          const algos = getAlgorithmsByCategory(cat.id);
          const isExpanded = expandedCategories.includes(cat.id);
          const hasAlgos = algos.length > 0;

          return (
            <div key={cat.id}>
              <button
                onClick={() => hasAlgos && toggleCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  hasAlgos
                    ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white cursor-pointer'
                    : 'text-slate-600 cursor-default'
                }`}
              >
                <IconComponent size={16} className={hasAlgos ? 'text-slate-400' : 'text-slate-700'} />
                <span className="flex-1 text-left">{cat.name}</span>
                {hasAlgos ? (
                  isExpanded ? (
                    <ChevronDown size={14} className="text-slate-500" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-500" />
                  )
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-slate-700 bg-slate-800/50 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                )}
              </button>

              {isExpanded && hasAlgos && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {algos.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => onSelect(algo.id)}
                      className={`w-full flex flex-col items-start px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedId === algo.id
                          ? 'bg-indigo-600/15 border border-indigo-500/40 text-white'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <span className="font-semibold">{algo.name}</span>
                      <span className="text-[11px] opacity-60 mt-0.5 text-left line-clamp-1">
                        {algo.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        className="h-1 cursor-row-resize bg-slate-800 hover:bg-indigo-500/50 active:bg-indigo-500 z-10 shrink-0 transition-colors"
        onMouseDown={handleMouseDown}
      />

      {/* Code Panel */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950">
        <CodePanel algorithm={algorithm} onVisualize={onVisualize} currentStep={currentStep} />
      </div>
    </aside>
  );
}
