import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebaseConfig"; // ✅ correct path
import logo from "../assets/logo.png";

// IMPORTANT: use relative path, not @ alias
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
  role: "student" | "club";
  tokens?: number;
};

const Navbar = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Listen to Firebase login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            setAppUser(snap.data() as AppUser);
          } else {
            // fallback (new users)
            setAppUser({ role: "student", tokens: 0 });
          }
        } catch (err) {
          console.error("Error fetching user:", err);
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

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all ${
        location.pathname === to
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary"
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
           ) : appUser?.role === "student" ? (
  <>
    {/* Dashboard */}
    <Link
      to="/dashboard"
      className="px-4 py-2 rounded-lg hover:bg-secondary flex items-center gap-1"
    >
      <LayoutDashboard className="w-4 h-4" />
      Dashboard
    </Link>

    {/* Profile */}
    <Link
      to="/profile"
      className="px-4 py-2 rounded-lg hover:bg-secondary flex items-center gap-1"
    >
      <UserIcon className="w-4 h-4" />
      Profile
    </Link>

    {/* Logout (ONLY logout triggers signOut) */}
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded-lg hover:bg-secondary text-red-500"
    >
      <LogOut className="w-4 h-4" />
    </button>
  </>
)
 : (
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
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
