// src/data/mockUsers.jsx

const cards = [
  {
    name: "Alex, 28",
    subtitle: "Intermediate Runner",
    distance: "5km away",
    activity: "Running",
    skill: "Intermediate",
    miles: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtx4AMnjcmOi9TONvRGFepx3zp1rKq8XCKv-P7dRe56gdgUo4BHuIVg2JNsaEZ9TFM-MvC2zEuA3dlPk8nqnTu4YFkO22yypzSGB2yJv4A85QPsPFG-em1lja28_ZQwdyq-MPCHyqpYaTQP-2CtAKkQuP8oPRklbqiXzg_Qb3yIMOq6B1lLhPVHfv4h2VzjnY4t-I4bn1buZp5PN_MNRi9YqsJKlMK88Iqm8czNZ1C_ljlAJqLWdbj_CPYV62lx2pKb2pLEHasly6m",
  },
  {
    name: "Sophia, 25",
    subtitle: "Advanced Dancer",
    distance: "10km away",
    activity: "Dance",
    skill: "Advanced",
    miles: 9,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJY91asyYLfhpDr89J9P6ljRB0YcE4tCuPcWKfM6HEHfli9RvDI2rQcjWSIAcve5-HSbCLDRLyrvYkK3CpHjT5Fga2cq0VnV3G1HHTYkrvl-icx4FRI1uqZpGNQt-ApWcu_-TP6Q_AakgIPI6a3K6uHl_PO44BBWPAxVySzTI2luHuouWViAqDzAehUQijojKvK7b5OgABOu3rbi1J2WRKKGS--PyrI8ho3RBaxRQTqxBSnnG-CeTCU5sX6A4_Twn2nHApD0DJEn6u",
  },
  {
    name: "Ethan, 31",
    subtitle: "Beginner Weightlifter",
    distance: "2km away",
    activity: "Gym",
    skill: "Beginner",
    miles: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4TjRKEhM45QPM48QMXjVwYvZslZ3HZUzRj4oRA0YEPDus4p2JKc1r2FBPTYRla_DXKk-YnFLDE0W1ZUPtZoPDVB7Z5MY1OgZQH1SAsv4gZTZdIRAU0dBX0vK1hVRY-a4cVX1WNT_pQdUsHSfJgwMMH_iWQBPbJdM_KSFkn9SgNRtTBPZxVO86Ndb-VJSINTMNASZX0uQaiVWrgdv6gMQzmEE6ar0HsISmwYKK2m2Wsu3FvXfN4VDfvVTqKzOiC_dLhXOq5N7LTFe",
  },
  {
    name: "Maya, 27",
    subtitle: "Beginner Pilates",
    distance: "3km away",
    activity: "Pilates",
    skill: "Beginner",
    miles: 4,
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jordan, 29",
    subtitle: "Intermediate Gym",
    distance: "7km away",
    activity: "Gym",
    skill: "Intermediate",
    miles: 7,
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kai, 24",
    subtitle: "Advanced Boxing",
    distance: "12km away",
    activity: "Boxing",
    skill: "Advanced",
    miles: 12,
    img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Nina, 32",
    subtitle: "Intermediate Swimming",
    distance: "1km away",
    activity: "Swimming",
    skill: "Intermediate",
    miles: 1,
    img: "https://images.unsplash.com/photo-1524503033411-f7a2fe8c7b1b?auto=format&fit=crop&w=900&q=80",
  },
];

/**
 * Converts a card into a full "user" object used across the app.
 * Keep IDs stable (important for routes, chat threads, blocking).
 */
export const cardToUser = (c) => {
  const [rawName, rawAge] = String(c.name).split(",").map((s) => s.trim());
  const age = Number(rawAge) || undefined;

  return {
    id: `u_${rawName.toLowerCase().replace(/\s+/g, "_")}_${age || "x"}`,
    name: rawName,
    age,
    subtitle: c.subtitle,
    distance: c.distance,
    location: "New York, NY",
    bio: "Training partner focused on consistency. Down for sessions that match schedule + goals.",
    photos: [c.img],
    interests: [c.activity],
    skill: c.skill,
    availability: "Morning",
    // Keep these for filtering / future features (not required by ProfileView)
    miles: c.miles,
    activity: c.activity,
  };
};

export const MOCK_USERS = cards.map(cardToUser);

/** Lookup helper for refresh-safe ProfileView */
export const getMockUserById = (id) =>
  MOCK_USERS.find((u) => u.id === id) || null;
