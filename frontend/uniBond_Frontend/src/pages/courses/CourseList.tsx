import { useState } from "react";
import {
  BookOpen,
  Search,
  Plus,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle2,
  Users,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuthHook";
import { useCourseContext } from "@/contexts/CourseContext";

export default function CourseList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courses, deleteCourse, getRegistrationStatus } = useCourseContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'registered'>('all');
  const [toastMessage, setToastMessage] = useState("");
  
  const isLecturer = user?.role === "lecturer" || user?.role === "admin";
  const studentId = user?.id?.toString() || "mock-student-id";

  const displayedCourses = courses.filter(c => {
    if (isLecturer) return true;
    if (activeTab === 'registered') return getRegistrationStatus(c.id, studentId) !== undefined;
    return true;
  });

  const filteredCourses = displayedCourses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourse(id);
      showToast("Course deleted successfully.");
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`${ROUTES.COURSES}/edit/${id}`);
  };

  return (
    <div className="space-y-8 pb-12 antialiased">
      {toastMessage && (
        <div className="fixed top-24 right-8 bg-black/90 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 z-50 animate-in fade-in slide-in-from-top-10 duration-500 border border-white/10">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 shadow-2xl lg:p-10">
        <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.95fr] xl:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
              <GraduationCap className="h-4 w-4" />
              Learning Academy
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white lg:text-5xl">
              Build practical knowledge with beautifully structured courses.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200/85 lg:text-base">
              Explore lecturer-led content, browse your registered learning
              path, and discover new course material designed for deeper,
              career-ready understanding.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">{courses.length}</p>
                <p className="mt-1 text-sm text-slate-200">Available courses</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {courses.filter((course) => getRegistrationStatus(course.id, studentId)).length}
                </p>
                <p className="mt-1 text-sm text-slate-200">Your registrations</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {courses.filter((course) => course.price === 0).length}
                </p>
                <p className="mt-1 text-sm text-slate-200">Free entries</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-inner backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Find your next course</h2>
                <p className="mt-1 text-sm text-slate-200">
                  Search the catalog, review your learning path, or publish a
                  new course if you are a lecturer.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  placeholder="Search courses or instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 py-4 pl-12 pr-4 text-sm font-medium text-white placeholder:text-slate-400 focus:border-cyan-300 focus:outline-none"
                />
              </div>

              {isLecturer ? (
                <Link
                  to={ROUTES.CREATE_COURSE}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-lg transition hover:brightness-110"
                >
                  <Plus className="h-5 w-5" />
                  Add Course
                </Link>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-900/45 px-4 py-4 text-sm text-slate-200">
                  Keep building your learning path by opening a course and
                  reviewing its full content and registration details.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
        {!isLecturer && (
          <div className="flex w-full rounded-2xl border border-slate-200 bg-slate-100 p-1.5 md:w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-xl px-8 py-3 text-sm font-bold transition-all duration-300 md:flex-none ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All Courses
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`flex-1 rounded-xl px-8 py-3 text-sm font-bold transition-all duration-300 md:flex-none ${activeTab === 'registered' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              My Path
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-900">{filteredCourses.length} Courses</span>
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => {
            const isRegistered = !isLecturer && getRegistrationStatus(course.id, studentId);

            return (
              <article
                key={course.id}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)]"
              >
                {isLecturer && (
                  <div className="absolute right-4 top-4 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button 
                      onClick={(e) => handleEdit(course.id, e)}
                      className="rounded-xl bg-white p-2.5 text-blue-600 shadow-xl transition-all hover:scale-105 hover:bg-blue-600 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(course.id, e)}
                      className="rounded-xl bg-white p-2.5 text-rose-500 shadow-xl transition-all hover:scale-105 hover:bg-rose-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_40%)]" />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-100">
                        Course
                      </span>
                      {isRegistered ? (
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100">
                          Registered
                        </span>
                      ) : null}
                    </div>
                    <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-cyan-200">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-lg font-black text-emerald-600">
                      <DollarSign className="h-5 w-5" />
                      {course.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold uppercase text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {course.dateAdded}
                    </div>
                  </div>

                  <p className="mb-8 flex-1 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {course.description}
                  </p>

                  <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors duration-300 group-hover:bg-cyan-50">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructorName)}&background=2563eb&color=ffffff`}
                      className="h-10 w-10 rounded-xl shadow-md"
                      alt="Lecturer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Instructor
                      </p>
                      <p className="truncate text-sm font-bold text-slate-900">
                        {course.instructorName}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`${ROUTES.COURSES}/${course.id}`}
                      className="group/btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-950 py-4 font-bold text-white shadow-xl transition-all duration-300 active:scale-[0.97]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Explore Content
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[3rem] border-2 border-dashed border-slate-200 bg-white p-20 text-center shadow-sm">
          <BookOpen className="mx-auto mb-6 h-16 w-16 text-slate-200" />
          <h3 className="mb-2 text-2xl font-black text-slate-900">No Courses Found</h3>
          <p className="font-medium leading-relaxed text-slate-500">
            Try a different search term or check back soon for newly published
            courses.
          </p>
        </div>
      )}

    </div>
  );
}
