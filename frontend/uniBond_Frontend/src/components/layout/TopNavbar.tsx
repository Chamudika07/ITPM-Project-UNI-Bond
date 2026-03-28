import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Users,
  Bell,
  FileText,
  User,
  LogOut
} from "lucide-react";
import AppLogo from "@/components/common/AppLogo";
import SearchBar from "@/components/common/SearchBar";
import IconNavButton from "@/components/common/IconNavButton";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuthHook";

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-gray-100 text-black border-b border-gray-400/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <AppLogo />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar className="w-full text-black" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <IconNavButton to={ROUTES.HOME} icon={Home} label="Home" />
            <IconNavButton to={ROUTES.GROUPS} icon={Users} label="Groups" />
            <IconNavButton to={ROUTES.NOTICES} icon={FileText} label="Notices" />
            <IconNavButton to={ROUTES.NOTIFICATIONS} icon={Bell} label="Notifications" />
            
            <div className="relative ml-2" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 transition overflow-hidden border-2 border-transparent focus:outline-none"
              >
                {user ? (
                  <span className="text-sm font-bold uppercase">{user.firstname.charAt(0)}{user.lastname.charAt(0)}</span>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-300 rounded-md shadow-lg py-1 z-50 border border-gray-400/40 text-black">
                  {/* Admin link added to dropdown as requested */}
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="flex px-4 py-2 text-sm text-black hover:bg-gray-400/50 items-center gap-2 font-bold"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to={ROUTES.PROFILE}
                    className="flex px-4 py-2 text-sm text-black hover:bg-gray-400/50 items-center gap-2"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}