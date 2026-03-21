import { Users } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

export default function Groups() {
  return (
    <SectionCard title="Groups">
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Groups Feature</h3>
        <p className="text-gray-500">
          This is a placeholder for the Groups page. Here you will be able to create and join study groups, project teams, and community groups.
        </p>
      </div>
    </SectionCard>
  );
}