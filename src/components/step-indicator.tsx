interface Props {
  steps: string[];
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="w-full flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < current
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : i === current
                  ? 'bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-300 scale-110'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs whitespace-nowrap hidden sm:block ${
                i === current ? 'text-rose-600 font-semibold' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all ${i < current ? 'bg-rose-400' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
