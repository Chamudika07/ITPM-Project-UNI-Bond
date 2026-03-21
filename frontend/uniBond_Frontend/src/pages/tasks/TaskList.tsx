import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleGetTasks, handleApplyTask } from "@/controllers/taskController";
import type { Task } from "@/types/task";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { Briefcase, ArrowRight, UserCheck, TrendingUp } from "lucide-react";

export default function TaskList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const data = await handleGetTasks();
    setTasks(data);
    setLoading(false);
  };

  const onApply = async (id: string) => {
    if (!user) return;
    try {
      await handleApplyTask(id, user.id);
      alert("Application submitted!");
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to apply");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* Task List Section */}
      <div className="md:col-span-8 space-y-6">
        <div className="flex justify-between items-center mb-6 px-2">
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600"/> Tasks & Opportunities
           </h1>
           {user?.role === "company" && (
             <button onClick={() => navigate("/tasks/create")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
               + Post Task
             </button>
           )}
        </div>

        {loading ? (
          <div className="text-center py-10">Loading opportunities...</div>
        ) : tasks.length === 0 ? (
          <SectionCard title="Available Tasks">
             <EmptyState icon={Briefcase} title="No Tasks Available" description="There are currently no tasks posted by companies." />
          </SectionCard>
        ) : (
          <div className="space-y-4">
             {tasks.map(t => (
                <div key={t.id} className="bg-white border rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-lg text-gray-900 leading-tight">{t.title}</h3>
                     <span className="text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 shrink-0">
                       {t.salaryOrReward}
                     </span>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-3">{t.companyName}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{t.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {t.requirements.slice(0, 3).map((req, idx) => (
                      <span key={idx} className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        {req}
                      </span>
                    ))}
                    {t.requirements.length > 3 && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                        +{t.requirements.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                     <div className="text-xs font-medium text-gray-400">
                       Deadline: {new Date(t.deadline).toLocaleDateString()}
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => navigate(`/tasks/${t.id}`)} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded transition text-sm flex items-center gap-1">
                          Details
                        </button>
                        {user?.role === "student" && (
                          <button 
                            disabled={t.applicants.includes(user.id)}
                            onClick={() => onApply(t.id)} 
                            className={`px-4 py-1.5 font-semibold rounded transition text-sm flex items-center gap-1 ${t.applicants.includes(user.id) ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'}`}
                          >
                            {t.applicants.includes(user.id) ? <UserCheck className="w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                            {t.applicants.includes(user.id) ? "Applied" : "Apply"}
                          </button>
                        )}
                     </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>

      {/* Leaderboard Section */}
      <div className="md:col-span-4 space-y-6">
        <SectionCard title="Top 10 Students">
           <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500 bg-gray-50 p-2 rounded-lg">
             <TrendingUp className="w-4 h-4 text-blue-500" />
             Based on successfully completed tasks
           </div>
           
           <div className="space-y-3">
             {[1,2,3,4,5,6,7,8,9,10].map(rank => (
               <div key={rank} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition group">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : rank === 2 ? 'bg-gray-200 text-gray-700' : rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                   #{rank}
                 </div>
                 <img src={`https://ui-avatars.com/api/?name=Student+${rank}&background=random`} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm bg-white" />
                 <div className="flex-1 truncate">
                   <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate text-sm">Student Name {rank}</h4>
                   <p className="text-xs text-blue-600 font-medium">{(200 - rank * 15)} Points</p>
                 </div>
               </div>
             ))}
           </div>
        </SectionCard>
      </div>

    </div>
  );
}
