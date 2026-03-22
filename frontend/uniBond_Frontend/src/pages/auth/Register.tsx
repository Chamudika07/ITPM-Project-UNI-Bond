import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleRegister } from "@/controllers/authController";
import { uploadCV } from "@/models/authModel";
import type { Role, User } from "@/types/user";
import { ROUTES } from "@/utils/constants";
import {
  User as UserIcon, Mail, Lock, Phone, MapPin, Building2,
  GraduationCap, Briefcase, ChevronDown, Upload, CheckCircle2, AlertCircle,
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
const ROLE_OPTIONS: { value: Role; label: string; emoji: string }[] = [
  { value: "student",   label: "Student",   emoji: "🎓" },
  { value: "lecturer",  label: "Lecturer",  emoji: "📚" },
  { value: "company",   label: "Company",   emoji: "🏢" },
  { value: "tech_lead", label: "Tech Lead", emoji: "💻" },
  { value: "admin",     label: "Admin",     emoji: "🛡️" },
];

const EDUCATION_OPTIONS = [
  { value: "",               label: "Select Education Level" },
  { value: "Diploma",        label: "Diploma" },
  { value: "Higher Diploma", label: "Higher Diploma" },
  { value: "Bachelor",       label: "Bachelor" },
  { value: "Master",         label: "Master" },
];

// ── sub-components ────────────────────────────────────────────────────────────
function Field({
  label, icon, children, hint,
}: { label: string; icon: React.ReactNode; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400 pointer-events-none">{icon}</span>
        {children}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1 ml-1">{hint}</p>}
    </div>
  );
}

function InputField({
  name, type = "text", placeholder, value, onChange, required,
}: {
  name: string; type?: string; placeholder: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-gray-400"
    />
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Record<string, string>>({ role: "student" });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [error, setError] = useState("");
  const [pendingMsg, setPendingMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const role = form.role as Role;
  const selectedRole = ROLE_OPTIONS.find(r => r.value === role)!;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError("");
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateMobile = (m: string) => /^0\d{9}$/.test(m.trim());

  const validateForm = (): boolean => {
    const required = ["firstname", "lastname", "email", "password", "city", "country", "mobile"];
    for (const f of required) {
      if (!form[f]?.trim()) {
        setError(`"${f.charAt(0).toUpperCase() + f.slice(1)}" is required.`);
        return false;
      }
    }
    if (!validateMobile(form.mobile)) {
      setError("Mobile must be 10 digits and start with 0 (e.g. 0775078338).");
      return false;
    }
    if ((role === "student" || role === "lecturer") && !form.school?.trim()) {
      setError("School / University is required for students and lecturers.");
      return false;
    }
    if ((role === "student" || role === "lecturer") && !form.education?.trim()) {
      setError("Education level is required.");
      return false;
    }
    if (role === "company" && (!form.companyName?.trim() || !form.industry?.trim() || !form.companySize?.trim())) {
      setError("Company Name, Industry, and Company Size are required.");
      return false;
    }
    if (role === "tech_lead" && (!form.industryExpertise?.trim() || !form.yearsOfExperience?.trim())) {
      setError("Industry Expertise and Years of Experience are required.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setError("");
    setPendingMsg("");
    if (!validateForm()) return;

    const userData = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
      role,
      city: form.city,
      country: form.country,
      mobile: form.mobile,
      school: form.school ?? undefined,
      education: form.education as StudentUser["education"],
      companyName: form.companyName,
      industry: form.industry,
      companySize: form.companySize,
      industryExpertise: form.industryExpertise,
      yearsOfExperience: form.yearsOfExperience,
    };

    const res = await handleRegister(userData as unknown as User, setLoading, setError);
    if (res) {
      // Upload CV if provided
      if (cvFile && res.user?.id) {
        try { await uploadCV(String(res.user.id), cvFile); } catch { /* non-fatal */ }
      }

      if (role === "student") {
        navigate(ROUTES.LOGIN);
      } else {
        setPendingMsg(
          `Your account has been created (${res.user?.user_code ?? ""}) and is pending admin approval. ` +
          `You'll receive access once an admin reviews your registration.`
        );
        setForm({ role });
        setCvFile(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 sm:p-10">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Join UniBond – fill in your details below</p>
        </div>

        {/* Pending success message */}
        {pendingMsg && (
          <div className="flex gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 mb-6 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{pendingMsg}</p>
          </div>
        )}

        <div className="space-y-4">

          {/* Role Selector */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a…</label>
            <button
              type="button"
              onClick={() => setRoleOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span>{selectedRole.emoji} {selectedRole.label}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${roleOpen ? "rotate-180" : ""}`} />
            </button>
            {roleOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                {ROLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, role: opt.value }));
                      setRoleOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-blue-50 hover:text-blue-700 ${opt.value === role ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"}`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First Name" icon={<UserIcon className="w-4 h-4" />}>
              <InputField name="firstname" placeholder="First Name" value={form.firstname ?? ""} onChange={handleChange} required />
            </Field>
            <Field label="Last Name" icon={<UserIcon className="w-4 h-4" />}>
              <InputField name="lastname" placeholder="Last Name" value={form.lastname ?? ""} onChange={handleChange} required />
            </Field>
          </div>

          {/* Email & Password */}
          <Field label="Email Address" icon={<Mail className="w-4 h-4" />}>
            <InputField name="email" type="email" placeholder="you@example.com" value={form.email ?? ""} onChange={handleChange} required />
          </Field>

          <Field label="Password" icon={<Lock className="w-4 h-4" />}>
            <InputField name="password" type="password" placeholder="••••••••" value={form.password ?? ""} onChange={handleChange} required />
          </Field>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" icon={<MapPin className="w-4 h-4" />}>
              <InputField name="city" placeholder="Colombo" value={form.city ?? ""} onChange={handleChange} required />
            </Field>
            <Field label="Country" icon={<MapPin className="w-4 h-4" />}>
              <InputField name="country" placeholder="Sri Lanka" value={form.country ?? ""} onChange={handleChange} required />
            </Field>
          </div>

          {/* Mobile */}
          <Field label="Mobile Number" icon={<Phone className="w-4 h-4" />} hint="Format: 0775078338 (10 digits, starts with 0)">
            <InputField name="mobile" type="tel" placeholder="0775078338" value={form.mobile ?? ""} onChange={handleChange} required />
          </Field>

          {/* Student / Lecturer fields */}
          {(role === "student" || role === "lecturer") && (
            <>
              <Field label="School / University" icon={<GraduationCap className="w-4 h-4" />}>
                <InputField name="school" placeholder="e.g. University of Colombo" value={form.school ?? ""} onChange={handleChange} required />
              </Field>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Education Level</label>
                <select
                  name="education"
                  value={form.education ?? ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
                >
                  {EDUCATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Company fields */}
          {role === "company" && (
            <>
              <Field label="Company Name" icon={<Building2 className="w-4 h-4" />}>
                <InputField name="companyName" placeholder="Sysco LABS" value={form.companyName ?? ""} onChange={handleChange} required />
              </Field>
              <Field label="Industry" icon={<Briefcase className="w-4 h-4" />}>
                <InputField name="industry" placeholder="Software Engineering" value={form.industry ?? ""} onChange={handleChange} required />
              </Field>
              <Field label="Company Size" icon={<UserIcon className="w-4 h-4" />}>
                <InputField name="companySize" placeholder="e.g. 1-50, 50-200, 200+" value={form.companySize ?? ""} onChange={handleChange} required />
              </Field>
            </>
          )}

          {/* Tech Lead fields */}
          {role === "tech_lead" && (
            <>
              <Field label="Industry Expertise" icon={<Briefcase className="w-4 h-4" />}>
                <InputField name="industryExpertise" placeholder="e.g. Cloud, ML, DevOps" value={form.industryExpertise ?? ""} onChange={handleChange} required />
              </Field>
              <Field label="Years of Experience" icon={<UserIcon className="w-4 h-4" />}>
                <InputField name="yearsOfExperience" type="number" placeholder="5" value={form.yearsOfExperience ?? ""} onChange={handleChange} required />
              </Field>
            </>
          )}

          {/* CV Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Upload CV <span className="text-gray-400 font-normal">(optional – PDF or Word)</span>
            </label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition text-sm text-gray-500 hover:text-blue-600"
            >
              <Upload className="w-4 h-4" />
              {cvFile ? cvFile.name : "Click to select CV file"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={e => setCvFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Local type alias for the cast (avoids import loop inside the file)
type StudentUser = { education: "Diploma" | "Higher Diploma" | "Bachelor" | "Master" };