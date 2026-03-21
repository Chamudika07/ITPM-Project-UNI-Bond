import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleCreateTask } from "@/controllers/taskController";
import SectionCard from "@/components/common/SectionCard";
import { Briefcase } from "lucide-react";

export default function CreateTask() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.role !== "company") {
    return (
      <SectionCard title="Access Denied">
        <p>Only Company accounts can create tasks.</p>
      </SectionCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !requirements || !deadline) {
      setError("Please fill all required fields.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      const reqsArray = requirements.split(',').map(r => r.trim()).filter(Boolean);
      await handleCreateTask(user.id, "companyName" in user ? user.companyName : "Unknown Company", title, description, reqsArray, salary, deadline);
      navigate("/tasks");
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 border rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Task / Opportunity</h2>
            <p className="text-sm text-gray-500">Publish a task for students.</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
           <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Develop Landing Page" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Detailed task description..." 
            required
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma separated) *</label>
           <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="e.g. React, Node.js" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Salary / Reward</label>
             <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $200 or 50 Points" />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
             <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
           </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Publishing..." : "Publish Task"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
