import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleCreateClassroom } from "@/controllers/classroomController";
import SectionCard from "@/components/common/SectionCard";
import { Users } from "lucide-react";

export default function CreateClassroom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user || user.role !== "tech_lead") {
    return (
      <SectionCard title="Access Denied">
        <p>Only Tech Leads can create classrooms.</p>
      </SectionCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || maxStudents < 1) {
      setError("Please fill all fields correctly.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await handleCreateClassroom(user.id, `${user.firstname} ${user.lastname}`, title, description, maxStudents);
      navigate("/classrooms");
    } catch (err: any) {
      setError(err.message || "Failed to create classroom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Create Classroom">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 border rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Classroom</h2>
            <p className="text-sm text-gray-500">Host your own professional session.</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
           <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Advanced System Design" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Detailed course description..." 
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Students</label>
           <input type="number" min="1" max="500" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={maxStudents} onChange={(e) => setMaxStudents(parseInt(e.target.value))} />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Creating..." : "Create Classroom"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
