import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
};

export default function IconNavButton({ to, icon: Icon, label, isActive }: Props) {
  const location = useLocation();
  const active = isActive ?? location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}