// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebaseConfig";
import logo from "../assets/logo.png";
import { Button } from "./ui/button";

import {
  User as UserIcon,
  Users,
  Calendar,
  LayoutDashboard,
  Plus,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type AppUser = {
  role?: string; // we'll trim and normalize
  tokens?: number;
};

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            // Defensive: trim the role string to avoid accidental whitespace issues
            const data = snap.data() as any;
            const roleRaw = data?.role ?? "student";
            const role = typeof roleRaw === "string" ? roleRaw.trim() : roleRaw;
            setAppUser({ ...data, role, tokens: data?.tokens ?? 0 });
          } else {
            // fallback default user object
            setAppUser({ role: "student", tokens: 0 });
          }
        } catch (err) {
          console.error("Error fetching user doc:", err);
          setAppUser({ role: "student", tokens: 0 });
        }
      } else {
        setAppUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  const role = (appUser?.role || "student").toString().trim().toLowerCase();

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all ${
        location.pathname === to ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Insti Chain" className="h-8 w-8" />
            <span className="text-xl font-bold">Insti Chain</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
            {!firebaseUser ? (
              <>
                <NavLink to="/events">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Events
                </NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <Button asChild variant="outline">
                  <Link to="/signin">
                    <UserIcon className="inline w-4 h-4 mr-1" />
                    Sign In
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {/* Events (everyone sees events) */}
                <NavLink to="/events">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Events
                </NavLink>

                {/* Dashboard link for all logged-in users */}
                <NavLink to="/dashboard">
                  <LayoutDashboard className="inline w-4 h-4 mr-1" />
                  Dashboard
                </NavLink>

                {/* Club-only controls */}
                {role === "club" && (
                  <>
                    <NavLink to="/club">
                      <Users className="inline w-4 h-4 mr-1" />
                      Club
                    </NavLink>
                    <Button asChild>
                      <Link to="/club/new-event">
                        <Plus className="inline w-4 h-4 mr-1" />
                        New Event
                      </Link>
                    </Button>
                  </>
                )}

                {/* Profile is always visible (admins are still users) */}
                <NavLink to="/profile">
                  <UserIcon className="inline w-4 h-4 mr-1" />
                  Profile
                </NavLink>

                {/* Tokens indicator (if available) */}
                {typeof appUser?.tokens === "number" && (
                  <div className="ml-2 px-3 py-1 rounded-full bg-token text-token-foreground text-sm font-medium">
                    {appUser.tokens} tokens
                  </div>
                )}

                {/* Logout */}
                <button onClick={handleLogout} className="px-3 py-2 rounded-lg hover:bg-secondary text-red-500">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card/95 py-4 border-t">
          <div className="flex flex-col space-y-2 px-4">
            {!firebaseUser ? (
              <>
                <Link to="/events" className="w-full">Events</Link>
                <Link to="/about" className="w-full">About</Link>
                <Link to="/contact" className="w-full">Contact</Link>
                <Link to="/signin" className="w-full">Sign In</Link>
              </>
            ) : (
              <>
                <Link to="/events" className="w-full">Events</Link>
                <Link to="/dashboard" className="w-full">Dashboard</Link>
                {role === "club" && (
                  <>
                    <Link to="/club" className="w-full">Club</Link>
                    <Link to="/club/new-event" className="w-full">New Event</Link>
                  </>
                )}
                <Link to="/profile" className="w-full">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left">Sign Out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
