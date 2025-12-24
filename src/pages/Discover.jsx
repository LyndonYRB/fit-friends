//Discover page
//src/pages/Discover.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Compass,
  MessageCircle,
  User,
  X,
  Heart,
  Star,
} from "lucide-react";


const cards = [
  {
    name: "Alex, 28",
    subtitle: "Intermediate Runner",
    distance: "5km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
    z: 30,
    rotate: 1,
    hover: true,
  },
  {
    name: "Sophia, 25",
    subtitle: "Advanced Yoga",
    distance: "10km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
    z: 20,
    rotate: -2,
  },
  {
    name: "Ethan, 31",
    subtitle: "Beginner Weightlifter",
    distance: "2km away",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
    z: 10,
    rotate: 3,
  },
];

function FilterPill({ label }) {
  return (
    <button className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-200/60 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      <span>{label}</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

export default function Discover() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-[Lexend] bg-[#101c22] text-slate-200">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
        {/* Header (sticky) */}
        <header className="sticky top-0 z-10 bg-[#101c22]/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-white">Find Partners</h1>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50"
              aria-label="Filters"
            >
              <SlidersHorizontal className="h-5 w-5 text-slate-200" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-4">
            <FilterPill label="Sport" />
            <FilterPill label="Skill Level" />
            <FilterPill label="Distance" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto px-6 pt-4 pb-24">
          <div className="space-y-6">
            {/* Card stack */}
            <div className="relative h-[60vh]">
              {cards.map((c) => (
                <div
                  onClick={() => navigate("/profile-view")}
                  key={c.name}
                  className={[
                    "absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-slate-800 shadow-lg",
                    c.hover
                      ? "z-30 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:rotate-1"
                      : "",
                    c.z === 20 ? "z-20 rotate-[-2deg]" : "",
                    c.z === 10 ? "z-10 rotate-[3deg]" : "",
                  ].join(" ")}
                  style={{ zIndex: c.z }}
                >
                  <div
                    className="h-3/5 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${c.img}")` }}
                  />
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {c.name}
                      </h2>
                      <p className="mt-1 text-slate-400">{c.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{c.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-red-400 shadow-md"
                aria-label="Pass"
              >
                <X className="h-9 w-9" />
              </button>

              <button
                className="flex h-20 w-20 items-center justify-center rounded-full bg-[#13a4ec] text-white shadow-lg"
                aria-label="Like"
              >
                <Heart className="h-10 w-10 fill-white" />
              </button>

              <button
                className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-yellow-400 shadow-md"
                aria-label="Super like"
              >
                <Star className="h-9 w-9" />
              </button>
            </div>
          </div>
        </main>

        {/* Bottom nav (sticky) */}
        <nav className="sticky bottom-0 border-t border-slate-700/80 bg-[#101c22]/80 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-2 px-4 py-2">
            <Link
              to="/discover"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-[#13a4ec]"
            >
              <Compass className="h-6 w-6" />
              <span className="text-xs font-medium">Discover</span>
            </Link>

            <Link
              to="/messages"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-slate-400"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium">Messages</span>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center gap-1 rounded-lg py-2 text-slate-400"
            >
              <User className="h-6 w-6" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
