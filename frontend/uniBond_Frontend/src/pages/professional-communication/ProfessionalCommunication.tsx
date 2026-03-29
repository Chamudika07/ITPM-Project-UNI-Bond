import { useEffect, useState } from "react";
import { MessageSquare, BriefcaseBusiness, GraduationCap, ShieldCheck } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import DiscoverUsersList from "@/components/user/DiscoverUsersList";
import { handleGetDiscoverUsers } from "@/controllers/userController";
import type { DiscoverUser } from "@/types/user";

type ProfessionalBuckets = {
  mentors: DiscoverUser[];
  industry: DiscoverUser[];
};

export default function ProfessionalCommunication() {
  const [data, setData] = useState<ProfessionalBuckets>({ mentors: [], industry: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        setError("");

        const [mentors, industry] = await Promise.all([
          handleGetDiscoverUsers(8, ["lecturer"]),
          handleGetDiscoverUsers(12, ["company", "tech_lead"]),
        ]);

        setData({ mentors, industry });
      } catch (err) {
        console.error("Failed to load professional communication data", err);
        setError("Professional contacts could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);

  const totalPeople = data.mentors.length + data.industry.length;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Professional Communication</h1>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Connect with lecturers, companies, and technical leaders already on UniBond. Open a profile,
            follow relevant people, and build your professional network from one place.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-2xl font-black">{totalPeople}</p>
            <p className="mt-1 text-sm text-slate-200">Professional profiles available</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-2xl font-black">{data.mentors.length}</p>
            <p className="mt-1 text-sm text-slate-200">Academic mentors</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-2xl font-black">{data.industry.length}</p>
            <p className="mt-1 text-sm text-slate-200">Industry professionals</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Industry Partners">
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <BriefcaseBusiness className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <p>
                Explore company representatives and tech leads who can open doors to tasks, partnerships,
                internships, and professional guidance.
              </p>
            </div>
            <DiscoverUsersList users={data.industry} loading={loading} error={error} />
          </SectionCard>

          <SectionCard title="Academic Mentors">
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
              <p>
                Find lecturers you can follow for guidance, subject expertise, and stronger academic-professional connections.
              </p>
            </div>
            <DiscoverUsersList users={data.mentors} loading={loading} error={error} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="How It Works">
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">1. Open a profile</p>
                <p className="mt-1">Click any person card to see their UniBond profile and recent activity.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">2. Follow professionals</p>
                <p className="mt-1">Use the follow action on profile pages to stay updated with people relevant to your goals.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">3. Build connections</p>
                <p className="mt-1">Use tasks, posts, and profile interactions together to grow real academic and industry links.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Available APIs">
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold text-slate-900">Already connected</p>
                  <p className="mt-1">This screen now uses `/users/discover` with role filters, plus existing profile and follow APIs.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Backend status</p>
                <p className="mt-1">A new dedicated backend module was not needed because the user discovery and follow system already covered this feature cleanly.</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
