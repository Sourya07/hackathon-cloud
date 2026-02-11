import { useState } from "react";

export default function FeedbackForm({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const [branch, setBranch] = useState("CS");
  const [type, setType] = useState("General");

  const branches = ["CS", "AIML", "IT", "ECE", "Mech", "Civil"];
  const types = ["Subject", "Staff", "Infrastructure", "General", "Other"];

  const handleAnalyze = () => {
    const feedback = text
      .split("\n")
      .filter(line => line.trim() !== "");

    // Pass metadata along with feedback
    onAnalyze(feedback, branch, type);
  };

  return (
    <div className="glass-card p-8 border-t-4 border-t-cyber-orange relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="text-cyber-orange text-3xl">⟩</span>
        INPUT_FEEDBACK
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">Branch</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-cyber-orange"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">Type</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-cyber-orange"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <textarea
        className="w-full h-40 p-4 bg-black/40 border border-white/10 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all font-mono text-sm resize-none"
        placeholder="// Paste student feedback here...&#10;// One entry per line"
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={loading}
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="bg-cyber-orange text-black px-8 py-3 font-bold rounded hover:bg-white hover:text-black transition-colors transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2"
        >
          {loading ? 'Processing...' : 'Run Analysis'}
          {!loading && <span className="text-lg">→</span>}
        </button>
      </div>
    </div>
  );
}
