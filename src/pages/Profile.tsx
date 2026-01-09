// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/signin");
      } else {
        setUser(firebaseUser);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="border rounded-lg p-4 max-w-md">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}</p>
        <p><strong>User ID:</strong> {user.uid}</p>
      </div>
    </div>
  );
};

export default Profile;
