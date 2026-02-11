const badgeStyles = {
  Appreciation: "border-green-500 text-green-400 bg-green-500/10",
  Concerns: "border-red-500 text-red-400 bg-red-500/10",
  Suggestions: "border-cyber-orange text-cyber-orange bg-cyber-orange/10",
};

export default function ResultCard({ text, label }) {
  return (
    <div className="glass-card p-4 flex justify-between items-start gap-4 hover:bg-white/10 transition-colors">
      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
      <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider border ${badgeStyles[label] || "border-gray-500 text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}
