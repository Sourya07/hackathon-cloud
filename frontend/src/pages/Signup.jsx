import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await signup(email, password, "student"); // Default role
            navigate("/login");
        } catch (err) {
            setError(err.error || "Failed to create account");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyber-black bg-grid text-white">
            <div className="glass-card w-full max-w-md p-8 border-t-4 border-t-white/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 p-4 opacity-30 pointer-events-none">
                    <div className="w-32 h-32 border border-cyber-orange/20 rounded-full animate-float" />
                </div>

                <h2 className="text-3xl font-black mb-6 tracking-tighter">
                    INIT <span className="text-white">ACCESS</span>
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 mb-4 text-sm font-mono">
                        ⚠ {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
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

                    <div>
                        <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2 font-mono">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            className="w-full bg-black/40 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-cyber-orange focus:ring-1 focus:ring-cyber-orange transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 hover:bg-cyber-orange hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have access?{" "}
                    <Link to="/login" className="text-cyber-orange hover:text-white transition-colors underline">
                        Authenticate
                    </Link>
                </p>
            </div>
        </div>
    );
}
