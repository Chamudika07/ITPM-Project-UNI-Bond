import { User } from "@/types/user";
import SectionCard from "@/components/common/SectionCard";
import { Mail, GraduationCap, MapPin, Home, Briefcase } from "lucide-react";

export default function ProfileLeftColumn({ user }: { user: User }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Intro">
        <div className="space-y-4 text-sm text-gray-700 p-2">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
            <span className="break-all">{user.email}</span>
          </div>
          
          {"education" in user && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Studied <strong>{user.education}</strong></span>
            </div>
          )}
          
          {"industry" in user && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
              <span>Industry: <strong>{user.industry}</strong></span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-gray-400 shrink-0" />
            <span>Lives in <strong>Colombo, Sri Lanka</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <span>From <strong>Kandy, Sri Lanka</strong></span>
          </div>
        </div>
      </SectionCard>
      
      {/* Friends Preview */}
      <div className="bg-white rounded-xl shadow-sm p-4 w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">Connections</h3>
          <button className="text-blue-600 font-semibold cursor-pointer text-sm hover:underline">See All</button>
        </div>
        <p className="text-xs text-gray-500 mb-4">124 connections</p>
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="flex flex-col items-center">
              <img src={`https://ui-avatars.com/api/?name=Friend+${i}&background=random`} alt="" className="w-full aspect-square rounded-lg object-cover mb-1"/>
              <span className="text-xs font-medium text-gray-700 w-full truncate text-center">Friend {i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
