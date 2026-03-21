import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { handleGetTaskById } from "@/controllers/taskController";
import type { Task } from "@/types/task";
import SectionCard from "@/components/common/SectionCard";
import { ArrowLeft, Building } from "lucide-react";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
       handleGetTaskById(id).then(res => setTask(res || null));
    }
  }, [id]);

  if (!task) return <div className="p-10 text-center">Loading or Not Found</div>;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium mb-4">
         <ArrowLeft className="w-4 h-4" /> Back to Tasks
      </button>

      <SectionCard title={task.title}>
         <div className="flex items-center gap-2 mb-6 font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg w-fit border">
            <Building className="w-4 h-4"/>
             {task.companyName}
         </div>

         <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
         <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-6 bg-white p-4 rounded-lg border">{task.description}</p>
         
         <h3 className="text-lg font-bold text-gray-900 mb-2">Requirements</h3>
         <ul className="list-disc list-inside text-gray-700 mb-8 space-y-1">
           {task.requirements.map((req, i) => (
             <li key={i}>{req}</li>
           ))}
         </ul>
         
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center mb-6">
            <div>
               <p className="text-sm font-semibold text-blue-800">Reward / Salary</p>
               <p className="text-xl font-bold text-blue-900">{task.salaryOrReward}</p>
            </div>
            <div className="text-right">
               <p className="text-sm font-semibold text-blue-800">Deadline</p>
               <p className="text-lg font-bold text-blue-900">{new Date(task.deadline).toLocaleDateString()}</p>
            </div>
         </div>

         <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm font-medium text-gray-500">
               Posted {new Date(task.createdAt).toLocaleDateString()}
            </div>
            <div className="font-bold text-gray-900">
               {task.applicants.length} Applicants
            </div>
         </div>
      </SectionCard>
    </div>
  );
}
