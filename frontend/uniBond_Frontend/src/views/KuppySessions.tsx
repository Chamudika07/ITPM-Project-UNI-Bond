import { Coffee } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

export default function KuppySessions() {
  return (
    <SectionCard title="Kuppy Sessions">
      <div className="text-center py-12">
        <Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Kuppy Sessions</h3>
        <p className="text-gray-500">
          Join casual networking sessions over coffee. Connect with peers in a relaxed environment.
        </p>
      </div>
    </SectionCard>
  );
}