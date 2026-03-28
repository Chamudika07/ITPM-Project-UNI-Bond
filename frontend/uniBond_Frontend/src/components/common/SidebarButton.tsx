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
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-400/50 transition-colors group"
    >
      <div className="p-2 bg-gray-400/60 rounded-lg group-hover:bg-black/15">
        <Icon className="w-5 h-5 text-gray-700 group-hover:text-black" />
      </div>
      <div>
        <p className="font-medium text-black">{label}</p>
        {description && <p className="text-sm text-gray-700">{description}</p>}
      </div>
    </Link>
  );
}