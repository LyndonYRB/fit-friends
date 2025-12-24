//Onboarding page for new users
// src/pages/Onboarding.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Mail, SquareAsterisk, Phone } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const onContinue = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email.");
    if (!phone.trim()) return setError("Please enter your phone number.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Please enter a valid phone number.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    // UI-only: go to profile setup
    navigate("/profile-setup");
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

          <h1 className="text-lg font-bold text-white">Get Started</h1>
          <div className="w-10" />
        </header>

        {error ? (
          <div className="mt-3 px-6">
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : null}

        <main className="flex-1 px-6 py-8">
          <h2 className="text-2xl font-extrabold text-white">Create your account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your login details to continue.
          </p>

          <form onSubmit={onContinue} className="mt-8 space-y-5">
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

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., (555) 123-4567"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <div className="relative">
                <SquareAsterisk className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Confirm Password</label>
              <div className="relative">
                <SquareAsterisk className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 w-full rounded-full border border-white/10 bg-[#101c22] pl-12 pr-4 text-base font-semibold text-white placeholder:text-gray-600 outline-none focus:border-[#13a4ec] focus:ring-2 focus:ring-[#13a4ec]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 h-14 w-full rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20 transition hover:bg-[#13a4ec]/90 focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/40"
            >
              Continue
            </button>

            <p className="pt-2 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#13a4ec] hover:opacity-90">
                Log In
              </Link>
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
