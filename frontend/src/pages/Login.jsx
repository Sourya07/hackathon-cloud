import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.error || "Failed to log in");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyber-black bg-grid text-white">
            <div className="glass-card w-full max-w-md p-8 border-t-4 border-t-cyber-orange relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
                    <div className="w-20 h-20 border border-cyber-orange/20 rounded-full animate-spin-slow" />
                </div>

                <h2 className="text-3xl font-black mb-6 tracking-tighter">
                    ACCESS <span className="text-cyber-orange">CONTROL</span>
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 text-sm font-mono">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
                            placeholder="user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyber-orange text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-wider"
                    >
                        Authenticate
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    New User?{" "}
                    <Link to="/signup" className="text-cyber-orange hover:text-white transition-colors underline">
                        Initialize Access
                    </Link>
                </p>
            </div>
        </div>
    );
}
