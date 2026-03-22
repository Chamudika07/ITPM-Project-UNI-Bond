import { useEffect, useState } from "react";
import { CompanyUser } from "@/types/user";
import { handleGetTasks, handleDeleteTask } from "@/controllers/taskController";
import type { Task } from "@/types/task";
import { Briefcase, CheckCircle, Edit2, Trash2, Users, ChevronDown, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard({ user }: { user: CompanyUser }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, [user.id]);

  const fetchMyTasks = async () => {
    setLoading(true);
    const allTasks = await handleGetTasks();
    setTasks(allTasks.filter(t => t.companyId === user.id));
    setLoading(false);
  };

  const onDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await handleDeleteTask(taskId);
      fetchMyTasks();
    }
  };

  if (loading) return <div className="text-center py-10 font-medium text-gray-500">Loading Dashboard...</div>;

  const newlyAddedTasks = tasks.filter(t => t.applicants.length === 0 && t.status !== "completed");
  const selectedTasks = tasks.filter(t => t.applicants.length > 0 && t.status !== "completed");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const totalTasks = tasks.length;
  // Students who completed tasks (mocked via completed tasks' applicants length or status)
  // For simplicity, total completions based on completed tasks
  const totalCompletedPeople = completedTasks.reduce((acc, t) => acc + t.applicants.length, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-2">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Company Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your active opportunities and track applicant progress.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-xl shadow-indigo-200 flex flex-col justify-center items-start text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <Briefcase className="w-32 h-32" />
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4 inline-block">
             <Briefcase className="w-6 h-6 text-white" />
          </div>
          <p className="text-5xl font-black mb-1 drop-shadow-md">{totalTasks}</p>
          <p className="text-indigo-100 font-medium text-lg tracking-wide">Total Tasks Posted</p>
        </div>
        
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 shadow-xl shadow-emerald-200 flex flex-col justify-center items-start text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 p-6 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <CheckCircle className="w-32 h-32" />
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md mb-4 inline-block">
             <Users className="w-6 h-6 text-white" />
          </div>
          <p className="text-5xl font-black mb-1 drop-shadow-md">{totalCompletedPeople}</p>
          <p className="text-emerald-50 font-medium text-lg tracking-wide">Total Applicants Reached</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end">
        <button 
          onClick={() => navigate("/tasks/create")}
          className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Post a New Task
        </button>
      </div>

      {/* Selected Tasks (Has applicants) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
              Active Opportunities
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">These tasks have active student applicants.</p>
          </div>
          <span className="bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full font-bold text-sm border border-amber-200 shadow-sm">{selectedTasks.length} Active</span>
        </div>
        <div className="p-6 space-y-4 bg-slate-50/50">
          {selectedTasks.length === 0 ? <p className="text-sm text-slate-400 text-center py-8 font-medium">No active tasks with applicants.</p> : null}
          {selectedTasks.map(task => (
            <div key={task.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-indigo-200 transition-colors duration-300">
              <div className="p-5 flex justify-between items-center cursor-pointer group" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                <div>
                  <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2 font-medium">
                    <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1.5 text-slate-600"><Users className="w-3.5 h-3.5"/> {task.applicants.length} Applicants</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">Due {new Date(task.deadline).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => navigate(`/tasks/${task.id}`)} title="View Task Details" className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"><Eye className="w-4.5 h-4.5" /></button>
                    <button onClick={() => navigate(`/tasks/${task.id}/edit`)} title="Limited Edit" className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"><Edit2 className="w-4.5 h-4.5" /></button>
                    <button onClick={() => alert("Tasks with active applicants cannot be deleted.")} title="Delete Disabled" className="p-2.5 text-slate-300 bg-slate-50 rounded-xl cursor-not-allowed border border-slate-100"><Trash2 className="w-4.5 h-4.5" /></button>
                  </div>
                  <div className={`p-2 rounded-full transition-transform duration-300 bg-slate-50 ${expandedTask === task.id ? 'rotate-180 bg-indigo-50' : ''}`}>
                    <ChevronDown className={`w-5 h-5 ${expandedTask === task.id ? 'text-indigo-600' : 'text-slate-400'}`}/>
                  </div>
                </div>
              </div>
              
              {/* Applicant Details Dropdown */}
              <div className={`grid transition-all duration-300 ease-in-out ${expandedTask === task.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <h5 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider text-xs">Tracking Applications</h5>
                    <div className="space-y-3">
                      {task.applicants.map(app => (
                        <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-indigo-100 transition">
                          <div className="flex items-center gap-4">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.studentName)}&background=eef2ff&color=4f46e5`} className="w-10 h-10 rounded-full" alt="" />
                            <div>
                              <p className="font-bold text-slate-900">{app.studentName}</p>
                              <p className="text-xs font-medium text-slate-500">{app.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-bold border border-amber-200/50 tracking-wide">
                              {app.status.toUpperCase()}
                            </span>
                            {app.portfolioUrl && (
                              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">View Portfolio</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newly Added Tasks (No applicants) */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden mt-8">
        <div className="bg-white p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              Newly Staged Tasks
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">These tasks have no applicants yet. You have full edit/delete privileges.</p>
          </div>
          <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full font-bold text-sm border border-slate-200">{newlyAddedTasks.length} Pending</span>
        </div>
        <div className="p-6 space-y-4 bg-slate-50/50">
          {newlyAddedTasks.length === 0 ? <p className="text-sm text-slate-400 font-medium text-center py-8">No unassigned staged tasks.</p> : null}
          {newlyAddedTasks.map(task => (
            <div key={task.id} className="bg-white p-5 border border-slate-200 shadow-sm rounded-2xl hover:border-indigo-200 hover:shadow-md transition duration-300">
              <div className="flex justify-between items-center group">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-1 max-w-2xl">{task.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/tasks/${task.id}`)} title="View Task Details" className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"><Eye className="w-4.5 h-4.5" /></button>
                  <button onClick={() => navigate(`/tasks/${task.id}/edit`)} className="p-2.5 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition"><Edit2 className="w-4.5 h-4.5" /></button>
                  <button onClick={() => onDelete(task.id)} className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 hover:text-rose-700 transition"><Trash2 className="w-4.5 h-4.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
