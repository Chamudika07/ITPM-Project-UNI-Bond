import { useState } from "react";
import SectionCard from "@/components/common/SectionCard";
import { UserX, UserCheck } from "lucide-react";

export default function AdminUsers() {
   const [users, setUsers] = useState([
      { id: "1", name: "Alice Student", email: "alice@uni.edu", role: "student", status: "active" },
      { id: "2", name: "Prof. Nimal", email: "nimal@uni.edu", role: "lecturer", status: "active" },
      { id: "3", name: "Spam Bot", email: "spam@fake.com", role: "student", status: "banned" },
      { id: "4", name: "Sysco LABS", email: "contact@syscolabs.lk", role: "company", status: "pending" },
   ]);

   const toggleStatus = (id: string, newStatus: string) => {
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
   };

   return (
      <div className="space-y-6">
         <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
         
         <SectionCard title="All Users">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                     <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map(u => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                           <td className="px-4 py-4 font-medium text-gray-900">{u.name}</td>
                           <td className="px-4 py-4">{u.email}</td>
                           <td className="px-4 py-4 capitalize">
                             <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{u.role}</span>
                           </td>
                           <td className="px-4 py-4">
                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'banned' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {u.status}
                             </span>
                           </td>
                           <td className="px-4 py-4 flex gap-3">
                              {u.status !== 'active' && (
                                <button onClick={() => toggleStatus(u.id, 'active')} className="text-green-600 hover:text-green-800 bg-green-50 p-1.5 rounded" title="Approve/Unban">
                                   <UserCheck className="w-5 h-5" />
                                </button>
                              )}
                              {u.status !== 'banned' && (
                                <button onClick={() => toggleStatus(u.id, 'banned')} className="text-red-600 hover:text-red-800 bg-red-50 p-1.5 rounded" title="Ban User">
                                   <UserX className="w-5 h-5" />
                                </button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </SectionCard>
      </div>
   );
}
