import { useState } from "react";

export default function FeedbackForm({ onAnalyze }) {
  const [text, setText] = useState("");

  const handleAnalyze = () => {
    const feedback = text
      .split("\n")
      .filter(line => line.trim() !== "");
    onAnalyze(feedback);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">
        Enter Student Feedback
      </h2>

      <textarea
        className="w-full h-36 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write each feedback on a new line..."
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Analyze Feedback
      </button>
    </div>
  );
}
