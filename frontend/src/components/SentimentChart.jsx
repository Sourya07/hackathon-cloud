import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = {
  Appreciation: "#22c55e",
  Concerns: "#ef4444",
  Suggestions: "#eab308",
};

export default function SentimentChart({ results }) {
  const data = ["Appreciation", "Concerns", "Suggestions"].map((label) => ({
    name: label,
    value: results.filter((r) => r.label === label).length,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow max-w-2xl mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4 text-center dark:text-white">
        Feedback Distribution
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

