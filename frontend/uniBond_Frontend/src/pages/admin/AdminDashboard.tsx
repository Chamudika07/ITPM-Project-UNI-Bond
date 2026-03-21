import SectionCard from "@/components/common/SectionCard";
import { Users, BookOpen, Briefcase, GraduationCap } from "lucide-react";

export default function AdminDashboard() {
   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} title="Total Users" value="1,248" />
            <StatCard icon={<BookOpen className="w-6 h-6 text-indigo-600" />} title="Active Classrooms" value="34" />
            <StatCard icon={<Briefcase className="w-6 h-6 text-green-600" />} title="Company Tasks" value="156" />
            <StatCard icon={<GraduationCap className="w-6 h-6 text-purple-600" />} title="Kuppy Sessions" value="89" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <SectionCard title="Recent Activity">
               <ul className="space-y-4">
                  <ActivityItem text="New Tech Lead registered: John Doe" time="5 mins ago" />
                  <ActivityItem text="WSO2 posted a new Software Engineering Task" time="1 hour ago" />
                  <ActivityItem text="Student reported a post for inappropriate content" time="2 hours ago" />
               </ul>
            </SectionCard>
            <SectionCard title="System Alerts">
               <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  <p className="font-bold">High Traffic Warning</p>
                  <p className="text-sm mt-1">Database connection pool reaching 80% capacity.</p>
               </div>
            </SectionCard>
         </div>
      </div>
   );
}

function StatCard({ icon, title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
       <div className="p-4 bg-gray-50 rounded-full">{icon}</div>
       <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
       </div>
    </div>
  );
}

function ActivityItem({ text, time }: any) {
  return (
    <li className="flex justify-between items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
       <p className="text-sm text-gray-700 font-medium">{text}</p>
       <span className="text-xs text-gray-400 shrink-0 ml-4 font-semibold">{time}</span>
    </li>
  );
}
