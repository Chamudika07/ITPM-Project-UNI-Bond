import { MessageSquare } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

export default function ProfessionalCommunication() {
  return (
    <SectionCard title="Professional Communication">
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Communication</h3>
        <p className="text-gray-500">
          This feature will allow you to connect with industry professionals, schedule meetings, and network professionally.
        </p>
      </div>
    </SectionCard>
  );
}