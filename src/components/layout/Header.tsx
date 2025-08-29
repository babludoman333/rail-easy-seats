import { Train, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-primary-hover rounded-lg">
              <Train className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">RailEase</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Book Tickets
            </Link>
            <Link to="/bookings" className="text-foreground hover:text-primary transition-colors">
              My Bookings
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Button size="sm">Sign Up</Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;