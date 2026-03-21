import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleGetGroups, handleCreateGroup } from "@/controllers/groupController";
import type { Group } from "@/types/group";
import SectionCard from "@/components/common/SectionCard";
import { Users, MessagesSquare } from "lucide-react";

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    const data = await handleGetGroups();
    setGroups(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!user || !newGroupName) return;
     try {
         await handleCreateGroup(newGroupName, newGroupDesc, user.id);
         setNewGroupName("");
         setNewGroupDesc("");
         fetchGroups();
     } catch (err: any) {
         alert("Failed to create group");
     }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-8 space-y-6">
         <div className="flex justify-between items-center mb-6 px-2">
           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600"/> Study Groups
           </h1>
         </div>
         
         {loading ? (
             <div className="text-center py-10">Loading groups...</div>
         ) : groups.length === 0 ? (
             <SectionCard title="Groups">
                <p className="text-gray-500 text-center py-4">No groups yet.</p>
             </SectionCard>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(g => (
                 <div key={g.id} className="bg-white border rounded-xl p-5 hover:border-blue-300 shadow-sm cursor-pointer transition" onClick={() => navigate(`/groups/${g.id}`)}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{g.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{g.description}</p>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-500 mt-auto border-t pt-3">
                       <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {g.members.length} Members</span>
                       <span className="flex items-center gap-1"><MessagesSquare className="w-4 h-4"/> {g.discussions.length} Posts</span>
                    </div>
                 </div>
              ))}
            </div>
         )}
      </div>

      <div className="md:col-span-4">
         <SectionCard title="Create Group">
            <form onSubmit={handleCreate} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                  <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. React Learners" required />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" rows={3} value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} placeholder="What is this group about?" required />
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 shadow-sm">
                 Create Group
               </button>
            </form>
         </SectionCard>
      </div>
    </div>
  );
}