import { MessageSquare, Briefcase, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "@/components/common/Avatar";
import SidebarButton from "@/components/common/SidebarButton";
import SectionCard from "@/components/common/SectionCard";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuthHook";

export default function LeftSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Profile Section */}
      <SectionCard title="Profile">
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Avatar src="https://via.placeholder.com/40" alt={user.firstname} />
          <div>
            <p className="font-medium text-gray-900">
              {user.firstname} {user.lastname}
            </p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </Link>
      </SectionCard>

      {/* Menu Items */}
      <SectionCard title="Menu">
        <div className="space-y-2">
          <SidebarButton
            to={ROUTES.PROFESSIONAL_COMMUNICATION}
            icon={MessageSquare}
            label="Professional Communication"
            description="Connect with industry professionals"
          />
          <SidebarButton
            to={ROUTES.COMPANY_TASKS}
            icon={Briefcase}
            label="Company and Task"
            description="Manage company tasks and projects"
          />
          <SidebarButton
            to={ROUTES.KUPPY_SESSIONS}
            icon={Coffee}
            label="Kuppy Sessions"
            description="Join casual networking sessions"
          />
        </div>
      </SectionCard>
    </div>
  );
}