import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleGetKuppySessions, handleJoinKuppySession } from "@/controllers/kuppyController";
import type { KuppySession } from "@/types/kuppy";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import { GraduationCap, Calendar, Users, Trophy } from "lucide-react";

export default function KuppySessions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<KuppySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const data = await handleGetKuppySessions();
    setSessions(data);
    setLoading(false);
  };

  const onJoin = async (id: string) => {
    if (!user) return;
    try {
      await handleJoinKuppySession(id, user.id);
      alert("Joined session!");
      fetchSessions();
    } catch (err: any) {
      alert(err.message || "Failed to join");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600"/> Peer Kuppy Sessions
         </h1>
         <button onClick={() => navigate("/kuppy/create")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition">
           + Host a Kuppy
         </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between mb-6 shadow-sm">
         <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
               <h3 className="font-bold text-indigo-900">Host Kuppy Sessions, Earn Points!</h3>
               <p className="text-sm text-indigo-700">Help your peers and climb the student leaderboard.</p>
            </div>
         </div>
         {user && (
            <div className="text-right">
               <p className="text-xs font-semibold text-indigo-500 uppercase">Your Points</p>
               <p className="text-2xl font-bold text-indigo-800">120 <span className="text-base font-medium">pts</span></p>
            </div>
         )}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <SectionCard title="Sessions">
           <EmptyState icon={GraduationCap} title="No Kuppy Sessions" description="Be the first to host a session." />
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {sessions.map(s => (
              <div key={s.id} className="bg-white border rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition shadow-sm flex flex-col justify-between">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{s.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                       <Calendar className="w-4 h-4 text-gray-400" />
                       {new Date(s.datetime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                       <Users className="w-4 h-4 text-gray-400" />
                       Host: <span className="text-indigo-600 font-semibold">{s.hostName}</span>
                       <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">+{s.pointsEarned} Host Pts</span>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500 font-medium">{s.participants.length} joining</div>
                    {user?.id !== s.hostId && (
                       <button 
                         disabled={!!user && s.participants.includes(user.id)}
                         onClick={() => onJoin(s.id)} 
                         className={`px-4 py-2 font-semibold rounded-lg transition text-sm flex items-center gap-2 ${user && s.participants.includes(user.id) ? 'bg-indigo-100 text-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                       >
                         {user && s.participants.includes(user.id) ? "Joined" : "Join Session"}
                       </button>
                    )}
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}