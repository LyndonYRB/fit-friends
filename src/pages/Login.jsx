//Login page
// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useAppState } from "../state/AppState";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email.");
    if (!password.trim()) return setError("Please enter your password.");

    try {
      setLoading(true);
      await login({ email, password });
      navigate("/discover");
    } catch (err) {
      setError(err.message || "Could not log in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>

          <h1 className="text-lg font-bold text-white">Log In</h1>
          <div className="w-10" />
        </header>

        {error ? (
          <div className="mt-3 px-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="flex-1 px-6 py-8">
          <h2 className="text-2xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Log in to find training partners near you.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., alex@example.com"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-semibold text-[#13a4ec] hover:opacity-90"
                onClick={() => alert("Forgot password flow later")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-14 w-full rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Sign up link */}
            <p className="pt-2 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/onboarding"
                className="font-semibold text-[#13a4ec] hover:opacity-90"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
