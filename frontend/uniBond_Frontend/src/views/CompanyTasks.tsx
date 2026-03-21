import { Briefcase } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

export default function CompanyTasks() {
  return (
    <SectionCard title="Company and Tasks">
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Company Tasks</h3>
        <p className="text-gray-500">
          Manage company tasks, projects, and assignments. Track progress and collaborate with your team.
        </p>
      </div>
    </SectionCard>
  );
}