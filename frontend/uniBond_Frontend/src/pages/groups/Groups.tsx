import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleGetGroups, handleCreateGroup } from "@/controllers/groupController";
import type { Group } from "@/types/group";
import SectionCard from "@/components/common/SectionCard";
import { Users, MessagesSquare, AlertCircle, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { validateGroupForm } from "@/utils/validators";

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; description?: string }>({});

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
     if (!user) return;
     const validation = validateGroupForm(newGroupName, newGroupDesc);
     setFieldErrors(validation.errors);
     if (!validation.isValid) {
         setCreateError(validation.error ?? "Please correct the highlighted fields.");
         return;
     }
     try {
         setCreateError("");
         setCreateSuccess("");
         await handleCreateGroup(newGroupName, newGroupDesc, user.id);
         setNewGroupName("");
         setNewGroupDesc("");
         setFieldErrors({});
         setCreateSuccess("Group created successfully. Your new study space is ready.");
         fetchGroups();
     } catch (err: any) {
         setCreateError(err?.message || "Failed to create group");
     }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-8 text-white shadow-xl">
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Study Groups
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Build focused student communities around modules, assignments,
              exam preparation, and collaborative learning. Create a clear group
              so the right members can join quickly.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">{groups.length}</p>
                <p className="mt-1 text-sm text-slate-200">Active groups</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">
                  {groups.reduce((total, group) => total + group.members.length, 0)}
                </p>
                <p className="mt-1 text-sm text-slate-200">Total members</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-2xl font-black">
                  {groups.reduce((total, group) => total + group.discussions.length, 0)}
                </p>
                <p className="mt-1 text-sm text-slate-200">Discussion posts</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-inner backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create Group</h2>
                <p className="mt-1 text-sm text-slate-200">
                  Start a welcoming, well-described group so students instantly
                  understand why they should join.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              {createError ? (
                <div className="rounded-2xl border border-red-200/50 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100">
                  <span className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {createError}
                  </span>
                </div>
              ) : null}

              {createSuccess ? (
                <div className="rounded-2xl border border-emerald-200/40 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100">
                  <span className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    {createSuccess}
                  </span>
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-100">
                  Group Name
                </label>
                <input
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                    fieldErrors.name
                      ? "border-red-300 bg-red-500/10"
                      : "border-white/10 bg-slate-900/60 focus:border-cyan-300"
                  }`}
                  value={newGroupName}
                  onChange={(e) => {
                    setNewGroupName(e.target.value);
                    setFieldErrors((current) => ({ ...current, name: undefined }));
                    setCreateError("");
                    setCreateSuccess("");
                  }}
                  placeholder="e.g. ITPM Final Exam Circle"
                  required
                />
                {fieldErrors.name ? (
                  <p className="mt-1 text-xs font-medium text-red-200">
                    {fieldErrors.name}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-300">
                    Choose a specific name students can recognize immediately.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-100">
                  Description
                </label>
                <textarea
                  className={`w-full rounded-2xl border px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none ${
                    fieldErrors.description
                      ? "border-red-300 bg-red-500/10"
                      : "border-white/10 bg-slate-900/60 focus:border-cyan-300"
                  }`}
                  rows={4}
                  value={newGroupDesc}
                  onChange={(e) => {
                    setNewGroupDesc(e.target.value);
                    setFieldErrors((current) => ({ ...current, description: undefined }));
                    setCreateError("");
                    setCreateSuccess("");
                  }}
                  placeholder="Describe the subject, who this is for, and what members will do together."
                  required
                />
                {fieldErrors.description ? (
                  <p className="mt-1 text-xs font-medium text-red-200">
                    {fieldErrors.description}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-300">
                    Good descriptions help the right students join faster and
                    start contributing immediately.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:brightness-110 disabled:opacity-50"
              >
                Create Group
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {loading ? (
        <SectionCard title="All Groups">
          <div className="py-10 text-center text-sm text-slate-500">
            Loading groups...
          </div>
        </SectionCard>
      ) : groups.length === 0 ? (
        <SectionCard title="All Groups">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No groups yet.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Create the first study group and invite students to start the
              conversation.
            </p>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={`All Groups (${groups.length})`}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {groups.map((g) => (
              <article
                key={g.id}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-lg"
                onClick={() => navigate(`/groups/${g.id}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {g.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {g.description}
                    </p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <Users className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="text-lg font-bold text-slate-900">
                      {g.members.length}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Members
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="text-lg font-bold text-slate-900">
                      {g.discussions.length}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      Posts
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600" />
                    Join discussion
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 transition group-hover:translate-x-0.5">
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
