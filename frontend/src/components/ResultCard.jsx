const badgeColors = {
  Appreciation: "bg-green-100 text-green-700",
  Concerns: "bg-red-100 text-red-700",
  Suggestions: "bg-yellow-100 text-yellow-700",
};

export default function ResultCard({ text, label }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="mb-2">{text}</p>
      <span className={`px-3 py-1 rounded-full text-sm ${badgeColors[label]}`}>
        {label}
      </span>
    </div>
  );
}
