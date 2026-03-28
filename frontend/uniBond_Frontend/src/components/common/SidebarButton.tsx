import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  to: string;
  icon: LucideIcon;
  label: string;
  description?: string;
};

export default function SidebarButton({ to, icon: Icon, label, description }: Props) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.98] group ${
        isActive ? "bg-blue-50/80 shadow-sm ring-1 ring-blue-100/50" : "hover:bg-slate-100"
      }`}
    >
      <div
        className={`p-2.5 rounded-xl transition-colors ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-white border border-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className={`font-semibold ${isActive ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"}`}>
          {label}
        </p>
        {description && (
          <p className={`text-xs mt-0.5 ${isActive ? "text-blue-600/80" : "text-slate-500"}`}>
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}