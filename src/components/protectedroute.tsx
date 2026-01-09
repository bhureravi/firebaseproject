// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

interface Props {
  children: React.ReactNode;
}

/**
 * ProtectedRoute:
 * - Waits for Firebase auth state
 * - If user exists -> renders children
 * - If not -> redirects to /signin
 */
export default function ProtectedRoute({ children }: Props) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // while we check auth, render nothing (or spinner if you want)
  if (!authChecked) return null;

  return isLoggedIn ? <>{children}</> : <Navigate to="/signin" replace />;
}
