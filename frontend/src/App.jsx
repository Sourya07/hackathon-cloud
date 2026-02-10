import { useState, useEffect } from "react";
import FeedbackForm from "./components/FeedbackForm";
import Summary from "./components/Summary";
import ResultCard from "./components/ResultCard";
import SentimentChart from "./components/SentimentChart";

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const analyzeFeedback = (feedback) => {
    setLoading(true);

    setTimeout(() => {
      const mockResults = feedback.map((text) => ({
        text,
        label:
          text.toLowerCase().includes("good") ||
          text.toLowerCase().includes("great")
            ? "Appreciation"
            : text.toLowerCase().includes("should") ||
              text.toLowerCase().includes("please")
            ? "Suggestions"
            : "Concerns",
      }));

      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 transition-all">
      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <div>
          <h1 className="text-4xl font-extrabold dark:text-white">
            Vibe Check Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered student feedback analysis
          </p>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Input */}
      <FeedbackForm onAnalyze={analyzeFeedback} />

      {/* Loading */}
      {loading && (
        <p className="text-center mt-6 text-blue-500 font-semibold">
          Analyzing feedback...
        </p>
      )}

      {/* Empty */}
      {!loading && results.length === 0 && (
        <p className="text-center mt-6 text-gray-500 dark:text-gray-400">
          No feedback analyzed yet.
        </p>
      )}

      {/* Summary + Chart */}
      {results.length > 0 && (
        <>
          <Summary results={results} />
          <SentimentChart results={results} />
        </>
      )}

      {/* Results */}
      <div className="max-w-2xl mx-auto mt-6 grid gap-4">
        {results.map((r, i) => (
          <ResultCard key={i} text={r.text} label={r.label} />
        ))}
      </div>
    </div>
  );
}
