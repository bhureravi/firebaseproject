import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          console.warn("No Firestore user doc");
          setAllowed(false);
        } else {
          setAllowed(true);   // 🔥 ANY logged-in user is allowed
        }
      } catch (e) {
        console.error("Auth check failed", e);
        setAllowed(false);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  if (!allowed) return <Navigate to="/signin" replace />;

  return children;
};

export default ProtectedRoute;
