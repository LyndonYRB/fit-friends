//App
// src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import PreferenceSetup from "./pages/PreferenceSetup.jsx";
import Discover from "./pages/Discover.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import ProfileView from "./pages/ProfileView.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Messages from "./pages/MessagesList.jsx";
import Chat from "./pages/Chat.jsx";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/profile-view" element={<ProfileView />} />
        <Route path="/preference-setup" element={<PreferenceSetup />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}