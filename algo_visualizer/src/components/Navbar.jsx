import { BarChart3 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 text-white shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <BarChart3 size={20} />
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          Algorithm <span className="text-indigo-400">Visualizer</span>
        </h1>
      </div>
      <a
        href="https://github.com/FgSurewin/algorithm_visualizer"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-slate-800 rounded-full text-sm font-medium text-white border border-slate-700 hover:bg-slate-700 transition-all"
      >
        GitHub
      </a>
    </nav>
  );
}
