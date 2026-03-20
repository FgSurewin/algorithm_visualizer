import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Shuffle,
} from 'lucide-react';

export default function PlaybackControls({ playback }) {
  const {
    currentStepIdx,
    totalSteps,
    isPlaying,
    speed,
    togglePlay,
    goToStart,
    stepForward,
    stepBack,
    setSpeed,
    randomizeData,
  } = playback;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToStart}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300 active:scale-95"
          title="Restart"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={stepBack}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          disabled={currentStepIdx === 0}
          title="Step Back"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={togglePlay}
          className={`p-3.5 rounded-xl transition-all flex items-center gap-2 font-bold active:scale-95 ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          }`}
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
          <span className="min-w-[3.5rem] text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        <button
          onClick={stepForward}
          className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          disabled={currentStepIdx >= totalSteps - 1}
          title="Step Forward"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Speed & Randomize */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-widest">
            <span>Speed</span>
            <span>{1000 - speed}ms</span>
          </div>
          <input
            type="range"
            min="50"
            max="950"
            step="50"
            value={1000 - speed}
            onChange={(e) => setSpeed(1000 - parseInt(e.target.value))}
            className="accent-indigo-500 h-1.5 rounded-full cursor-pointer bg-slate-700"
          />
        </div>

        <button
          onClick={randomizeData}
          className="px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Shuffle size={14} />
          Randomize
        </button>
      </div>
    </section>
  );
}
