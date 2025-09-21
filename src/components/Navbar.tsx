import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "../utils/storage";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";
import { 
  User, 
  Users, 
  Calendar, 
  LayoutDashboard, 
  Plus, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleSignOut = () => {
    signOut();
    navigate("/");
    window.location.reload(); // Refresh to update navbar state
  };

  const NavLink = ({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-all duration-smooth hover:bg-secondary ${
        location.pathname === to ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"
      } ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Insti Chain" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Insti Chain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {!currentUser ? (
              // Public Navigation
              <>
                <NavLink to="/events">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Events
                </NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                <Button 
                  asChild 
                  variant="outline" 
                  className="ml-4"
                >
                  <Link to="/signin">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </>
            ) : currentUser.role === 'student' ? (
              // Student Navigation
              <>
                <NavLink to="/events">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Events
                </NavLink>
                <NavLink to="/dashboard">
                  <LayoutDashboard className="w-4 h-4 inline mr-2" />
                  Dashboard
                </NavLink>
                <NavLink to="/profile">
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </NavLink>
                <div className="flex items-center bg-token text-token-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {currentUser.tokens} tokens
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              // Club Navigation
              <>
                <NavLink to="/club">
                  <Users className="w-4 h-4 inline mr-2" />
                  Dashboard
                </NavLink>
                <Button asChild variant="default" size="sm">
                  <Link to="/club/new-event">
                    <Plus className="w-4 h-4 mr-2" />
                    New Event
                  </Link>
                </Button>
                <NavLink to="/profile">
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </NavLink>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-card/95">
            <div className="flex flex-col space-y-2">
              {!currentUser ? (
                <>
                  <NavLink to="/events" className="w-full">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Events
                  </NavLink>
                  <NavLink to="/about" className="w-full">About</NavLink>
                  <NavLink to="/contact" className="w-full">Contact</NavLink>
                  <Button asChild variant="outline" className="mt-2">
                    <Link to="/signin">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                </>
              ) : currentUser.role === 'student' ? (
                <>
                  <NavLink to="/events" className="w-full">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Events
                  </NavLink>
                  <NavLink to="/dashboard" className="w-full">
                    <LayoutDashboard className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/profile" className="w-full">
                    <User className="w-4 h-4 inline mr-2" />
                    Profile
                  </NavLink>
                  <div className="flex items-center justify-center bg-token text-token-foreground px-3 py-2 rounded-lg text-sm font-medium mt-2">
                    {currentUser.tokens} tokens earned
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full mt-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/club" className="w-full">
                    <Users className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </NavLink>
                  <Button asChild variant="default" className="mt-2">
                    <Link to="/club/new-event">
                      <Plus className="w-4 h-4 mr-2" />
                      New Event
                    </Link>
                  </Button>
                  <NavLink to="/profile" className="w-full">
                    <User className="w-4 h-4 inline mr-2" />
                    Profile
                  </NavLink>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full mt-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;