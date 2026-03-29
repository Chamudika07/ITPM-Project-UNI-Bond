import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { handleCreateKuppySession } from "@/controllers/kuppyController";
import SectionCard from "@/components/common/SectionCard";
import { GraduationCap, AlertCircle } from "lucide-react";
import { validateKuppyForm } from "@/utils/validators";

export default function CreateKuppy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; description?: string; datetime?: string }>({});

  if (!user) {
    return (
       <SectionCard title="Access Denied"><p>Please log in.</p></SectionCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateKuppyForm(title, description, datetime);
    setFieldErrors(validation.errors);
    if (!validation.isValid) {
      setError(validation.error ?? "Please correct the highlighted fields.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await handleCreateKuppySession(user.id, `${user.firstname} ${user.lastname}`, title, description, new Date(datetime).toISOString());
      navigate("/kuppy");
    } catch (err: any) {
      setError(err.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard title="Create Kuppy Session">
      <form onSubmit={handleSubmit} className="panel-surface space-y-4 max-w-lg mx-auto p-5 rounded-[1.75rem]">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-soft)] pb-4">
          <div className="p-3 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Host a Kuppy</h2>
            <p className="text-sm text-[var(--text-secondary)]">Schedule a focused peer-learning session with clear timing and purpose.</p>
          </div>
        </div>

        {error && <div className="status-error"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}</div>}

        <div>
           <label className="field-label mb-1">Topic *</label>
           <input className={`field-shell ${fieldErrors.title ? "field-shell-error" : ""}`} value={title} onChange={(e) => {
            setTitle(e.target.value);
            setFieldErrors((current) => ({ ...current, title: undefined }));
            setError("");
           }} placeholder="e.g. Calculus II Revision" required />
           {fieldErrors.title ? <p className="field-error mt-1">{fieldErrors.title}</p> : null}
        </div>
        
        <div>
          <label className="field-label mb-1">Description *</label>
          <textarea 
            className={`field-shell ${fieldErrors.description ? "field-shell-error" : ""}`}
            rows={3} value={description} onChange={(e) => {
              setDescription(e.target.value);
              setFieldErrors((current) => ({ ...current, description: undefined }));
              setError("");
            }} placeholder="What will be covered?" required
          />
          {fieldErrors.description ? <p className="field-error mt-1">{fieldErrors.description}</p> : <p className="field-hint mt-1">Mention the lesson outcome so students know what to expect.</p>}
        </div>

        <div>
             <label className="field-label mb-1">Date & Time *</label>
             <input type="datetime-local" className={`field-shell ${fieldErrors.datetime ? "field-shell-error" : ""}`} value={datetime} onChange={(e) => {
              setDatetime(e.target.value);
              setFieldErrors((current) => ({ ...current, datetime: undefined }));
              setError("");
             }} required />
             {fieldErrors.datetime ? <p className="field-error mt-1">{fieldErrors.datetime}</p> : null}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary px-4 py-2">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary px-5 py-2 disabled:opacity-50">
            {loading ? "Scheduling..." : "Schedule Session"}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}
