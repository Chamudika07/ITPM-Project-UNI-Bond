import { MessageSquare, Briefcase, Coffee, User, Building2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuthHook";

export default function LeftSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getInitials = () =>
    `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();

  const menuItems = [
    {
      to: ROUTES.PROFESSIONAL_COMMUNICATION,
      icon: MessageSquare,
      label: "Professional Communication",
      description: "Connect with professionals",
    },
    {
      to: ROUTES.COMPANY_TASKS,
      icon: Briefcase,
      label: "Company and Task",
      description: "Manage company tasks",
    },
    {
      to: "/companies",
      icon: Building2,
      label: "Partner Companies",
      description: "Explore industry partners",
    },
    {
      to: ROUTES.KUPPY_SESSIONS,
      icon: Coffee,
      label: "Kuppy Sessions",
      description: "Join networking sessions",
    },
  ];

  return (
    <div className="space-y-3 sticky top-[80px] max-h-[calc(100vh-80px)] overflow-y-auto pb-4">
      {/* Profile Card */}
      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Profile
        </h3>
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-400/50 transition-all duration-200 active:scale-[0.98] group"
        >
          {/* Avatar Circle */}
          <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:ring-2 group-hover:ring-black/30 transition-all">
            {user.firstname ? getInitials() : <User className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-semibold text-black text-sm leading-tight">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-xs text-gray-700 capitalize mt-0.5">{user.role}</p>
          </div>
        </Link>
      </div>
      {/* Menu Card */}
      <div className="bg-gray-300 rounded-2xl p-5 shadow-sm border border-gray-400/40">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-3">
          Menu
        </h3>
        <div className="space-y-1">
          {menuItems.map(({ to, icon: Icon, label, description }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.98] group ${
                  isActive ? "bg-black/15 shadow-inner" : "hover:bg-gray-400/50"
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors shrink-0 ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-400/60 text-black group-hover:bg-black group-hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-black text-sm leading-tight">
                    {label}
                  </p>
                  <p className="text-xs text-gray-700 mt-0.5">{description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
