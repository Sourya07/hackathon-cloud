import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  Appreciation: "#22c55e", // Green
  Concerns: "#ef4444",     // Red
  Suggestions: "#FF6B00",  // Cyber Orange
};

export default function SentimentChart({ results }) {
  const data = ["Appreciation", "Concerns", "Suggestions"].map((label) => ({
    name: label,
    value: results.filter((r) => r.label === label).length,
  }));

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-400">
        Sentiment Distribution
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

