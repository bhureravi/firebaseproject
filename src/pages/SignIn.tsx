// src/pages/SignIn.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "../firebaseConfig";

const COLLEGE_DOMAIN = "@smail.iitm.ac.in";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const navigate = useNavigate();
  const redirectedRef = useRef(false); // prevents double navigation

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: User | null) => {
      if (user && !user.emailVerified) {
        setInfo(
          "Please verify your email address. Check your inbox for the verification link."
        );
      } else {
        setInfo(null);
      }
    });

    return () => unsub();
  }, []);

  const showError = (e: unknown) => {
    console.error(e);
    alert(
      typeof e === "object" && e && "message" in e
        ? (e as any).message
        : String(e)
    );
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!email || !pw || !name) {
      alert("Please enter name, college email and password.");
      return;
    }

    if (!email.toLowerCase().endsWith(COLLEGE_DOMAIN)) {
      alert(`Please use your institute email (${COLLEGE_DOMAIN}).`);
      return;
    }

    setLoading(true);
    setInfo(null);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);

      // default profile document in Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        role: "student", // default
        walletAddress: null,
        createdAt: serverTimestamp(),
      });

      await sendEmailVerification(cred.user);
      await signOut(auth);

      setInfo(
        "Registration successful. Verification email sent. Please verify and then log in."
      );
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!email || !pw) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);
    setInfo(null);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pw);

      if (!cred.user.emailVerified) {
        await signOut(auth);
        setInfo("Email not verified. Please verify before logging in.");
        return;
      }

      // Read user role from Firestore and redirect appropriately
      const userSnap = await getDoc(doc(db, "users", cred.user.uid));
      if (!userSnap.exists()) {
        alert("User profile not found in Firestore.");
        await signOut(auth);
        return;
      }

      const role = userSnap.data()?.role || "student";

      if (!redirectedRef.current) {
        redirectedRef.current = true;
        if (role === "head") {
          navigate("/dashboard", { replace: true }); // or /head if you implement a head dashboard
        } else if (role === "club") {
          navigate("/club", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Sign in / Register</h2>

      {info && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
          {info}
        </div>
      )}

      <label className="block mb-2">
        <div className="text-sm text-gray-600">Full name (for registration)</div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        <div className="text-sm text-gray-600">College email</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`you${COLLEGE_DOMAIN}`}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        <div className="text-sm text-gray-600">Password</div>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <div className="flex gap-3">
        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Login
        </button>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="px-4 py-2 rounded border"
        >
          Register
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Use your institute email ending with{" "}
        <strong>{COLLEGE_DOMAIN}</strong>.
      </p>
    </div>
  );
};

export default SignIn;
