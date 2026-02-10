export default function Summary({ results }) {
  const count = { Appreciation: 0, Concerns: 0, Suggestions: 0 };

  results.forEach(r => count[r.label]++);

  return (
    <div className="flex gap-4 max-w-2xl mx-auto my-6">
      {Object.keys(count).map(key => (
        <div key={key} className="flex-1 bg-white p-4 rounded shadow text-center">
          <p className="font-semibold">{key}</p>
          <p className="text-2xl">{count[key]}</p>
        </div>
      ))}
    </div>
  );
}
