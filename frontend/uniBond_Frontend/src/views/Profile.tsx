import { User, Mail, GraduationCap } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/hook/useAuthHook";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <SectionCard title="Profile">
        <div className="text-center">
          <Avatar src="https://via.placeholder.com/100" alt={user.firstname} size="lg" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-600 capitalize mb-4">{user.role}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>

            {"studentID" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{user.studentID}</p>
                </div>
              </div>
            )}

            {"education" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-medium">{user.education}</p>
                </div>
              </div>
            )}

            {"lecturerUsername" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Lecturer Username</p>
                  <p className="font-medium">{user.lecturerUsername}</p>
                </div>
              </div>
            )}

            {"companyName" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{user.companyName}</p>
                </div>
              </div>
            )}

            {"industry" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">{user.industry}</p>
                </div>
              </div>
            )}

            {"companySize" in user && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Company Size</p>
                  <p className="font-medium">{user.companySize}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}