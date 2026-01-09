
// src/components/AuthButton.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../firebaseConfig";

/**
 * AuthButton:
 * - shows "Sign In" when no firebase user
 * - shows user's short name/email + "Profile" and "Logout" when logged in
 *
 * Usage: place <AuthButton /> in your header/layout where the Sign In button currently is.
 */

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // after logout, go to homepage
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Check console for details.");
    }
  };

  // Small helper to display a friendly label
  const labelFor = (u: User) => {
    // show displayName if set, otherwise email but short
    if (u.displayName) return u.displayName;
    if (u.email) {
      return u.email.replace(/@.*$/, ""); // remove domain for compactness
    }
    return "User";
  };

  if (!user) {
    // Not logged in: show the existing Sign In button style as a Link
    return (
      <Link to="/signin" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-primary/5">
        <span className="hidden sm:inline">Sign In</span>
        <span className="sm:hidden">Sign</span>
      </Link>
    );
  }

  // Logged in: show profile link and logout button
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/profile"
        className="px-3 py-2 rounded-md border bg-white/30 hover:bg-white/40 text-sm font-medium"
      >
        {labelFor(user)}
      </Link>

      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-md border text-sm hover:bg-red-50"
        title="Logout"
      >
        Logout
      </button>
    </div>
  );
}
