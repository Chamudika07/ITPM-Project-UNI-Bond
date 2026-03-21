import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  icon: LucideIcon;
  label: string;
  description?: string;
};

export default function SidebarButton({ to, icon: Icon, label, description }: Props) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100">
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </Link>
  );
}