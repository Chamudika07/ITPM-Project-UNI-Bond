import { useState } from "react";
import { ArrowLeft, Calendar, Clock, Users, Video, UserMinus } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import SectionCard from "@/components/common/SectionCard";
import { useAuth } from "@/hooks/useAuthHook";
import { useProfessionalCommunication } from "@/contexts/ProfessionalCommunicationContext";
import { ROUTES } from "@/utils/constants";

export default function RegisteredProfessionalSessions() {
  const { user } = useAuth();
  const { registeredSessions, getAvailableSeats, unregisterStudent } =
    useProfessionalCommunication();
  const [sessionMessage, setSessionMessage] = useState("");
  const [leavingSessionId, setLeavingSessionId] = useState<string | null>(null);

  const showMessage = (message: string) => {
    setSessionMessage(message);
    window.setTimeout(() => setSessionMessage(""), 3000);
  };

  const handleLeaveSession = async (sessionId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to leave this session?",
    );

    if (!confirmed) {
      return;
    }

    setLeavingSessionId(sessionId);
    const result = await unregisterStudent(sessionId);
    setLeavingSessionId(null);
    showMessage(result.message);
  };

  if (user?.role !== "student") {
    return <Navigate to={ROUTES.PROFESSIONAL_COMMUNICATION} replace />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200/80">
              Registered Sessions
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Your confirmed professional sessions
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              This page shows the sessions you already registered for. You can
              open the Zoom link directly from here when you are ready to join.
            </p>
          </div>

          <Link
            to={ROUTES.PROFESSIONAL_COMMUNICATION}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Live Sessions
          </Link>
        </div>
      </div>

      {sessionMessage && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {sessionMessage}
        </div>
      )}

      <SectionCard title={`Registered Sessions (${registeredSessions.length})`}>
        {registeredSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              You have not registered for a session yet.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Explore the live sessions list and register for a session to see
              it here.
            </p>
            <Link
              to={ROUTES.PROFESSIONAL_COMMUNICATION}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Live Sessions
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {registeredSessions.map((session) => (
              <article
                key={session.id}
                className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {session.title}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Registered
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {session.description}
                </p>

                <div className="mt-4 grid gap-2 text-sm text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    Seats: {getAvailableSeats(session.id)} available /{" "}
                    {session.seatCount} total
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {session.date}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    {session.time}
                  </p>
                </div>

                {session.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {session.tags.map((tag) => (
                      <span
                        key={`${session.id}-${tag}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-sm font-medium text-emerald-700">
                    You are registered for this session.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href={session.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-800"
                    >
                      <Video className="h-4 w-4" />
                      Join Zoom Session
                    </a>
                    <button
                      type="button"
                      onClick={() => void handleLeaveSession(session.id)}
                      disabled={leavingSessionId === session.id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <UserMinus className="h-4 w-4" />
                      {leavingSessionId === session.id ? "Leaving..." : "Leave"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
