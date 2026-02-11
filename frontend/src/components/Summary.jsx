export default function Summary({ results }) {
  const count = { Appreciation: 0, Concerns: 0, Suggestions: 0 };

  results.forEach(r => count[r.label]++);

  return (
    <div className="flex gap-4 w-full">
      {Object.keys(count).map(key => (
        <div key={key} className="glass-card flex-1 p-6 text-center border-t-2 border-t-white/10 hover:border-t-cyber-orange transition-colors">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">{key}</p>
          <p className="text-4xl font-black text-white">{count[key]}</p>
        </div>
      ))}
    </div>
  );
}
