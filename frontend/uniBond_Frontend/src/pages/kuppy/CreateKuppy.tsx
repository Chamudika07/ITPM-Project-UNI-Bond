import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleCreateKuppySession } from "@/controllers/kuppyController";
import SectionCard from "@/components/common/SectionCard";
import { GraduationCap } from "lucide-react";

export default function CreateKuppy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
       <SectionCard title="Access Denied"><p>Please log in.</p></SectionCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !datetime) {
      setError("Please fill all fields.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await handleCreateKuppySession(user.id, `${user.firstname} ${user.lastname}`, title, description, new Date(datetime).toISOString());
      navigate("/kuppy");
    } catch (err: any) {
      setError(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Create Kuppy Session">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 border rounded-xl bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Host a Kuppy</h2>
            <p className="text-sm text-gray-500">Earn points by teaching your peers!</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
           <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Calculus II Revision" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will be covered?" required
          />
        </div>

        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
             <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? "Scheduling..." : "Schedule Session"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
