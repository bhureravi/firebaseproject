import { Link } from "react-router-dom";
import { Mail, ExternalLink, Github, Instagram } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Insti Chain" className="h-8 w-8" />
              <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                Insti Chain
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering students through transparent participation tracking and token rewards. 
              Built by WebOps & Blockchain Club IITM.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <div className="space-y-2">
              <Link 
                to="/events" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Events
              </Link>
              <Link 
                to="/about" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                About
              </Link>
              <Link 
                to="/help" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Help & FAQ
              </Link>
              <Link 
                to="/contact" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Club Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Our Clubs</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground">WebOps Club IITM</h4>
                <p className="text-xs text-muted-foreground">Web development & operations</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">Blockchain Club IITM</h4>  
                <p className="text-xs text-muted-foreground">Blockchain & Web3 education</p>
              </div>
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contact@instichain.iitm.ac.in"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                contact@instichain.iitm.ac.in
              </a>
              <a 
                href="https://github.com/webops-iitm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a 
                href="https://instagram.com/webops_iitm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs text-muted-foreground">
              © 2025 Insti Chain. Built with ❤️ by WebOps & Blockchain Club IITM.
            </div>
            <div className="flex space-x-6 text-xs">
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;