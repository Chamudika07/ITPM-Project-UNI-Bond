import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Eye,
  Edit2,
  Medal,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { handleDeleteTask, handleGetTasks, handleRateTaskApplicant, handleUpdateApplication } from "@/controllers/taskController";
import type { Task, TaskApplication } from "@/types/task";
import { CompanyUser } from "@/types/user";

type DashboardView = "overview" | "all-tasks" | "all-apps" | "submissions";

type TaskWithDerivedFields = Task & {
  urgent: boolean;
  daysLeftLabel: string;
};

const formatDate = (value?: string) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDaysLeftLabel = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return "Deadline unavailable";

  const now = new Date();
  const diffInDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "Past deadline";
  if (diffInDays === 0) return "Due today";
  if (diffInDays === 1) return "1 day left";

  return `${diffInDays} days left`;
};

const getTaskStatusTone = (task: TaskWithDerivedFields) => {
  if (task.status === "completed") {
    return "bg-[var(--success-soft)] text-[var(--success)] border-[color:color-mix(in_srgb,var(--success)_20%,transparent)]";
  }

  if (task.urgent) {
    return "bg-[var(--danger-soft)] text-[var(--danger)] border-[color:color-mix(in_srgb,var(--danger)_20%,transparent)]";
  }

  if (task.applicants.length > 0) {
    return "bg-[var(--accent-soft)] text-[var(--accent)] border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]";
  }

  return "bg-[var(--brand-soft)] text-[var(--brand)] border-[color:color-mix(in_srgb,var(--brand)_20%,transparent)]";
};

const getApplicationTone = (status: TaskApplication["status"]) => {
  switch (status) {
    case "accepted":
      return "bg-[var(--success-soft)] text-[var(--success)] border-[color:color-mix(in_srgb,var(--success)_20%,transparent)]";
    case "rejected":
      return "bg-[var(--danger-soft)] text-[var(--danger)] border-[color:color-mix(in_srgb,var(--danger)_20%,transparent)]";
    case "submitted":
      return "bg-[var(--accent-soft)] text-[var(--accent)] border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]";
    case "completed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-[var(--accent-soft)] text-[var(--accent)] border-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]";
  }
};

function MetricCard({
  title,
  value,
  hint,
  icon: Icon,
  accentClass,
  onClick,
}: {
  title: string;
  value: number;
  hint: string;
  icon: typeof Briefcase;
  accentClass: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel-surface group relative overflow-hidden rounded-[2rem] p-6 text-left hover:-translate-y-1 hover:[box-shadow:var(--shadow-strong)] w-full"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1.5 opacity-90 ${accentClass}`}
      />
      <div className="absolute -right-6 -top-8 h-32 w-32 rounded-full bg-white/45 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {title}
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight text-[var(--text-primary)]">
            {value}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">{hint}</p>
        </div>
        <div className="rounded-2xl border border-white/50 bg-white/70 p-3 text-[var(--text-primary)] shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </button>
  );
}

function SummaryStatCard({
  eyebrow,
  value,
  label,
  tone,
}: {
  eyebrow: string;
  value: number;
  label: string;
  tone: "rose" | "amber" | "sky";
}) {
  const toneClasses = {
    rose: {
      shell:
        "border-rose-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(255,241,242,0.92))] shadow-[0_20px_45px_rgba(244,63,94,0.14)]",
      chip: "bg-rose-100 text-rose-700 border border-rose-200/80",
      value: "text-rose-700",
      glow: "bg-rose-300/30",
    },
    amber: {
      shell:
        "border-amber-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(255,251,235,0.94))] shadow-[0_20px_45px_rgba(245,158,11,0.15)]",
      chip: "bg-amber-100 text-amber-700 border border-amber-200/80",
      value: "text-amber-700",
      glow: "bg-amber-300/30",
    },
    sky: {
      shell:
        "border-sky-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(240,249,255,0.94))] shadow-[0_20px_45px_rgba(14,165,233,0.14)]",
      chip: "bg-sky-100 text-sky-700 border border-sky-200/80",
      value: "text-sky-700",
      glow: "bg-sky-300/30",
    },
  } as const;

  const classes = toneClasses[tone];

  return (
    <div
      className={`relative flex min-h-[260px] overflow-hidden rounded-[2rem] border p-6 backdrop-blur ${classes.shell}`}
    >
      <div className={`absolute -right-8 -top-10 h-24 w-24 rounded-full blur-2xl ${classes.glow}`} />
      <div className="absolute inset-x-6 top-[4.7rem] h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="relative flex w-full flex-col items-center justify-center text-center">
        <span
          className={`inline-flex rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-[0.28em] ${classes.chip}`}
        >
          {eyebrow}
        </span>
        <p className={`mt-10 text-6xl font-black tracking-[-0.04em] ${classes.value}`}>{value}</p>
        <p className="mt-5 max-w-[12rem] text-[15px] font-semibold leading-8 text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-[var(--border-strong)] bg-[color:color-mix(in_srgb,var(--surface-muted)_78%,white)] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
        <Sparkles className="h-6 w-6" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-[var(--text-primary)]">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="btn-primary mt-5 px-5 py-3 text-sm">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function DataTable({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel-surface overflow-hidden rounded-[2rem]">
      <div className="border-b border-[var(--border-soft)] px-6 py-5 sm:px-7">
        <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">{title}</h3>
        {description ? <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p> : null}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export default function CompanyDashboard({ user }: { user: CompanyUser }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [ratingTarget, setRatingTarget] = useState<(TaskApplication & { taskId: string; taskTitle: string }) | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [ratingSaving, setRatingSaving] = useState(false);

  const navigate = useNavigate();

  const reloadTasks = async () => {
    setLoading(true);
    const allTasks = await handleGetTasks();
    setTasks(allTasks.filter((task) => task.companyId === user.id));
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    void handleGetTasks()
      .then((allTasks) => {
        if (!isMounted) return;
        setTasks(allTasks.filter((task) => task.companyId === user.id));
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  const onDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await handleDeleteTask(taskId);
      reloadTasks();
    }
  };

  const handleUpdateAppStatus = async (
    taskId: string,
    appId: string,
    status: "accepted" | "rejected",
  ) => {
    await handleUpdateApplication(taskId, appId, { status });
    reloadTasks();
  };

  const openRatingModal = (applicant: TaskApplication & { taskId: string; taskTitle: string }) => {
    setRatingTarget(applicant);
    setRatingValue(applicant.companyRating || 5);
    setRatingFeedback(applicant.companyFeedback || "");
  };

  const closeRatingModal = () => {
    if (ratingSaving) return;
    setRatingTarget(null);
    setRatingValue(5);
    setRatingFeedback("");
  };

  const submitRating = async () => {
    if (!ratingTarget) return;

    try {
      setRatingSaving(true);
      await handleRateTaskApplicant(ratingTarget.taskId, ratingTarget.id, {
        rating: ratingValue,
        feedback: ratingFeedback.trim() || undefined,
      });
      await reloadTasks();
      closeRatingModal();
    } finally {
      setRatingSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="panel-surface rounded-[2rem] px-6 py-14 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-soft)] border-t-[var(--brand)]" />
        <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">Loading dashboard...</p>
      </div>
    );
  }

  const tasksWithDerivedFields: TaskWithDerivedFields[] = tasks.map((task) => {
    const deadlineDate = new Date(task.deadline);
    const now = new Date();
    const diffInDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      ...task,
      urgent: !Number.isNaN(deadlineDate.getTime()) && diffInDays <= 3 && diffInDays >= 0,
      daysLeftLabel: getDaysLeftLabel(task.deadline),
    };
  });

  const stagedTasks = tasksWithDerivedFields.filter(
    (task) => task.applicants.length === 0 && task.status !== "completed",
  );
  const activeTasks = tasksWithDerivedFields.filter(
    (task) => task.applicants.length > 0 && task.status !== "completed",
  );
  const totalTasks = tasks.length;
  const allApplicants = tasksWithDerivedFields.flatMap((task) =>
    task.applicants.map((applicant) => ({
      ...applicant,
      taskTitle: task.title,
      taskId: task.id,
    })),
  );
  const submittedWork = allApplicants.filter((applicant) => applicant.submissionUrl);
  const acceptedApplications = allApplicants.filter((applicant) => applicant.status === "accepted").length;
  const urgentTasks = tasksWithDerivedFields.filter((task) => task.urgent).length;
  const ratedStudents = allApplicants.filter((applicant) => applicant.companyRating).length;
  const companyDisplayName = user.companyName || `${user.firstname} ${user.lastname}`.trim();

  return (
    <div className="space-y-8 pb-6">
      <section className="panel-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.18),transparent_40%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              <Briefcase className="h-3.5 w-3.5 text-[var(--brand)]" />
              Company Workspace
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
              A cleaner command center for {companyDisplayName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Track your open work, review applicants faster, and keep new opportunities moving without digging
              through crowded cards.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/tasks/create")}
                className="btn-primary px-5 py-3 text-sm"
              >
                <Plus className="h-4 w-4" />
                Post a New Task
              </button>
              <button
                type="button"
                onClick={() => setActiveView("submissions")}
                className="btn-secondary px-5 py-3 text-sm"
              >
                <CheckSquare className="h-4 w-4" />
                View Submitted Tasks ({submittedWork.length})
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[38rem]">
            <SummaryStatCard
              eyebrow="Accepted"
              value={acceptedApplications}
              label="Applications approved"
              tone="rose"
            />
            <SummaryStatCard
              eyebrow="Urgent"
              value={urgentTasks}
              label="Deadlines within 3 days"
              tone="amber"
            />
            <SummaryStatCard
              eyebrow="Submissions"
              value={submittedWork.length}
              label="Ready for review"
              tone="sky"
            />
          </div>
        </div>
      </section>

      {activeView !== "overview" ? (
        <div className="flex justify-end">
          <button type="button" onClick={() => setActiveView("overview")} className="btn-secondary px-4 py-2.5 text-sm">
            Back to Overview
          </button>
        </div>
      ) : null}

      {activeView === "overview" ? (
        <>
          <section className="grid gap-5 md:grid-cols-2">
            <MetricCard
              title="Total Tasks Posted"
              value={totalTasks}
              hint="Review the full history of opportunities, edits, and lifecycle status in one place."
              icon={Briefcase}
              accentClass="bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]"
              onClick={() => setActiveView("all-tasks")}
            />
            <MetricCard
              title="Total Applicants Reached"
              value={allApplicants.length}
              hint="See every student who has engaged with your opportunities and jump straight to their profiles."
              icon={Users}
              accentClass="bg-gradient-to-r from-[var(--accent)] to-[var(--brand)]"
              onClick={() => setActiveView("all-apps")}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
            <div className="space-y-6">
              <div className="panel-surface overflow-hidden rounded-[2rem]">
                <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent-soft)_90%,transparent)]" />
                      <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Active Opportunities</h3>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Prioritize the tasks that already have student interest and keep reviews moving.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-bold text-[var(--accent)]">
                    {activeTasks.length} Active
                  </span>
                </div>

                <div className="space-y-4 bg-[color:color-mix(in_srgb,var(--surface-muted)_62%,white)] p-4 sm:p-6">
                  {activeTasks.length === 0 ? (
                    <EmptyPanel
                      title="No active applications yet"
                      description="Once students apply to your tasks, they’ll show up here with quick actions for review and status updates."
                      actionLabel="Create a New Task"
                      onAction={() => navigate("/tasks/create")}
                    />
                  ) : null}

                  {activeTasks.map((task) => {
                    const isExpanded = expandedTask === task.id;

                    return (
                      <article
                        key={task.id}
                        className="overflow-hidden rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                          className="flex w-full flex-col gap-5 p-5 text-left sm:p-6"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getTaskStatusTone(task)}`}
                                >
                                  {task.urgent ? "Urgent" : task.status.replace("_", " ")}
                                </span>
                                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                                  {task.projectType}
                                </span>
                                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                                  {task.category}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-xl font-black tracking-tight text-[var(--text-primary)]">{task.title}</h4>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                                  {task.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 self-start">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  navigate(`/tasks/${task.id}`);
                                }}
                                className="btn-secondary px-3 py-2 text-sm"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  navigate(`/tasks/${task.id}/edit`);
                                }}
                                className="btn-secondary px-3 py-2 text-sm"
                              >
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </button>
                              <span
                                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-muted)] ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              >
                                <ChevronDown className="h-5 w-5 text-[var(--text-secondary)]" />
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
                            <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Applicants</p>
                              <p className="mt-1 font-semibold text-[var(--text-primary)]">{task.applicants.length} students</p>
                            </div>
                            <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Deadline</p>
                              <p className="mt-1 font-semibold text-[var(--text-primary)]">{formatDate(task.deadline)}</p>
                            </div>
                            <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Timeline</p>
                              <p className="mt-1 font-semibold text-[var(--text-primary)]">{task.daysLeftLabel}</p>
                            </div>
                          </div>
                        </button>

                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <div className="overflow-hidden">
                            <div className="border-t border-[var(--border-soft)] bg-[color:color-mix(in_srgb,var(--surface-muted)_58%,white)] p-5 sm:p-6">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <h5 className="text-sm font-black uppercase tracking-[0.18em] text-[var(--text-primary)]">
                                    Review Applications
                                  </h5>
                                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                    Update statuses quickly without leaving the dashboard.
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {task.applicants.map((applicant) => (
                                  <div
                                    key={applicant.id}
                                    className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => navigate(`/profile/${applicant.studentId}`)}
                                      className="flex items-center gap-4 text-left"
                                    >
                                      <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.studentName)}&background=0f766e&color=ffffff`}
                                        className="h-11 w-11 rounded-full border border-[var(--border-soft)]"
                                        alt={applicant.studentName}
                                      />
                                      <div>
                                        <p className="font-bold text-[var(--text-primary)]">{applicant.studentName}</p>
                                        <p className="mt-1 text-sm text-[var(--text-secondary)]">{applicant.email}</p>
                                      </div>
                                    </button>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getApplicationTone(applicant.status)}`}
                                      >
                                        {applicant.status}
                                      </span>

                                      {applicant.status === "pending" ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateAppStatus(task.id, applicant.id, "accepted")}
                                            className="btn-primary px-3.5 py-2 text-xs"
                                          >
                                            <Check className="h-3.5 w-3.5" />
                                            Accept
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateAppStatus(task.id, applicant.id, "rejected")}
                                            className="btn-danger px-3.5 py-2 text-xs"
                                          >
                                            <X className="h-3.5 w-3.5" />
                                            Reject
                                          </button>
                                        </>
                                      ) : null}

                                      {applicant.portfolioUrl ? (
                                        <a
                                          href={applicant.portfolioUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn-secondary px-3.5 py-2 text-xs"
                                        >
                                          <ArrowRight className="h-3.5 w-3.5" />
                                          Portfolio
                                        </a>
                                      ) : null}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="panel-surface overflow-hidden rounded-[2rem]">
                <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-[var(--brand)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--brand-soft)_92%,transparent)]" />
                      <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Staged Tasks</h3>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Fresh opportunities waiting for the first applicant.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--brand-soft)] px-3 py-1.5 text-sm font-bold text-[var(--brand)]">
                    {stagedTasks.length} Pending
                  </span>
                </div>

                <div className="space-y-4 bg-[color:color-mix(in_srgb,var(--surface-muted)_62%,white)] p-4 sm:p-6">
                  {stagedTasks.length === 0 ? (
                    <EmptyPanel
                      title="No staged tasks right now"
                      description="Every open task already has applicants or has been completed. That is a healthy pipeline."
                    />
                  ) : null}

                  {stagedTasks.map((task) => (
                    <article
                      key={task.id}
                      className="flex flex-col gap-4 rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                            {task.category}
                          </span>
                          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                            {task.projectType}
                          </span>
                        </div>
                        <h4 className="mt-3 text-xl font-black tracking-tight text-[var(--text-primary)]">{task.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{task.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {task.daysLeftLabel}
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                            <Users className="h-3.5 w-3.5" />
                            {task.studentsNeeded} student slots
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                        <button type="button" onClick={() => navigate(`/tasks/${task.id}`)} className="btn-secondary px-3.5 py-2 text-sm">
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button type="button" onClick={() => navigate(`/tasks/${task.id}/edit`)} className="btn-secondary px-3.5 py-2 text-sm">
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button type="button" onClick={() => onDelete(task.id)} className="btn-danger px-3.5 py-2 text-sm">
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="panel-surface rounded-[2rem] p-6">
                <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Team Snapshot</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.5rem] bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Response Queue</p>
                    <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{allApplicants.filter((applicant) => applicant.status === "pending").length}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Pending student decisions across all tasks.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Live Opportunities</p>
                    <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{activeTasks.length + stagedTasks.length}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Open tasks currently visible to students.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[var(--surface-muted)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Rated Students</p>
                    <p className="mt-2 text-2xl font-black text-[var(--text-primary)]">{ratedStudents}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Completed submissions with company ratings.</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--brand-soft)_88%,white),color-mix(in_srgb,var(--accent-soft)_88%,white))] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Best Next Step</p>
                    <p className="mt-2 text-base font-bold text-[var(--text-primary)]">
                      {activeTasks.length > 0
                        ? "Review the open applicant queue and close urgent tasks first."
                        : "Post a new opportunity to restart your pipeline."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="panel-surface rounded-[2rem] p-6">
                <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Quick Actions</h3>
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/tasks/create")}
                    className="flex w-full items-center justify-between rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4 text-left hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Create another task</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Publish a new opportunity for students.</p>
                    </div>
                    <Plus className="h-5 w-5 text-[var(--brand)]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("all-apps")}
                    className="flex w-full items-center justify-between rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4 text-left hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Open applicant list</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Browse every student who has applied.</p>
                    </div>
                    <Users className="h-5 w-5 text-[var(--accent)]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("submissions")}
                    className="flex w-full items-center justify-between rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4 text-left hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Review completed work</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Check the latest student submissions.</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/top-rated-students")}
                    className="flex w-full items-center justify-between rounded-[1.35rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4 text-left hover:bg-[var(--surface-muted)]"
                  >
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">Open top-rated students</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">See the live student leaderboard.</p>
                    </div>
                    <Medal className="h-5 w-5 text-amber-500" />
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </>
      ) : null}

      {activeView === "all-tasks" ? (
        <DataTable title="All Tasks History" description="A full record of opportunities created by your company.">
          <table className="min-w-full text-left">
            <thead className="bg-[color:color-mix(in_srgb,var(--surface-muted)_86%,white)]">
              <tr className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Created</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {tasksWithDerivedFields.map((task) => (
                <tr key={task.id} className="hover:bg-[color:color-mix(in_srgb,var(--surface-muted)_45%,white)]">
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{task.category}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(task.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getTaskStatusTone(task)}`}>
                      {task.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => navigate(`/tasks/${task.id}`)} className="btn-secondary px-3 py-2 text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-[var(--text-secondary)]">
                    No tasks posted yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTable>
      ) : null}

      {activeView === "all-apps" ? (
        <DataTable title="Total Applications Received" description="Review student interest across all company opportunities.">
          <table className="min-w-full text-left">
            <thead className="bg-[color:color-mix(in_srgb,var(--surface-muted)_86%,white)]">
              <tr className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <th className="px-6 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Applied Task</th>
                <th className="px-6 py-4 font-bold">Applied On</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {allApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-[color:color-mix(in_srgb,var(--surface-muted)_45%,white)]">
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{applicant.studentName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{applicant.taskTitle}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(applicant.appliedAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getApplicationTone(applicant.status)}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button type="button" onClick={() => navigate(`/profile/${applicant.studentId}`)} className="btn-secondary px-3 py-2 text-sm">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {allApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-medium text-[var(--text-secondary)]">
                    No applications received yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTable>
      ) : null}

      {activeView === "submissions" ? (
        <DataTable
          title="Completed Task Submissions"
          description="Student work that has been submitted and is ready for your review."
        >
          <table className="min-w-full text-left">
            <thead className="bg-[color:color-mix(in_srgb,var(--surface-muted)_86%,white)]">
              <tr className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <th className="px-6 py-4 font-bold">Student</th>
                <th className="px-6 py-4 font-bold">Task</th>
                <th className="px-6 py-4 font-bold">Submitted</th>
                <th className="px-6 py-4 font-bold">Rating</th>
                <th className="px-6 py-4 font-bold">Work Link</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-soft)]">
              {submittedWork.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-[color:color-mix(in_srgb,var(--surface-muted)_45%,white)]">
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/${applicant.studentId}`)}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(applicant.studentName)}&background=0f766e&color=ffffff`}
                        className="h-8 w-8 rounded-full border border-[var(--border-soft)]"
                        alt={applicant.studentName}
                      />
                      <span className="font-semibold text-[var(--text-primary)]">{applicant.studentName}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">{applicant.taskTitle}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatDate(applicant.submittedAt)}</td>
                  <td className="px-6 py-4">
                    {applicant.companyRating ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {applicant.companyRating}/5
                      </span>
                    ) : (
                      <span className="text-sm text-[var(--text-secondary)]">Not rated yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {applicant.submissionUrl ? (
                      <a
                        href={applicant.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--accent)] underline underline-offset-4"
                      >
                        View Work
                      </a>
                    ) : (
                      <span className="text-sm text-[var(--text-secondary)]">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openRatingModal(applicant)}
                      className={applicant.companyRating ? "btn-secondary px-3 py-2 text-sm" : "btn-primary px-3 py-2 text-sm"}
                    >
                      {applicant.companyRating ? "Update Rating" : "Rate Student"}
                    </button>
                  </td>
                </tr>
              ))}
              {submittedWork.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm font-medium text-[var(--text-secondary)]">
                    No submitted works yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </DataTable>
      ) : null}

      {ratingTarget ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="panel-surface w-full max-w-lg rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Student Rating</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Rate {ratingTarget.studentName}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  This rating is used in the real Top Rating Students leaderboard and should reflect completed work quality for <strong>{ratingTarget.taskTitle}</strong>.
                </p>
              </div>
              <button type="button" onClick={closeRatingModal} className="btn-secondary h-10 w-10 rounded-2xl p-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[var(--text-primary)]">Score</p>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRatingValue(value)}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-black ${
                      ratingValue === value
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-[var(--border-soft)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-[var(--text-primary)]">Feedback</label>
              <textarea
                value={ratingFeedback}
                onChange={(event) => setRatingFeedback(event.target.value)}
                rows={4}
                placeholder="Share short, useful feedback about the student's delivery quality, communication, and final result."
                className="field-shell mt-3 resize-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeRatingModal} className="btn-secondary px-4 py-3 text-sm">
                Cancel
              </button>
              <button type="button" onClick={submitRating} disabled={ratingSaving} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
                {ratingSaving ? "Saving..." : "Save Rating"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
