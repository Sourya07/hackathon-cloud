import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FeedbackForm from "./components/FeedbackForm";
import Summary from "./components/Summary";
import ResultCard from "./components/ResultCard";
import SentimentChart from "./components/SentimentChart";
import PaginatedResults from "./components/PaginatedResults";
import AnalyticsCharts from "./components/AnalyticsCharts";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a loading spinner
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

// Main Dashboard Component
function Dashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  // Filtering State
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const { token, logout, user } = useAuth();

  const branches = ["All", "CS", "AIML", "IT", "ECE", "Mech", "Civil"];
  const types = ["All", "Subject", "Staff", "Infrastructure", "General", "Other"];
  const categories = ["All", "Appreciation", "Concerns", "Suggestions"];

  const fetchAnalytics = async (branch, type) => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/analytics`;
      const params = new URLSearchParams();
      if (branch && branch !== 'All') params.append('branch', branch);
      if (type && type !== 'All') params.append('type', type);

      const res = await fetch(`${url}?${params.toString()}`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics");
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/feedback`;
      const params = new URLSearchParams();
      if (filterBranch && filterBranch !== 'All') params.append('branch', filterBranch);
      if (filterType && filterType !== 'All') params.append('type', filterType);

      const res = await fetch(`${url}?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch history");

      const data = await res.json();
      // Map DB response to UI format
      const mappedResults = data.results.map((item) => ({
        text: item.text,
        label: item.category,
      }));
      setResults(mappedResults);

      // Also update analytics for this filter
      fetchAnalytics(filterBranch, filterType);

    } catch (error) {
      console.error("History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics('All', 'All'); // Initial load
  }, []);

  const analyzeFeedback = async (feedbackText, branch, type) => {
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          feedback: feedbackText,
          branch,
          feedback_type: type
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout();
          return;
        }
        throw new Error("Failed to analyze feedback");
      }

      const data = await response.json();
      const mappedResults = data.results.map((item) => ({
        text: item.text,
        label: item.category,
      }));

      setResults(mappedResults);
      fetchAnalytics(filterBranch, filterType); // Refresh current view stats
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze feedback. Check backend or login status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white bg-grid relative overflow-hidden font-sans selection:bg-cyber-orange selection:text-white">

      {/* Decorative Background */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cyber-orange/20 rounded-full animate-float opacity-50 blur-sm pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-48 h-48 border border-white/10 rotate-45 animate-spin-slow pointer-events-none" />

      {/* Logout / User Info */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <span className="hidden md:inline text-gray-400 text-xs font-mono uppercase">
          User: <span className="text-white">{user?.email}</span>
        </span>
        <button
          onClick={logout}
          className="text-xs font-bold text-cyber-orange border border-cyber-orange px-3 py-1 hover:bg-cyber-orange hover:text-black transition-colors uppercase tracking-wider"
        >
          Terminate Session
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center">

        <header className="text-center mb-12 space-y-4">
          <p className="text-cyber-orange font-bold tracking-widest uppercase text-sm animate-pulse">
            Student Feedback Analysis
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            VIBE. <span className="text-stroke-white text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">CHECK.</span>
          </h1>

          {/* Global Analytics Badge */}
          {analytics && (
            <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-xl mt-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-mono uppercase">Submissions:</span>
                <span className="text-white font-black text-2xl">{analytics.Total || 0}</span>
              </div>

              <div className="hidden md:block w-px h-8 bg-white/20 mx-2"></div>

              <div className="flex gap-4 text-sm font-bold">
                <span className="text-green-400 flex flex-col items-center">
                  <span className="text-xs font-normal opacity-70">Appreciation</span>
                  {analytics.Appreciation || 0}
                </span>
                <span className="text-red-400 flex flex-col items-center">
                  <span className="text-xs font-normal opacity-70">Concerns</span>
                  {analytics.Concerns || 0}
                </span>
                <span className="text-cyber-orange flex flex-col items-center">
                  <span className="text-xs font-normal opacity-70">Suggestions</span>
                  {analytics.Suggestions || 0}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Filter Section */}
        <div className="w-full max-w-3xl mb-8 p-4 glass-card rounded-lg flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1 font-mono">Filter Branch</label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:outline-none focus:border-cyber-orange"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-1 font-mono">Filter Type</label>
            <select
              className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm focus:outline-none focus:border-cyber-orange"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="w-full md:w-auto bg-white/10 hover:bg-cyber-orange hover:text-black text-white px-6 py-2 rounded font-bold transition-all uppercase text-sm border border-white/20"
          >
            Load History
          </button>
        </div>

        <div className="w-full max-w-3xl mb-12">
          <FeedbackForm onAnalyze={analyzeFeedback} loading={loading} />
        </div>

        {loading && (
          <div className="flex flex-col items-center mt-8 space-y-4">
            <div className="w-12 h-12 border-4 border-cyber-orange border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cyber-orange font-mono animate-pulse">ANALYZING SENTIMENTS...</p>
          </div>
        )}

        {!loading && results.length > 0 && (() => {
          // Apply category filter
          const filteredResults = filterCategory === 'All'
            ? results
            : results.filter(r => r.label === filterCategory);

          return (
            <div className="w-full animate-fade-in-up space-y-8">

              {/* Summary Cards - Full Width */}
              <div className="w-full">
                <Summary results={results} />
              </div>

              {/* Category Filter */}
              <div className="glass-card p-4 rounded-lg">
                <label className="block text-gray-400 text-xs uppercase tracking-widest mb-3 font-mono">Filter by Sentiment</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-2 rounded font-bold uppercase text-sm tracking-wider transition-all ${filterCategory === cat
                          ? cat === 'Appreciation'
                            ? 'bg-green-500 text-black border-2 border-green-400'
                            : cat === 'Concerns'
                              ? 'bg-red-500 text-white border-2 border-red-400'
                              : cat === 'Suggestions'
                                ? 'bg-cyber-orange text-black border-2 border-orange-400'
                                : 'bg-white text-black border-2 border-white'
                          : 'bg-white/10 text-gray-300 border-2 border-white/20 hover:bg-white/20'
                        }`}
                    >
                      {cat}
                      {cat !== 'All' && (
                        <span className="ml-2 text-xs opacity-70">
                          ({results.filter(r => r.label === cat).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {filterCategory !== 'All' && (
                  <p className="text-xs text-gray-500 mt-3 font-mono">
                    Showing {filteredResults.length} of {results.length} results
                  </p>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailedCharts(!showDetailedCharts)}
                  className="text-sm font-bold text-cyber-orange border border-cyber-orange px-4 py-2 hover:bg-cyber-orange hover:text-black transition-colors uppercase tracking-wider rounded"
                >
                  {showDetailedCharts ? "← Simple View" : "Advanced Analytics →"}
                </button>
              </div>

              {showDetailedCharts ? (
                /* Detailed Analytics View */
                <AnalyticsCharts analytics={analytics} results={filteredResults} />
              ) : (
                /* Simple View */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Sentiment Chart - Left Column */}
                  <div className="md:col-span-1">
                    <SentimentChart results={filteredResults} />
                  </div>

                  {/* Results List - Right 2 Columns */}
                  <div className="md:col-span-2">
                    <PaginatedResults results={filteredResults} />
                  </div>
                </div>
              )}
            </div>
          );
        })()}

      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
