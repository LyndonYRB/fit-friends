//Welcome page 
// src/pages/Welcome.jsx
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-gray-200">
      {/* Phone frame */}
      <div className="mx-auto min-h-screen w-full max-w-[390px] px-6">
        {/* Layout: content + footer */}
        <div className="flex min-h-screen flex-col">
          {/* Content (push slightly down) */}
          <div className="flex flex-1 flex-col justify-center text-center pt-10">
            <h1 className="mx-auto max-w-[340px] text-center text-[40px] font-bold leading-[1.25] tracking-[-0.02em] text-white">
                Find your perfect training partner
            </h1>
            <p className="mt-6 text-[18px] leading-7 text-gray-400">
              Connect with like-minded athletes and
              <br />
              elevate your fitness journey together.
            </p>

            {/* Buttons (full width) */}
            <div className="mt-10 flex flex-col gap-5">
              <Link
                to="/onboarding"
                className="flex h-14 w-full items-center justify-center rounded-full bg-[#13a4ec] text-lg font-bold text-white shadow-lg shadow-black/20"
              >
                Sign Up
              </Link>

              <Link
                to="/login"
                className="flex h-14 w-full items-center justify-center rounded-full bg-[#1b2a33] text-lg font-bold text-white/90 ring-1 ring-white/10 shadow-lg shadow-black/10"
              >
                Log In
              </Link>
            </div>
          </div>

          {/* Footer stays near bottom like screenshot */}
          <div className="pb-10 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and
              <br />
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}