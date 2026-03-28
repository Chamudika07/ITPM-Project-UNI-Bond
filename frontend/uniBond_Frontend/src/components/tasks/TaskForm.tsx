import React, { useState, useEffect } from "react";
import { Briefcase, Plus, X } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  projectType: "Group" | "Individual";
  skills: string[];
  technologies: string[];
  experienceLevel: string;
  studentsNeeded: number;
  duration: string;
  startDate: string;
  deadline: string;
  stipend: string;
  certificate: boolean;
  internshipOpportunity: boolean;
  tags: string[];
  contactEmail: string;
  status?: "open" | "in_progress" | "completed";
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

const COMMON_SKILLS = [
  "React", "Angular", "Vue", "Node.js", "Python", "Java", "C++", "C#", "Go", "Rust",
  "TailwindCSS", "SQL", "MongoDB", "AWS", "Docker", "Machine Learning", "Figma",
  "UI/UX Design", "Cyber Security", "Data Analysis", "Project Management"
];

const STIPEND_CATEGORIES = [
  "Unpaid",
  "Rs. 10,000 - 25,000",
  "Rs. 25,000 - 50,000",
  "Rs. 50,000 - 100,000",
  "Rs. 100,000+"
];

export default function TaskForm({ initialData, onSubmit, onCancel, loading, isEdit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Artificial intelligence",
    projectType: initialData?.projectType || "Group",
    skills: initialData?.skills || [],
    technologies: initialData?.technologies || [],
    experienceLevel: initialData?.experienceLevel || "Intermediate",
    studentsNeeded: initialData?.studentsNeeded || 1,
    duration: initialData?.duration || "1 Month",
    startDate: initialData?.startDate || "",
    deadline: initialData?.deadline || "",
    stipend: initialData?.stipend || "Unpaid",
    certificate: initialData?.certificate ?? true,
    internshipOpportunity: initialData?.internshipOpportunity ?? true,
    tags: initialData?.tags || [],
    contactEmail: initialData?.contactEmail || "",
    status: initialData?.status || "open"
  });

  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const categories = ["Information technology", "Artificial intelligence", "Data Science", "software Engineering", "Cyber Security"];
  const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
  const durations = ["1 Month", "3 Months", "6 Months", "1 Year"];

  // Auto-generate deadline based on startDate and duration
  useEffect(() => {
    if (formData.startDate && formData.duration) {
      const start = new Date(formData.startDate);
      let monthsToAdd = 1;
      if (formData.duration === "3 Months") monthsToAdd = 3;
      else if (formData.duration === "6 Months") monthsToAdd = 6;
      else if (formData.duration === "1 Year") monthsToAdd = 12;

      start.setMonth(start.getMonth() + monthsToAdd);

      setFormData(prev => ({ ...prev, deadline: start.toISOString() }));
    }
  }, [formData.startDate, formData.duration]);

  // Handle Project Type logic for studentsNeeded
  useEffect(() => {
    if (formData.projectType === "Individual") {
      setFormData(prev => ({ ...prev, studentsNeeded: 1 }));
    }
  }, [formData.projectType]);

  const handleAddSkill = () => {
    if (selectedSkill && !formData.skills.includes(selectedSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, selectedSkill] });
      setSelectedSkill("");
    }
  };

  const handleAddArrayItem = (field: "technologies" | "tags", value: string, setValue: (val: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
      setValue("");
    }
  };

  const handleRemoveArrayItem = (field: "skills" | "technologies" | "tags", index: number) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.title || !formData.description || !formData.startDate || !formData.deadline || !formData.contactEmail) {
      setError("Please fill in all required basic fields, including Contact Email.");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <SectionCard title={isEdit ? "Edit Task" : "Add New Task"}>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-8 bg-white/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/60">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-indigo-50/50">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{isEdit ? "Edit Opportunity" : "Launch an Opportunity"}</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">{isEdit ? "Update your task details and requirements." : "Publish a new task to attract top student talent."}</p>
            </div>
          </div>

          {error && <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm font-medium border border-rose-100/50 flex items-center gap-2 animate-in shrink-0"><X className="w-5 h-5"/>{error}</div>}

        {/* Basic Information */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-blue-500 pl-2"> Basic Information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. AI Chatbot Development" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Build an AI chatbot for customer support..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
            <input type="email" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="hr@company.com" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.projectType} onChange={(e) => setFormData({ ...formData, projectType: e.target.value as "Group" | "Individual" })}>
                 <option value="Group">Group</option>
                 <option value="Individual">Individual</option>
              </select>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-purple-500 pl-2"> Requirements</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required</label>
              <div className="flex gap-2 mb-2">
                <select className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
                  <option value="">-- Select Skill --</option>
                  {COMMON_SKILLS.filter(s => !formData.skills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={handleAddSkill} disabled={!selectedSkill} className="px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition disabled:opacity-50"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 text-sm rounded-full flex items-center gap-1 border border-blue-200">
                    {s} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem("skills", i)} />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other Technologies</label>
              <div className="flex gap-2 mb-2">
                <input className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem("technologies", techInput, setTechInput))} placeholder="e.g. TensorFlow, FastAPI" />
                <button type="button" onClick={() => handleAddArrayItem("technologies", techInput, setTechInput)} className="px-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"><Plus className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-50 text-purple-800 text-sm rounded-full flex items-center gap-1 border border-purple-200">
                    {t} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem("technologies", i)} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
            <select className="w-full md:w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
              {experienceLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </section>

        {/* Task Details */}
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-orange-500 pl-2"> Task Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.projectType === "Group" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Students Needed</label>
                <input type="number" min="2" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.studentsNeeded} onChange={(e) => setFormData({ ...formData, studentsNeeded: parseInt(e.target.value) || 2 })} required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                {durations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.startDate ? formData.startDate.split('T')[0] : ""} onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Auto-Generated)</label>
              <input type="date" className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" value={formData.deadline ? formData.deadline.split('T')[0] : ""} readOnly title="Calculated automatically based on Start Date and Duration" />
            </div>
          </div>
        </section>

        {/* Rewards & Benefits */}
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-green-500 pl-2"> Rewards & Benefits</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Tier</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all rounded-xl" value={formData.stipend} onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}>
                {STIPEND_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate</label>
              <div className="flex gap-4 items-center h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cert" checked={formData.certificate === true} onChange={() => setFormData({ ...formData, certificate: true })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" /> Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cert" checked={formData.certificate === false} onChange={() => setFormData({ ...formData, certificate: false })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" /> No
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internship Opportunity</label>
              <div className="flex gap-4 items-center h-10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="intern" checked={formData.internshipOpportunity === true} onChange={() => setFormData({ ...formData, internshipOpportunity: true })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" /> Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="intern" checked={formData.internshipOpportunity === false} onChange={() => setFormData({ ...formData, internshipOpportunity: false })} className="text-blue-600 focus:ring-blue-500 h-4 w-4" /> No
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 border-l-4 border-yellow-400 pl-2"> Tags</h3>

          <div>
            <div className="flex gap-2 mb-2">
              <input className="md:w-1/2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem("tags", tagInput, setTagInput))} placeholder="e.g. AI, Chatbot, Web" />
              <button type="button" onClick={() => handleAddArrayItem("tags", tagInput, setTagInput)} className="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-md flex items-center gap-1 border border-gray-200">
                  {t} <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleRemoveArrayItem("tags", i)} />
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="pt-8 mt-8 border-t border-indigo-50/50 flex flex-col sm:flex-row justify-end gap-4">
          <button type="button" onClick={onCancel} className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
            {loading ? "Saving..." : (isEdit ? "Update Opportunity" : "Launch Opportunity")}
          </button>
        </div>
      </form>
      </SectionCard>
    </div>
  );
}
