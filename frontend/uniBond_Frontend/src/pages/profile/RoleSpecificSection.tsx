import { User } from "@/types/user";
import { BookOpen, Users, PlusCircle, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoleSpecificSection({ user }: { user: User }) {
  const navigate = useNavigate();
  if (user.role === "student") return null;

  let title = "";
  let icon = null;
  let btnLabel = "";
  let linkTarget = "";
  
  if (user.role === "lecturer") {
    title = "Best Courses";
    icon = <BookOpen className="w-5 h-5 text-blue-600" />;
    btnLabel = "Create Course";
    linkTarget = "/courses/create";
  } else if (user.role === "tech_lead") {
    title = "Featured Classrooms";
    icon = <Users className="w-5 h-5 text-blue-600" />;
    btnLabel = "Create Classroom";
    linkTarget = "/classrooms/create";
  } else if (user.role === "company") {
    title = "Company Operations";
    icon = <Briefcase className="w-5 h-5 text-blue-600" />;
    btnLabel = "Manage Tasks";
    linkTarget = "/tasks";
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-blue-100">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
        <h3 className="flex items-center gap-2 font-bold text-gray-900 w-full mb-0">
          {icon}
          {title}
        </h3>
      </div>
      
      {/* Cards Mock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[1, 2].map(i => (
          <div key={i} className="p-4 border rounded-lg bg-gray-50 flex flex-col justify-between">
            <h4 className="font-semibold text-gray-800 text-sm">Sample {title.split(' ')[1]} {i}</h4>
            <p className="text-xs text-gray-500 mt-1 mb-3">High engagement & excellent ratings on this {title.split(' ')[1].toLowerCase()}.</p>
            <button className="text-xs font-semibold text-blue-600 hover:underline text-left">View Details</button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate(linkTarget)}
        className="w-full py-2.5 bg-blue-50 text-blue-700 hover:text-white hover:bg-blue-600 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm shadow-sm"
      >
        <PlusCircle className="w-4 h-4" />
        {btnLabel}
      </button>
    </div>
  );
}
