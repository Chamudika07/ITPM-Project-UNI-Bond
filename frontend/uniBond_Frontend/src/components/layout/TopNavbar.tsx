import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Bell,
  FileText,
  User,
} from "lucide-react";
import AppLogo from "@/components/common/AppLogo";
import SearchBar from "@/components/common/SearchBar";
import IconNavButton from "@/components/common/IconNavButton";
import { ROUTES } from "@/utils/constants";

export default function TopNavbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center">
            <AppLogo />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <IconNavButton to={ROUTES.HOME} icon={Home} label="Home" />
            <IconNavButton to={ROUTES.GROUPS} icon={Users} label="Groups" />
            <IconNavButton to={ROUTES.NOTICES} icon={FileText} label="Notices" />
            <IconNavButton to={ROUTES.NOTIFICATIONS} icon={Bell} label="Notifications" />
            <IconNavButton to={ROUTES.PROFILE} icon={User} label="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
}