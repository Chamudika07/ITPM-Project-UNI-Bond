import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Users,
  Bell,
  FileText,
  User,
  LogOut,
  Shield,
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
    <nav className="bg-gray-300 text-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <AppLogo />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar className="w-full text-gray-900" />
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
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition overflow-hidden border-2 border-transparent hover:border-white focus:outline-none"
              >
                {user ? (
                  <span className="text-sm font-bold uppercase">{user.firstname.charAt(0)}{user.lastname.charAt(0)}</span>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1.5 z-50 border border-gray-200 text-gray-800">
                  {/* Admin Panel link — only for admins */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2.5 text-sm hover:bg-blue-50 text-blue-700 font-semibold flex items-center gap-2 border-b border-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to={ROUTES.PROFILE}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 font-medium"
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