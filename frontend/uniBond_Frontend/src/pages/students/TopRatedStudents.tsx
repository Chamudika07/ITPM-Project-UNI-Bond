import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ChevronRight, MapPin, Medal, School, Star } from "lucide-react";

import { handleGetTopRatedStudents } from "@/controllers/userController";
import type { TopRatedStudent } from "@/types/user";

const rankStyles = [
  "from-amber-300 via-yellow-200 to-amber-100 text-amber-950 border-amber-200",
  "from-slate-300 via-slate-200 to-slate-50 text-slate-800 border-slate-200",
  "from-orange-300 via-amber-200 to-orange-100 text-orange-900 border-orange-200",
];

const formatRating = (value: number) => value.toFixed(1);

export default function TopRatedStudents() {
  const [students, setStudents] = useState<TopRatedStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    void handleGetTopRatedStudents(20)
      .then((data) => {
        if (!isMounted) return;
        setStudents(data);
      })
      .catch((err) => {
        console.error("Failed to load top-rated students", err);
        if (!isMounted) return;
        setError("Top-rated students could not be loaded right now.");
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const podiumStudents = students.slice(0, 3);
  return (
    <div className="space-y-6 pb-6">
      <section className="panel-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_38%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Student Leaderboard
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-4xl">
              Top rating students based on real company task reviews
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              This ranking is generated from real completed tasks and company feedback, so it reflects actual delivery quality instead of demo data.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:w-[32rem]">
            <div className="rounded-[1.5rem] border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Students Ranked</p>
              <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">{students.length}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Rated by companies</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Top Score</p>
              <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">
                {students[0] ? formatRating(students[0].averageRating) : "0.0"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Highest average rating</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/80 p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Reviewed Work</p>
              <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">
                {students.reduce((sum, student) => sum + student.completedTaskCount, 0)}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Completed rated tasks</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="panel-surface h-72 animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="status-error">{error}</div>
      ) : null}

      {!loading && !error && podiumStudents.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-3">
          {podiumStudents.map((student, index) => (
            <Link
              key={student.id}
              to={student.profilePath}
              className="panel-surface group relative overflow-hidden rounded-[2rem] p-6 hover:-translate-y-1 hover:[box-shadow:var(--shadow-strong)]"
            >
              <div className={`inline-flex rounded-full border bg-gradient-to-br px-4 py-2 text-xs font-black uppercase tracking-[0.22em] ${rankStyles[index] || rankStyles[2]}`}>
                #{index + 1} Ranked
              </div>
              <div className="mt-6 flex items-center gap-4">
                <img src={student.avatar} alt={student.fullName} className="h-16 w-16 rounded-2xl border border-[var(--border-soft)] object-cover" />
                <div>
                  <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">{student.fullName}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{student.school || "Student profile"}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Average</p>
                  <p className="mt-2 flex items-center gap-2 text-3xl font-black text-[var(--text-primary)]">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    {formatRating(student.averageRating)}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--surface-muted)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Reviews</p>
                  <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">{student.reviewCount}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {student.location || "Location not shared"}
                </span>
                <ChevronRight className="h-4 w-4 text-[var(--accent)] transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>
      ) : null}

      {!loading && !error ? (
        <section className="panel-surface overflow-hidden rounded-[2rem]">
          <div className="border-b border-[var(--border-soft)] px-6 py-5 sm:px-7">
            <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Leaderboard</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Students are ordered by average company rating, then number of reviews.</p>
          </div>

          {students.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]">
                <Medal className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-[var(--text-primary)]">No rated students yet</h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
                Once companies rate completed task submissions, the top students will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {students.map((student, index) => (
                <Link
                  key={student.id}
                  to={student.profilePath}
                  className="flex flex-col gap-4 px-6 py-5 hover:bg-[color:color-mix(in_srgb,var(--surface-muted)_42%,white)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-base font-black text-[var(--text-primary)]">
                      #{index + 1}
                    </div>
                    <img src={student.avatar} alt={student.fullName} className="h-12 w-12 rounded-2xl border border-[var(--border-soft)] object-cover" />
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{student.fullName}</p>
                      <div className="mt-1 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1.5">
                          <School className="h-4 w-4" />
                          {student.school || "School not shared"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {student.location || "Location not shared"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:min-w-[18rem]">
                    <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Rating</p>
                      <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{formatRating(student.averageRating)}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Reviews</p>
                      <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{student.reviewCount}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--surface-muted)] px-4 py-3 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Tasks</p>
                      <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{student.completedTaskCount}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
