import { useState, useRef, useEffect } from 'react';
import { getAlgorithmById } from './algorithms/registry';
import { traceCode } from './utils/tracer';
import usePlayback from './hooks/usePlayback';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VisualizationArea from './components/VisualizationArea';
import PlaybackControls from './components/PlaybackControls';
import Legend from './components/Legend';

export default function App() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubble');
  const [customAlgo, setCustomAlgo] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const isDragging = useRef(false);

  const algorithm = customAlgo || getAlgorithmById(selectedAlgoId);
  const playback = usePlayback(algorithm);

  const handleSelectAlgo = (id) => {
    setSelectedAlgoId(id);
    setCustomAlgo(null); // exit custom mode
  };

  const handleVisualize = (code) => {
    const steps = traceCode(code);
    setCustomAlgo({
      id: 'custom',
      name: 'Custom Code',
      category: 'custom',
      renderer: 'debugger',
      code: code,
      description: 'User-defined JavaScript code',
      defaultData: [0],
      generateSteps: () => steps,
    });
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      // Constrain sidebar width between 250px and 800px max
      const newWidth = Math.min(Math.max(e.clientX, 250), 800);
      setSidebarWidth(newWidth);
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
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Navbar />

      <main className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div style={{ width: sidebarWidth }} className="shrink-0 flex flex-col min-h-0">
          <Sidebar
            selectedId={selectedAlgoId}
            onSelect={handleSelectAlgo}
            algorithm={algorithm}
            onVisualize={handleVisualize}
            currentStep={playback.currentStep}
          />
        </div>

        {/* Resizer Handle */}
        <div
          className="w-1 cursor-col-resize bg-slate-800 hover:bg-indigo-500/50 active:bg-indigo-500 z-10 shrink-0 transition-colors"
          onMouseDown={handleMouseDown}
        />

        {/* Right Content */}
        <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto">
          <VisualizationArea
            algorithm={algorithm}
            step={playback.currentStep}
            currentStepIdx={playback.currentStepIdx}
            totalSteps={playback.totalSteps}
          />
          <PlaybackControls playback={playback} />
          <Legend renderer={algorithm.renderer} />
        </div>
      </main>
    </div>
  );
}