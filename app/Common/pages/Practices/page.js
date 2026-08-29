"use client";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../Context/AuthContext";
import PageHero from "@/app/Components/Reusable/PageHero";

const PRACTICE_CATEGORIES = ["JavaScript", "React", "Node.js", "DSA", "CSS", "HTML", "Database", "General"];
const QUESTION_TYPES = [
  { value: "practical", label: "Practical", icon: "🛠️" },
  { value: "theory", label: "Theory", icon: "📖" },
];

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};
const fmtShort = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

// youtube helpers
const isYoutube = (url) => {
  if (!url) return false;
  return /(youtube\.com|youtu\.be|youtube-nocookie)/i.test(url);
};
const toEmbedUrl = (url) => {
  if (!url) return null;
  try {
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split(/[?&#]/)[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/watch")) {
      const u = new URL(url);
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes("youtube.com/embed/")) return url;
    return null;
  } catch { return null; }
};

const YoutubePreview = ({ url }) => {
  const embed = toEmbedUrl(url);
  if (isYoutube(url) && embed) {
    return <iframe src={embed} title="youtube" className="w-full h-40 rounded-lg border" allowFullScreen />;
  }
  if (isYoutube(url)) return <a href={url} target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline break-all">▶ {url}</a>;
  return null;
};

const MediaLinks = ({ label, image, pdf, video }) => {
  if (!image && !pdf && !video) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {image && (
        <a href={image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg hover:bg-white">
          <span>🖼️</span> {label} Image
        </a>
      )}
      {pdf && (
        <a href={pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-lg hover:bg-red-100">
          <span>📄</span> {label} PDF
        </a>
      )}
      {video && (
        isYoutube(video) ? (
          <a href={video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-lg hover:bg-red-100">
            <span>▶️</span> {label} YouTube
          </a>
        ) : (
          <a href={video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-medium bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-100">
            <span>🎥</span> {label} Video
          </a>
        )
      )}
    </div>
  );
};

const QuestionMediaPreview = ({ p }) => (
  <div className="mt-2 space-y-2">
    {p.questionImage && (
      <div className="rounded-lg overflow-hidden border border-gray-100">
        <img src={p.questionImage} alt="Q" className="w-full max-h-40 object-cover" />
      </div>
    )}
    {(p.questionPdf || p.questionVideo) && <MediaLinks label="Q" image={null} pdf={p.questionPdf} video={p.questionVideo} />}
    {p.questionVideo && (
      isYoutube(p.questionVideo) ? <YoutubePreview url={p.questionVideo} /> : <video src={p.questionVideo} controls className="w-full rounded-lg max-h-40 bg-black" />
    )}
  </div>
);

const SolutionMediaPreview = ({ p }) => {
  if (!p.solutionImage && !p.solutionPdf && !p.solutionVideo && !p.solution) return null;
  return (
    <div className="mt-2 bg-white border border-green-100 rounded-lg p-2">
      <p className="text-[10px] font-bold text-green-700 uppercase">Solution</p>
      {p.solution && <p className="text-[12px] text-gray-700 mt-1 whitespace-pre-wrap">{p.solution}</p>}
      {p.solutionImage && <img src={p.solutionImage} alt="Sol" className="w-full max-h-40 object-cover rounded-lg mt-2 border" />}
      <MediaLinks label="Sol" image={null} pdf={p.solutionPdf} video={p.solutionVideo} />
      {p.solutionVideo && (isYoutube(p.solutionVideo) ? <div className="mt-1"><YoutubePreview url={p.solutionVideo} /></div> : <video src={p.solutionVideo} controls className="w-full rounded-lg max-h-40 bg-black mt-1" />)}
    </div>
  );
};

const SolveModal = ({ practice, onClose, onSubmit }) => {
  const [solution, setSolution] = useState(practice.solution || "");
  const [cooldown, setCooldown] = useState(practice.cooldown || "1day");
  const [files, setFiles] = useState({ solutionImage: null, solutionPdf: null, solutionVideo: null });
  const [youtubeLink, setYoutubeLink] = useState(isYoutube(practice.solutionVideo) ? practice.solutionVideo : "");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!solution.trim() && !files.solutionImage && !files.solutionPdf && !files.solutionVideo && !youtubeLink.trim()) {
      alert("Add solution description or media / youtube link");
      return;
    }
    setSubmitting(true);
    await onSubmit({ solution, files, cooldown, youtubeLink });
    setSubmitting(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
      <div className="bg-brand-light rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-gray-900">Solve — Add Solution</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-brand-muted hover:bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        <div className="bg-brand-cream border border-gray-100 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">{practice.category}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${practice.questionType === "theory" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{practice.questionType}</span>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">{practice.question}</p>
          <p className="text-[12px] text-gray-500">{practice.description}</p>
          <QuestionMediaPreview p={practice} />
          <p className="text-[10px] text-gray-400 mt-2">Created: {fmtDate(practice.createdAt)} • Table: PraticalQuestion (single table)</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Solution Description *</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Write solution / explanation..." rows={3} className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange resize-none" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Solution Image (update)</label>
            <label className="flex items-center justify-between border border-dashed bg-brand-cream rounded-xl px-3 py-2 cursor-pointer hover:bg-white">
              <span className="text-[12px]">🖼️ {files.solutionImage?.name ? <span className="text-green-600 text-[10px]">{files.solutionImage.name}</span> : "Choose image"}</span>
              <span className="text-[11px] bg-brand-dark text-white px-2 py-1 rounded">Browse</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFiles({ ...files, solutionImage: e.target.files[0] })} />
            </label>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">YouTube Video Link (solution)</label>
            <input value={youtubeLink} onChange={(e)=>setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=... or youtu.be/..." className="w-full px-3 py-2 border border-gray-200 bg-brand-cream rounded-xl text-[13px] focus:outline-none focus:border-brand-orange" />
            <p className="text-[10px] text-gray-400 mt-1">Paste YouTube link like youtube video upload — will be saved as solutionVideo URL</p>
            {youtubeLink && isYoutube(youtubeLink) && <div className="mt-2"><YoutubePreview url={youtubeLink} /></div>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="border border-dashed border-gray-200 rounded-xl p-3 bg-brand-cream hover:bg-white cursor-pointer text-center">
              <span className="text-lg">📄</span>
              <p className="text-[11px] font-medium text-gray-600">Sol PDF</p>
              <p className="text-[10px] text-gray-400 truncate">{files.solutionPdf?.name || "Choose"}</p>
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFiles({ ...files, solutionPdf: e.target.files[0] })} />
            </label>
            <label className="border border-dashed border-gray-200 rounded-xl p-3 bg-brand-cream hover:bg-white cursor-pointer text-center">
              <span className="text-lg">🎥</span>
              <p className="text-[11px] font-medium text-gray-600">Sol Video File</p>
              <p className="text-[10px] text-gray-400 truncate">{files.solutionVideo?.name || "Choose"}</p>
              <input type="file" accept="video/*" className="hidden" onChange={(e) => setFiles({ ...files, solutionVideo: e.target.files[0] })} />
            </label>
          </div>
          <div className="mb-1">
            <label className="block text-[12px] font-semibold text-gray-700 mb-1">Next submission after</label>
            <div className="flex gap-2">
              <button type="button" onClick={()=>setCooldown("1day")} className={`flex-1 py-2 rounded-xl text-[12px] font-bold border ${cooldown==="1day"?"bg-brand-dark text-white border-brand-dark":"bg-white border-gray-200"}`}>⏰ 1 Day</button>
              <button type="button" onClick={()=>setCooldown("1week")} className={`flex-1 py-2 rounded-xl text-[12px] font-bold border ${cooldown==="1week"?"bg-brand-dark text-white border-brand-dark":"bg-white border-gray-200"}`}>📅 1 Week</button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 bg-brand-dark text-white rounded-xl text-[13px] font-bold hover:opacity-90 disabled:opacity-60">
            {submitting ? "Uploading..." : "✓ Submit Solved — Complete"}
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-[13px] font-medium">Cancel</button>
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-2">Updates same <code>PraticalQuestion</code> row: status→completed • solution image/youtube linked</p>
      </div>
    </div>
  );
};

const PracticeCard = ({ p, onSolve, onEdit, onDelete, isAdmin }) => {
  const completed = p.status === "completed";
  const [cardMenu, setCardMenu] = useState(false);
  return (
    <div className={`bg-brand-light border rounded-xl p-4 hover:shadow-md transition-all flex flex-col relative ${completed ? "border-green-200 bg-green-50/30" : "border-gray-100"}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-orange-50 text-orange-700 border-orange-200">{p.category}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.questionType === "theory" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{p.questionType === "theory" ? "📖 Theory" : "🛠️ Practical"}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.cooldown==="1week"?"bg-purple-50 text-purple-700 border-purple-200":"bg-amber-50 text-amber-700 border-amber-200"}`}>{p.cooldown==="1week"?"📅 1 Week":"⏰ 1 Day"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${completed ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>{completed ? "✓ Completed" : "● Pending"}</span>
          <div className="relative">
            <button onClick={()=>setCardMenu(!cardMenu)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600">⋮</button>
            {cardMenu && (
              <div className="absolute right-0 top-8 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-10 py-1">
                {!completed && <button onClick={()=>{setCardMenu(false); onSolve(p);}} className="w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50">✅ Solve</button>}
                {isAdmin && <button onClick={()=>{setCardMenu(false); onEdit(p);}} className="w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50">✏️ Edit</button>}
                {isAdmin && <button onClick={()=>{setCardMenu(false); onDelete(p.id);}} className="w-full text-left px-3 py-2 text-[12px] hover:bg-red-50 text-red-600">🗑️ Delete</button>}
                {isAdmin && completed && <button onClick={()=>{setCardMenu(false); onEdit({...p,_reset:true});}} className="w-full text-left px-3 py-2 text-[12px] hover:bg-yellow-50">↩️ Reset</button>}
                <button onClick={()=>setCardMenu(false)} className="w-full text-left px-3 py-2 text-[11px] text-gray-400 hover:bg-gray-50">✕ Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-[13px] font-semibold text-gray-900">{p.question}</h3>
      <p className="text-[12px] text-gray-500 mt-1">{p.description}</p>
      <QuestionMediaPreview p={p} />
      {completed && <SolutionMediaPreview p={p} />}
      <div className="mt-3 space-y-1 text-[10px] text-gray-400">
        <p>📅 Created: <span className="font-medium text-gray-600">{fmtDate(p.createdAt)}</span></p>
        <p>✅ Completed: <span className={`font-medium ${completed ? "text-green-600" : "text-gray-400"}`}>{completed ? fmtDate(p.completedAt) : "—"}</span></p>
        {completed && p.nextAvailableAt && <p>🔄 Next: <span className="font-medium text-purple-600">{fmtDate(p.nextAvailableAt)} ({p.cooldown})</span></p>}
        {p.completedByEmail && <p>👤 By: {p.completedByEmail}</p>}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-[10px] text-gray-300">#{p.id}</span>
        {completed ? <span className="text-[12px] font-semibold text-green-600">Done ✓</span> : <button onClick={() => onSolve(p)} className="text-[12px] font-semibold bg-brand-dark text-white px-3 py-1.5 rounded-lg">Solve →</button>}
      </div>
    </div>
  );
};

export default function PracticesPage() {
  const { user } = useAuth();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const isAdmin = mounted && user?.role === "admin";

  const [practices, setPractices] = useState([]);
  const [daily, setDaily] = useState([]);
  const [dailyDate, setDailyDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "JavaScript", question: "", description: "", questionType: "practical", solution: "", cooldown: "1day" });
  const [qFiles, setQFiles] = useState({ questionImage: null, questionPdf: null, questionVideo: null });
  const [sFiles, setSFiles] = useState({ solutionImage: null, solutionPdf: null, solutionVideo: null });
  const [qYoutube, setQYoutube] = useState("");
  const [sYoutube, setSYoutube] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [solveTarget, setSolveTarget] = useState(null);
  const [toast, setToast] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });

  const PRIMARY_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const FALLBACK_URL = "https://aim-backend-6vi0.onrender.com";
  const [apiUrl, setApiUrl] = useState(PRIMARY_URL);
  const [fetchError, setFetchError] = useState("");

  const fetchWithFallback = async (path, opts = {}) => {
    try {
      const r = await fetch(`${PRIMARY_URL}${path}`, opts);
      if (r.ok) {
        if (apiUrl !== PRIMARY_URL) setApiUrl(PRIMARY_URL);
        return r;
      }
      throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      if (PRIMARY_URL.includes("localhost")) {
        try {
          const r2 = await fetch(`${FALLBACK_URL}${path}`, opts);
          if (r2.ok) {
            console.warn(`Primary ${PRIMARY_URL} failed, fallback ${FALLBACK_URL} succeeded`);
            setApiUrl(FALLBACK_URL);
            return r2;
          }
        } catch (e2) {}
      }
      throw e;
    }
  };

  const API_URL = apiUrl;

  const fetchAll = async () => {
    try {
      const res = await fetchWithFallback(`/api/practices/all`);
      const data = await res.json().catch(()=>({}));
      setPractices(data.data || []);
      setFetchError("");
    } catch (err) {
      console.warn("Practices fetch failed — tried", PRIMARY_URL, "and fallback", err?.message);
      setFetchError(`Backend not reachable. Tried ${PRIMARY_URL} and ${FALLBACK_URL}. Run BAC: cd PROJECT/BAC && npm run dev (port 5000)`);
      setPractices([]);
    }
  };
  const fetchDaily = async () => {
    try {
      const res = await fetchWithFallback(`/api/practices/daily?limit=2`);
      const data = await res.json().catch(()=>({}));
      setDaily(data.data || []);
      setDailyDate(data.date || new Date().toISOString().slice(0,10));
    } catch (err) {
      console.warn("Daily fetch failed:", err?.message);
      setDaily([]);
    }
  };
  const refresh = async () => {
    setLoading(true);
    await Promise.all([fetchAll(), fetchDaily()]);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);
  // close menu on outside click /esc
  useEffect(()=>{
    const h=()=>setMenuId(null);
    window.addEventListener("scroll",h,true);
    return()=>window.removeEventListener("scroll",h,true);
  },[]);
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""), 3000); };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.description.trim()) return;
    const fd = new FormData();
    fd.append("category", form.category);
    fd.append("question", form.question);
    fd.append("description", form.description);
    fd.append("questionType", form.questionType);
    fd.append("cooldown", form.cooldown || "1day");
    fd.append("solution", form.solution || "");
    if (qFiles.questionImage) fd.append("questionImage", qFiles.questionImage);
    if (qFiles.questionPdf) fd.append("questionPdf", qFiles.questionPdf);
    if (qFiles.questionVideo) fd.append("questionVideo", qFiles.questionVideo);
    if (sFiles.solutionImage) fd.append("solutionImage", sFiles.solutionImage);
    if (sFiles.solutionPdf) fd.append("solutionPdf", sFiles.solutionPdf);
    if (sFiles.solutionVideo) fd.append("solutionVideo", sFiles.solutionVideo);
    // youtube links as url fallback (stored same column)
    if (qYoutube.trim()) fd.append("questionVideoUrl", qYoutube.trim());
    else if (!qFiles.questionVideo && editingId) {
      // keep existing if editing and no new file/link - don't send
    }
    if (sYoutube.trim()) fd.append("solutionVideoUrl", sYoutube.trim());

    try {
      let res;
      if (editingId) {
        if (form._reset) {
          res = await fetch(`${API_URL}/api/practices/${editingId}/reset`, { method: "PATCH" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          showToast("Reset to pending ✓");
        } else {
          res = await fetch(`${API_URL}/api/practices/${editingId}`, { method: "PUT", body: fd });
          if (!res.ok) {
            const j = await res.json().catch(()=>({}));
            throw new Error(j.message || `HTTP ${res.status}`);
          }
          showToast("PraticalQuestion updated ✓");
        }
      } else {
        res = await fetch(`${API_URL}/api/practices/add`, { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(()=>({}));
          throw new Error(j.message || `HTTP ${res.status}`);
        }
        showToast("PraticalQuestion created ✓");
      }
      setForm({ category: "JavaScript", question: "", description: "", questionType: "practical", solution: "", cooldown: "1day" });
      setQFiles({ questionImage: null, questionPdf: null, questionVideo: null });
      setSFiles({ solutionImage: null, solutionPdf: null, solutionVideo: null });
      setQYoutube(""); setSYoutube("");
      setEditingId(null);
      setShowForm(false);
      refresh();
    } catch (err) {
      console.warn("Save failed — backend not reachable:", err?.message);
      showToast(`Failed: ${err?.message} — check backend at ${API_URL}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this PraticalQuestion row?")) return;
    try {
      const res = await fetch(`${API_URL}/api/practices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast("Deleted ✓");
      setMenuId(null);
      refresh();
    } catch (err) {
      showToast(`Delete failed: ${err?.message}`);
    }
  };
  const startEdit = (p) => {
    setMenuId(null);
    if (p._reset) {
      fetch(`${API_URL}/api/practices/${p.id}/reset`, { method: "PATCH" }).then(()=>{showToast("Reset ✓"); refresh();}).catch(err=>showToast(`Reset failed: ${err?.message}`));
      return;
    }
    setForm({ category: p.category, question: p.question, description: p.description, questionType: p.questionType || "practical", solution: p.solution || "", cooldown: p.cooldown || "1day" });
    setQYoutube(isYoutube(p.questionVideo) ? p.questionVideo : "");
    setSYoutube(isYoutube(p.solutionVideo) ? p.solutionVideo : "");
    setQFiles({ questionImage: null, questionPdf: null, questionVideo: null });
    setSFiles({ solutionImage: null, solutionPdf: null, solutionVideo: null });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleSolveSubmit = async ({ solution, files, cooldown, youtubeLink }) => {
    if (!solveTarget) return;
    const fd = new FormData();
    fd.append("practiceId", solveTarget.id);
    if (user?.id) fd.append("userId", user.id);
    if (user?.email) fd.append("userEmail", user.email);
    fd.append("solution", solution || "");
    fd.append("cooldown", cooldown || "1day");
    if (files.solutionImage) fd.append("solutionImage", files.solutionImage);
    if (files.solutionPdf) fd.append("solutionPdf", files.solutionPdf);
    if (files.solutionVideo) fd.append("solutionVideo", files.solutionVideo);
    if (youtubeLink && youtubeLink.trim()) fd.append("solutionVideoUrl", youtubeLink.trim());
    try {
      const res = await fetch(`${API_URL}/api/practices/submit`, { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j.message || `HTTP ${res.status}`);
      }
      setSolveTarget(null);
      showToast("Completed ✓ — same PraticalQuestion row updated");
      refresh();
    } catch (err) {
      showToast(`Submit failed: ${err?.message} — backend at ${API_URL}`);
    }
  };

  const filtered = practices.filter((p) => {
    const catOk = filterCat === "All" || p.category === filterCat;
    const typeOk = filterType === "All" || p.questionType === filterType;
    return catOk && typeOk;
  });
  const completedCount = practices.filter((p) => p.status === "completed").length;

  if (!mounted) return <div className="min-h-screen bg-brand-cream flex items-center justify-center"><div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-brand-cream">
      <PageHero
        badge="📝 PraticalQuestion • Single Table"
        title="Practical & Theory"
        titleGradient="Questions"
        subtitle="One table PraticalQuestion holds Question + Solution with pdf/image/video each. CreatedAt vs CompletedAt tracked. Daily 2 rotation."
        showExplore={false}
        features={[
          { icon: "🗂️", title: "PraticalQuestion", sub: "Single table" },
          { icon: "📄", title: "PDF / Image / Video", sub: "Q & Sol" },
          { icon: "📅", title: "Daily 2", sub: "2 per day" },
          { icon: "✅", title: "Status", sub: "pending→completed" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {fetchError && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>⚠️ {fetchError} <span className="text-[11px] text-gray-500 ml-1">({apiUrl})</span></span>
            <div className="flex gap-2">
              <button onClick={refresh} className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-amber-700">Retry</button>
              <span className="text-[11px] text-gray-500 self-center">or check BAC terminal</span>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">📝 PraticalQuestion <span className="text-[11px] bg-brand-dark text-white px-2 py-0.5 rounded-full">{practices.length} total • {completedCount} done</span></h1>
            <p className="text-[11px] text-gray-400">Table: <code>PraticalQuestion</code> — question (pdf/image/video) + solution (pdf/image/video) in ONE row</p>
          </div>
          {isAdmin && <button onClick={() => { setShowForm(!showForm); if (showForm){ setEditingId(null); setForm({ category:"JavaScript", question:"", description:"", questionType:"practical", solution:"", cooldown:"1day" }); setQFiles({questionImage:null,questionPdf:null,questionVideo:null}); setSFiles({solutionImage:null,solutionPdf:null,solutionVideo:null}); setQYoutube(""); setSYoutube(""); } }} className={`text-[13px] font-semibold px-4 py-2 rounded-xl ${showForm?"bg-gray-100 border":"bg-brand-dark text-white"}`}>{showForm?"✕ Close":editingId?"✏️ Editing":"+ Add PraticalQuestion"}</button>}
        </div>

        {isAdmin && showForm && (
          <div className="bg-brand-light border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
            <h2 className="text-[15px] font-bold text-gray-900">{editingId ? "Edit" : "Add"} PraticalQuestion — Q & Sol media</h2>
            <p className="text-[11px] text-gray-400 mb-3">Same <code>PraticalQuestion</code> table • Q img/pdf/vid + Sol img/pdf/vid • YouTube link supported • Choose cooldown 1 day / 1 week</p>
            <form onSubmit={handleAddOrUpdate} className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[12px] font-semibold">Category *</label>
                  <select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} className="w-full px-3 py-2 border bg-brand-cream rounded-xl text-[13px]">
                    {PRACTICE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-semibold">Type *</label>
                  <select value={form.questionType} onChange={(e)=>setForm({...form,questionType:e.target.value})} className="w-full px-3 py-2 border bg-brand-cream rounded-xl text-[13px]">
                    {QUESTION_TYPES.map(t=><option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-semibold">Cooldown *</label>
                  <select value={form.cooldown} onChange={(e)=>setForm({...form,cooldown:e.target.value})} className="w-full px-3 py-2 border bg-brand-cream rounded-xl text-[13px]">
                    <option value="1day">⏰ 1 Day</option>
                    <option value="1week">📅 1 Week</option>
                  </select>
                </div>
              </div>
              <input placeholder="Question *" value={form.question} onChange={(e)=>setForm({...form,question:e.target.value})} required className="w-full px-3 py-2.5 border bg-brand-cream rounded-xl text-[13px]" />
              <textarea placeholder="Description *" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} required rows={3} className="w-full px-3 py-2.5 border bg-brand-cream rounded-xl text-[13px] resize-none" />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-xl p-3 bg-brand-cream">
                  <p className="text-[12px] font-bold text-gray-800 mb-2">❓ Question Media (pdf/image/video + YouTube)</p>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">🖼️ Image {qFiles.questionImage?.name && <span className="text-green-600 text-[10px]">{qFiles.questionImage.name}</span>}</span>
                      <span className="text-[11px] bg-gray-900 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e)=>setQFiles({...qFiles,questionImage:e.target.files[0]})} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">📄 PDF {qFiles.questionPdf?.name && <span className="text-green-600 text-[10px]">{qFiles.questionPdf.name}</span>}</span>
                      <span className="text-[11px] bg-gray-900 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e)=>setQFiles({...qFiles,questionPdf:e.target.files[0]})} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">🎥 Video file {qFiles.questionVideo?.name && <span className="text-green-600 text-[10px]">{qFiles.questionVideo.name}</span>}</span>
                      <span className="text-[11px] bg-gray-900 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e)=>setQFiles({...qFiles,questionVideo:e.target.files[0]})} />
                    </label>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700">▶️ YouTube Video Link (question)</label>
                      <input value={qYoutube} onChange={(e)=>setQYoutube(e.target.value)} placeholder="https://youtu.be/... or youtube.com/watch?v=..." className="w-full mt-1 px-3 py-2 border bg-white rounded-lg text-[12px] focus:outline-none focus:border-brand-orange" />
                      {qYoutube && isYoutube(qYoutube) && <div className="mt-2"><YoutubePreview url={qYoutube} /></div>}
                    </div>
                  </div>
                </div>
                <div className="border rounded-xl p-3 bg-green-50/50">
                  <p className="text-[12px] font-bold text-green-800 mb-2">✅ Solution Media (pdf/image/video + YouTube) + Text</p>
                  <textarea placeholder="Solution text (optional)" value={form.solution} onChange={(e)=>setForm({...form,solution:e.target.value})} rows={2} className="w-full px-3 py-2 border bg-white rounded-xl text-[12px] resize-none mb-2" />
                  <div className="space-y-2">
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">🖼️ Sol Image {sFiles.solutionImage?.name && <span className="text-green-600 text-[10px]">{sFiles.solutionImage.name}</span>}</span>
                      <span className="text-[11px] bg-green-700 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e)=>setSFiles({...sFiles,solutionImage:e.target.files[0]})} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">📄 Sol PDF {sFiles.solutionPdf?.name && <span className="text-green-600 text-[10px]">{sFiles.solutionPdf.name}</span>}</span>
                      <span className="text-[11px] bg-green-700 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e)=>setSFiles({...sFiles,solutionPdf:e.target.files[0]})} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed bg-white rounded-lg px-3 py-2 cursor-pointer">
                      <span className="text-[12px]">🎥 Sol Video file {sFiles.solutionVideo?.name && <span className="text-green-600 text-[10px]">{sFiles.solutionVideo.name}</span>}</span>
                      <span className="text-[11px] bg-green-700 text-white px-2 py-1 rounded">Browse</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e)=>setSFiles({...sFiles,solutionVideo:e.target.files[0]})} />
                    </label>
                    <div>
                      <label className="text-[11px] font-semibold text-green-700">▶️ YouTube Video Link (solution)</label>
                      <input value={sYoutube} onChange={(e)=>setSYoutube(e.target.value)} placeholder="https://youtu.be/... or youtube.com/watch?v=..." className="w-full mt-1 px-3 py-2 border bg-white rounded-lg text-[12px] focus:outline-none focus:border-green-500" />
                      {sYoutube && isYoutube(sYoutube) && <div className="mt-2"><YoutubePreview url={sYoutube} /></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-brand-dark text-white px-6 py-2.5 rounded-xl text-[13px] font-bold">{editingId?"Update Row":"Create Row — PraticalQuestion"}</button>
                {editingId && <button type="button" onClick={()=>{setEditingId(null); setForm({category:"JavaScript",question:"",description:"",questionType:"practical",solution:"", cooldown:"1day"}); setQYoutube(""); setSYoutube("");}} className="border px-5 py-2.5 rounded-xl text-[13px]">Cancel</button>}
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-brand-light border rounded-xl p-4"><p className="text-[11px] text-gray-400">PraticalQuestion rows</p><p className="text-[18px] font-bold">{practices.length}</p></div>
          <div className="bg-brand-light border rounded-xl p-4"><p className="text-[11px] text-gray-400">Daily 2 • {dailyDate}</p><p className="text-[18px] font-bold">{daily.length} / 2</p></div>
          <div className="bg-brand-light border rounded-xl p-4"><p className="text-[11px] text-gray-400">Completed</p><p className="text-[18px] font-bold text-green-600">{practices.filter(p=>p.status==="completed").length}</p></div>
          <div className="bg-brand-light border rounded-xl p-4"><p className="text-[11px] text-gray-400">Media</p><p className="text-[11px] font-medium">Q: img/pdf/vid/yt + Sol: img/pdf/vid/yt</p></div>
        </div>

        {loading ? <div className="text-center py-12"><div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto" /></div> : (
          <>
            <div className="mb-8">
              <h2 className="text-[14px] font-bold mb-3">🔥 Daily 2 — {dailyDate}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {daily.map(p=>(
                  <div key={p.id} className={`border-2 rounded-2xl p-5 ${p.status==="completed"?"border-green-200 bg-green-50/30":"border-orange-200 bg-orange-50/20"}`}>
                    <div className="flex gap-1 mb-2">
                      <span className="text-[10px] bg-orange-50 border px-2 py-0.5 rounded-full">{p.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${p.questionType==="theory"?"bg-blue-50 text-blue-700":"bg-emerald-50 text-emerald-700"}`}>{p.questionType}</span>
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${p.status==="completed"?"bg-green-500 text-white":"bg-yellow-400"}`}>{p.status}</span>
                    </div>
                    <h3 className="text-[13px] font-bold">{p.question}</h3>
                    <p className="text-[12px] text-gray-600 mt-1">{p.description}</p>
                    <QuestionMediaPreview p={p} />
                    {p.status==="completed" && <SolutionMediaPreview p={p} />}
                    <p className="text-[10px] text-gray-400 mt-2">Created {fmtDate(p.createdAt)} • Completed {p.completedAt?fmtDate(p.completedAt):"—"}</p>
                    <div className="mt-3">{p.status==="completed"?<span className="text-green-700 font-bold text-[13px]">✓ Completed</span>:<button onClick={()=>setSolveTarget(p)} className="w-full bg-brand-dark text-white py-2 rounded-xl text-[13px] font-bold">Solve + Upload Solution Media →</button>}</div>
                  </div>
                ))}
                {daily.length===0 && <p className="text-sm text-gray-400">No questions</p>}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-bold">All PraticalQuestion ({filtered.length})</h2>
              <div className="flex gap-2">
                <select value={filterCat} onChange={(e)=>setFilterCat(e.target.value)} className="text-[11px] border rounded-lg px-2 py-1"><option value="All">All Cat</option>{PRACTICE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="text-[11px] border rounded-lg px-2 py-1"><option value="All">All Type</option><option value="practical">Practical</option><option value="theory">Theory</option></select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p=> <PracticeCard key={p.id} p={p} onSolve={setSolveTarget} onEdit={startEdit} onDelete={handleDelete} isAdmin={isAdmin} />)}
            </div>

            <div className="mt-8 bg-white border rounded-2xl overflow-hidden">
              <div className="px-4 py-2 bg-brand-cream border-b flex justify-between"><span className="text-[12px] font-bold">📋 PraticalQuestion Table — Single Table (one table question practice)</span><span className="text-[10px] text-gray-400">⋮ menu → Solve / Edit / Delete • Q/Sol media • youtube</span></div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead className="bg-gray-50 text-gray-500"><tr><th className="px-2 py-2">#</th><th className="px-2 py-2">Cat</th><th className="px-2 py-2">Type</th><th className="px-2 py-2">Cooldown</th><th className="px-2 py-2">Question</th><th className="px-2 py-2">Q Media</th><th className="px-2 py-2">Sol Media</th><th className="px-2 py-2">Created</th><th className="px-2 py-2">Completed</th><th className="px-2 py-2">Next After</th><th className="px-2 py-2">Status</th><th className="px-2 py-2 text-right">⋮</th></tr></thead>
                  <tbody>
                    {filtered.map(p=>(
                      <tr key={p.id} className="border-t hover:bg-gray-50">
                        <td className="px-2 py-2">{p.id}</td>
                        <td className="px-2 py-2">{p.category}</td>
                        <td className="px-2 py-2">{p.questionType}</td>
                        <td className="px-2 py-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${p.cooldown==="1week"?"bg-purple-50 text-purple-700":"bg-amber-50 text-amber-700"}`}>{p.cooldown || "1day"}</span></td>
                        <td className="px-2 py-2 max-w-[150px]"><p className="truncate font-medium">{p.question}</p><p className="truncate text-gray-400 text-[10px]">{p.description}</p></td>
                        <td className="px-2 py-2">{[p.questionImage&&"🖼️",p.questionPdf&&"📄",p.questionVideo&&(isYoutube(p.questionVideo)?"▶️":"🎥")].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-2 py-2">{[p.solutionImage&&"🖼️",p.solutionPdf&&"📄",p.solutionVideo&&(isYoutube(p.solutionVideo)?"▶️":"🎥")].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-2 py-2">{fmtShort(p.createdAt)}</td>
                        <td className="px-2 py-2">{p.completedAt?fmtShort(p.completedAt):"—"}</td>
                        <td className="px-2 py-2">{p.nextAvailableAt?fmtShort(p.nextAvailableAt):"—"}</td>
                        <td className="px-2 py-2"><span className={`px-2 py-0.5 rounded-full border text-[10px] ${p.status==="completed"?"bg-green-50 text-green-700":"bg-yellow-50"}`}>{p.status}</span></td>
                        <td className="px-2 py-2 text-right">
                          <button
                            onClick={(e)=>{
                              if (menuId===p.id) { setMenuId(null); return; }
                              const r = e.currentTarget.getBoundingClientRect();
                              setMenuPos({ left: r.right - 144, top: r.bottom + 6 });
                              setMenuId(p.id);
                            }}
                            className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
                          >
                            <span className="text-[14px] leading-none">⋮</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length===0 && <tr><td colSpan={12} className="text-center py-6 text-gray-400">No rows — add question via + Add PraticalQuestion (category, type, question, description)</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {solveTarget && <SolveModal practice={solveTarget} user={user} onClose={()=>setSolveTarget(null)} onSubmit={handleSolveSubmit} />}
        {toast && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[12px] px-4 py-2 rounded-full">{toast}</div>}
      </div>
      {menuId && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={()=>setMenuId(null)} />
          <div className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-36 py-1.5 animate-scale-in" style={{ left: menuPos.left, top: menuPos.top }}>
            {(()=>{ const mp = practices.find(x=>x.id===menuId); if(!mp) return null; const completed = mp.status==="completed";
              return (
                <>
                  {!completed && <button onClick={()=>{setMenuId(null); setSolveTarget(mp);}} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-700 hover:bg-green-50 text-left">✅ Solve</button>}
                  {completed && <button onClick={()=>{setMenuId(null); setSolveTarget({...mp});}} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-green-700 hover:bg-green-50 text-left">👁️ View / Update Solution</button>}
                  {isAdmin && <button onClick={()=>{setMenuId(null); startEdit(mp);}} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-gray-700 hover:bg-gray-50 text-left">✏️ Edit</button>}
                  {isAdmin && <button onClick={()=>handleDelete(mp.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 text-left">🗑️ Delete</button>}
                  {isAdmin && completed && <button onClick={()=>{setMenuId(null); startEdit({...mp,_reset:true});}} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-yellow-700 hover:bg-yellow-50 text-left">↩️ Reset</button>}
                </>
              );
            })()}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
