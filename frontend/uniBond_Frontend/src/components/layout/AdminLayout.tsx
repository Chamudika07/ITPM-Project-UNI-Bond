import { useAuth } from "@/hooks/useAuthHook";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Shield, LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Content Moderation", path: "/admin/content", icon: <FileText className="w-5 h-5" /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shrink-0 min-h-[60px] md:min-h-screen">
        <div className="p-4 flex items-center gap-3 border-b border-slate-700">
           <Shield className="w-8 h-8 text-blue-400" />
           <div>
              <h1 className="font-bold text-lg tracking-wide hidden md:block">Admin Panel</h1>
              <h1 className="font-bold tracking-wide md:hidden">Admin</h1>
           </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 hidden md:block">
           {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <button 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
           })}
        </nav>

        {/* Mobile Nav Top Scroll */}
        <nav className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 bg-slate-800">
           {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <button 
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm shrink-0 whitespace-nowrap ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
           })}
        </nav>
        
        <div className="p-4 border-t border-slate-700 hidden md:block">
           <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">
                  {user?.firstname?.[0] || 'A'}
               </div>
               <div className="truncate">
                  <p className="font-semibold text-sm truncate">{user?.firstname} {user?.lastname}</p>
                  <p className="text-xs text-slate-400 capitalize truncate">{user?.role}</p>
               </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 hover:text-white py-2 rounded-lg text-slate-300 transition text-sm font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
         {children}
      </main>

    </div>
  );
}
