export default function BarChartRenderer({ step }) {
  const { array = [], comparing = [], swapping = [], highlights = [], sorted = [] } = step;

  return (
    <div className="flex-1 flex items-end justify-center gap-2 px-4 pb-4">
      {array.map((val, idx) => {
        const isComparing = comparing?.includes(idx);
        const isSwapping = swapping?.includes(idx);
        const isHighlight = highlights?.includes(idx);
        const isSorted = sorted?.includes(idx);

        let bgColor = 'bg-slate-700';
        if (isSorted) bgColor = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
        if (isHighlight) bgColor = 'bg-amber-400';
        if (isComparing) bgColor = 'bg-indigo-400';
        if (isSwapping) bgColor = 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]';

        return (
          <div
            key={idx}
            className="flex flex-col items-center flex-1 max-w-[50px] transition-all duration-300"
          >
            <div
              className={`w-full rounded-t-lg transition-all duration-300 ${bgColor}`}
              style={{ height: `${val * 3}px` }}
            />
            <span
              className={`text-xs mt-3 font-mono font-bold ${
                isComparing || isSwapping ? 'text-white' : 'text-slate-500'
              }`}
            >
              {val}
            </span>
          </div>
        );
      })}
    </div>
  );
}
