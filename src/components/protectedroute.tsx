// src/components/ProtectedRoute.tsx
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserExists(true);
      } else {
        setUserExists(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <div className="p-10">Checking authentication...</div>;
  }

  if (!userExists) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
