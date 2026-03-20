import { Terminal } from 'lucide-react';
import BarChartRenderer from './renderers/BarChartRenderer';
import TreeRenderer from './renderers/TreeRenderer';
import DebuggerRenderer from './renderers/DebuggerRenderer';
import GraphRenderer from './renderers/GraphRenderer';
import GridRenderer from './renderers/GridRenderer';

export default function VisualizationArea({ algorithm, step, currentStepIdx, totalSteps }) {
  const renderVisualization = () => {
    switch (algorithm.renderer) {
      case 'bar-chart':
        return <BarChartRenderer step={step} />;
      case 'tree':
        return <TreeRenderer step={step} />;
      case 'graph':
        return <GraphRenderer step={step} />;
      case 'grid':
        return <GridRenderer step={step} />;
      case 'debugger':
        return <DebuggerRenderer step={step} />;
      default:
        return <DebuggerRenderer step={step} />;
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-2xl font-bold text-white">{algorithm.name}</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            {algorithm.renderer === 'debugger' ? 'Step-by-step execution trace' : 'Real-time memory visualization'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <span className="text-xs font-mono text-slate-400">Step</span>
          <span className="text-sm font-bold text-indigo-400">
            {currentStepIdx} / {Math.max(0, totalSteps - 1)}
          </span>
        </div>
      </div>

      {/* Renderer */}
      <div className="flex-1 flex min-h-0">
        {renderVisualization()}
      </div>

      {/* Message Bar */}
      <div className="mt-6 flex items-center gap-3 p-3.5 bg-slate-800/30 border border-slate-800 rounded-xl shrink-0">
        <Terminal size={16} className="text-slate-500 shrink-0" />
        <p className="text-sm italic text-slate-300">{step.message}</p>
      </div>
    </section>
  );
}
