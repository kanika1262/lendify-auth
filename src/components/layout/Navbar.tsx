
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LineChart, DollarSign, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, [location]);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-subtle' 
          : 'py-5 bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium flex items-center space-x-2 transition-transform hover:translate-x-[2px]"
        >
          <span className="text-primary">Lendify</span>
        </Link>
        
        <div className="flex items-center space-x-1">
          <NavLink to="/" icon={<Home size={18} />} label="Home" active={location.pathname === '/'} />
          
          {isLoggedIn ? (
            <>
              <NavLink 
                to="/dashboard" 
                icon={<LineChart size={18} />} 
                label="Dashboard" 
                active={location.pathname === '/dashboard'} 
              />
              <NavLink 
                to="/loans" 
                icon={<DollarSign size={18} />} 
                label="Loans" 
                active={location.pathname === '/loans'} 
              />
            </>
          ) : (
            <>
              <NavLink 
                to="/login" 
                icon={<LogIn size={18} />} 
                label="Login" 
                active={location.pathname === '/login'} 
              />
              <NavLink 
                to="/signup" 
                icon={<UserPlus size={18} />} 
                label="Signup" 
                active={location.pathname === '/signup'} 
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const NavLink = ({ to, label, icon, active }: NavLinkProps) => {
  return (
    <Link to={to}>
      <Button 
        variant={active ? "default" : "ghost"} 
        className={`flex items-center space-x-1 h-9 px-3 ${
          active 
            ? 'bg-primary text-primary-foreground' 
            : 'hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {icon}
        <span className="ml-1">{label}</span>
      </Button>
    </Link>
  );
};

export default Navbar;
