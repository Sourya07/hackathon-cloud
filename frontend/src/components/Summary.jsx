export default function Summary({ results }) {
  const count = { Appreciation: 0, Concerns: 0, Suggestions: 0 };

  results.forEach(r => count[r.label]++);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
      {Object.keys(count).map(key => (
        <div
          key={key}
          className="glass-card p-4 sm:p-6 text-center border-t-2 border-t-white/10 hover:border-t-cyber-orange transition-colors rounded-xl"
        >
          <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest mb-1 sm:mb-2">
            {key}
          </p>

          <p className="text-3xl sm:text-4xl font-black text-white">
            {count[key]}
          </p>
        </div>
      ))}
    </div>
  );
}