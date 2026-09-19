"use client";
import React, { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../Context/AuthContext";
import PageHero from "@/app/Components/Reusable/PageHero";
import CommonPieChart from "@/app/Components/Reusable/CommonPieChart";

const PRACTICE_CATEGORIES = ["JavaScript", "React", "Node.js", "DSA", "CSS", "HTML", "Database", "General", "System Design", "Nginx", "Docker", "Kubernetes", "AI", "Redis"];
const QUESTION_TYPES = [
  { value: "practical", label: "Practical", icon: "🛠️" },
  { value: "theory", label: "Theory", icon: "📖" },
];

/* ───── helpers ───── */
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};
const fmtShort = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
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
  } catch {
    return null;
  }
};

/* ───── tiny icons (keeps bundle light) ───── */
const EyeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);
const PieIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 0 1 10 10H12V2Z" />
    <path d="M12 2a10 10 0 0 0-10 10h10V2Z" fill="currentColor" opacity="0.35" />
    <path d="M2 12a10 10 0 0 0 10 10V12H2Z" />
  </svg>
);
const SparkIcon = () => <span className="text-[11px]">✦</span>;

/* ───── reusable media ───── */
const YoutubePreview = ({ url }) => {
  const embed = toEmbedUrl(url);
  if (isYoutube(url) && embed) {
    return (
      <div className="overflow-hidden rounded-xl border border-brand-muted/40 bg-black shadow-sm">
        <iframe src={embed} title="youtube" className="w-full aspect-video" allowFullScreen />
      </div>
    );
  }
  if (isYoutube(url))
    return (
      <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-dark underline decoration-brand-tan/50 underline-offset-2 break-all hover:text-brand-orange">
        ▶ {url}
      </a>
    );
  return null;
};

const MediaLinks = ({ label, pdf, video }) => {
  if (!pdf && !video) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {pdf && (
        <a href={pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white border border-red-100 text-red-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-red-50 hover:border-red-200 transition">
          <span>📄</span> {label} PDF
        </a>
      )}
      {video &&
        (isYoutube(video) ? (
          <a href={video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white border border-red-100 text-red-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-red-50 transition">
            <span>▶️</span> {label} YouTube
          </a>
        ) : (
          <a href={video} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white border border-sky-100 text-sky-700 px-3 py-1.5 rounded-full shadow-sm hover:bg-sky-50 transition">
            <span>🎥</span> {label} Video
          </a>
        ))}
    </div>
  );
};

const QuestionMediaPreview = ({ p }) => (
  <div className="mt-3 space-y-2.5">
    {p.questionImage && (
      <div className="overflow-hidden rounded-xl border border-brand-muted/40 bg-brand-cream shadow-sm group/img">
        <img src={p.questionImage} alt="Question" className="w-full max-h-44 object-cover group-hover/img:scale-[1.02] transition duration-500" />
      </div>
    )}
    {(p.questionPdf || p.questionVideo) && <MediaLinks label="Q" pdf={p.questionPdf} video={p.questionVideo} />}
    {p.questionVideo &&
      (isYoutube(p.questionVideo) ? <YoutubePreview url={p.questionVideo} /> : <video src={p.questionVideo} controls className="w-full rounded-xl max-h-44 bg-black border border-brand-muted/40 shadow-sm" />)}
  </div>
);

const SolutionMediaPreview = ({ p }) => {
  if (!p.solutionImage && !p.solutionPdf && !p.solutionVideo && !p.solution) return null;
  return (
    <div className="mt-3 bg-white border border-green-100 rounded-xl p-3 shadow-sm">
      <p className="text-[10px] font-bold tracking-widest text-green-700 uppercase flex items-center gap-1"><SparkIcon /> Solution</p>
      {p.solution && <p className="text-[12.5px] text-gray-700 mt-1.5 whitespace-pre-wrap leading-relaxed">{p.solution}</p>}
      {p.solutionImage && <img src={p.solutionImage} alt="Sol" className="w-full max-h-40 object-cover rounded-xl mt-2.5 border border-green-100" />}
      <div className="mt-2"><MediaLinks label="Sol" pdf={p.solutionPdf} video={p.solutionVideo} /></div>
      {p.solutionVideo &&
        (isYoutube(p.solutionVideo) ? <div className="mt-2"><YoutubePreview url={p.solutionVideo} /></div> : <video src={p.solutionVideo} controls className="w-full rounded-xl max-h-40 bg-black mt-2 border" />)}
    </div>
  );
};

/* ───── modals ───── */
const ViewAnswerModal = ({ practice, onClose }) => {
  if (!practice) return null;
  const hasSolution = practice.solution || practice.solutionImage || practice.solutionPdf || practice.solutionVideo;
  return (
    <div className="fixed inset-0 bg-brand-dark/55 backdrop-blur-[3px] flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-brand-light rounded-[22px] shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-white/60" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="sticky top-0 z-10 bg-brand-light/90 backdrop-blur border-b border-brand-muted/40 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-dark text-white flex items-center justify-center shadow-md"><EyeIcon size={16} /></div>
            <div>
              <h2 className="text-[13px] font-bold tracking-tight text-brand-dark leading-none">Answer Preview</h2>
              <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> {practice.category} • {practice.questionType}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white border border-brand-muted/50 hover:bg-brand-cream flex items-center justify-center text-gray-500 transition">✕</button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4 scrollbar-hide">
          {/* question */}
          <div className="bg-brand-cream border border-brand-muted/40 rounded-2xl p-4">
            <p className="text-[10px] font-bold tracking-[0.14em] text-brand-orange uppercase">Question</p>
            <p className="text-[14px] font-semibold text-brand-dark mt-1.5 leading-snug">{practice.question}</p>
            <p className="text-[12.5px] text-gray-600 mt-1 leading-relaxed">{practice.description}</p>
          </div>

          {!hasSolution ? (
            <div className="text-center py-8 bg-white border border-dashed border-brand-muted rounded-2xl">
              <p className="text-sm text-gray-500">No solution added yet — still pending</p>
              <p className="text-[11px] text-gray-400 mt-1">Solve it to unlock the answer</p>
            </div>
          ) : (
            <>
              {practice.solution && (
                <div className="bg-white border border-green-100 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600 opacity-80" />
                  <p className="text-[10px] font-bold tracking-[0.14em] text-green-700 uppercase flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-600" /> Answer</p>
                  <p className="text-[13.5px] text-gray-800 mt-2 whitespace-pre-wrap leading-relaxed">{practice.solution}</p>
                </div>
              )}
              {practice.solutionImage && (
                <div className="bg-white border border-brand-muted/40 rounded-2xl p-3 shadow-sm">
                  <p className="text-[11px] font-bold text-brand-dark mb-2 flex items-center gap-1.5">🖼️ Answer Image</p>
                  <img src={practice.solutionImage} alt="Answer" className="w-full rounded-xl object-contain max-h-[360px] bg-brand-cream border border-brand-muted/30" />
                </div>
              )}
              {(practice.solutionPdf || practice.solutionVideo) && (
                <div className="bg-white border border-brand-muted/40 rounded-2xl p-4">
                  <p className="text-[11px] font-bold text-brand-dark mb-2">Attachments</p>
                  <MediaLinks label="Ans" pdf={practice.solutionPdf} video={practice.solutionVideo} />
                </div>
              )}
              {practice.solutionVideo && (
                <div className="bg-white border border-brand-muted/40 rounded-2xl p-3 shadow-sm">
                  <p className="text-[11px] font-bold text-brand-dark mb-2">🎥 Answer Video</p>
                  {isYoutube(practice.solutionVideo) ? <YoutubePreview url={practice.solutionVideo} /> : <video src={practice.solutionVideo} controls className="w-full rounded-xl max-h-64 bg-black border border-brand-muted/40" />}
                </div>
              )}
              {(practice.questionImage || practice.questionPdf || practice.questionVideo) && (
                <details className="bg-brand-cream border border-brand-muted/40 rounded-2xl p-4 group">
                  <summary className="text-[12px] font-semibold text-brand-dark cursor-pointer list-none flex items-center justify-between">
                    <span>Show Question Media</span>
                    <span className="w-6 h-6 rounded-full bg-white border border-brand-muted flex items-center justify-center text-[11px] group-open:rotate-180 transition">⌄</span>
                  </summary>
                  <div className="mt-3">
                    <QuestionMediaPreview p={practice} />
                  </div>
                </details>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-brand-muted/30 bg-brand-light">
          <button onClick={onClose} className="w-full py-3 bg-brand-dark text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-black transition shadow-md">Close Preview</button>
          <p className="text-[10px] text-center text-gray-400 mt-2">Answer stays hidden on cards — tap 👁️ to reveal</p>
        </div>
      </div>
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
    <div className="fixed inset-0 bg-brand-dark/55 backdrop-blur-[3px] flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-brand-light rounded-[22px] shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-white/60" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-brand-muted/40 flex items-center justify-between bg-brand-light">
          <div>
            <h2 className="text-[14px] font-bold text-brand-dark">Solve — Add Solution</h2>
            <p className="text-[11px] text-gray-500">Same PraticalQuestion row • status → completed</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white border border-brand-muted/50 hover:bg-brand-cream flex items-center justify-center text-gray-500">✕</button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 scrollbar-hide">
          <div className="bg-brand-cream border border-brand-muted/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-white border border-brand-muted text-brand-dark">{practice.category}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${practice.questionType === "theory" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{practice.questionType}</span>
            </div>
            <p className="text-[13.5px] font-semibold text-brand-dark leading-snug">{practice.question}</p>
            <p className="text-[12.5px] text-gray-600 mt-1">{practice.description}</p>
            <QuestionMediaPreview p={practice} />
            <p className="text-[10px] text-gray-400 mt-3">Created: {fmtDate(practice.createdAt)}</p>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-brand-dark mb-1.5">Solution Description *</label>
            <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Write solution / explanation..." rows={4} className="w-full px-3.5 py-3 border border-brand-muted bg-white rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none transition" />
          </div>

          <div className="grid gap-3">
            <label className="flex items-center justify-between border border-dashed border-brand-muted bg-white rounded-xl px-4 py-3 cursor-pointer hover:bg-brand-cream transition group">
              <span className="text-[13px] font-medium text-brand-dark flex items-center gap-2">🖼️ {files.solutionImage?.name ? <span className="text-emerald-700 text-[11px] font-semibold truncate max-w-[180px]">{files.solutionImage.name}</span> : <span className="text-gray-500">Solution image</span>}</span>
              <span className="text-[11px] font-bold bg-brand-dark text-white px-3 py-1.5 rounded-full group-hover:bg-black transition">Browse</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFiles({ ...files, solutionImage: e.target.files[0] })} />
            </label>

            <div>
              <label className="block text-[12px] font-semibold text-brand-dark mb-1.5">YouTube Video Link (solution)</label>
              <input value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} placeholder="https://youtube.com/watch?v=... or youtu.be/..." className="w-full px-3.5 py-2.5 border border-brand-muted bg-white rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 transition" />
              <p className="text-[10px] text-gray-400 mt-1">Paste YouTube link — saved as solutionVideo URL</p>
              {youtubeLink && isYoutube(youtubeLink) && <div className="mt-2"><YoutubePreview url={youtubeLink} /></div>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="border border-dashed border-brand-muted rounded-xl p-4 bg-white hover:bg-brand-cream cursor-pointer text-center transition group">
                <span className="text-xl block">📄</span>
                <p className="text-[11px] font-semibold text-brand-dark mt-1">Sol PDF</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{files.solutionPdf?.name || "Choose"}</p>
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFiles({ ...files, solutionPdf: e.target.files[0] })} />
              </label>
              <label className="border border-dashed border-brand-muted rounded-xl p-4 bg-white hover:bg-brand-cream cursor-pointer text-center transition">
                <span className="text-xl block">🎥</span>
                <p className="text-[11px] font-semibold text-brand-dark mt-1">Sol Video</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{files.solutionVideo?.name || "Choose"}</p>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => setFiles({ ...files, solutionVideo: e.target.files[0] })} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-brand-dark mb-2">Next available after</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-brand-cream rounded-xl border border-brand-muted/40">
              <button type="button" onClick={() => setCooldown("1day")} className={`py-2.5 rounded-lg text-[12px] font-bold transition ${cooldown === "1day" ? "bg-brand-dark text-white shadow-md" : "bg-white border border-brand-muted/40 text-gray-600 hover:bg-white"}`}>⏰ 1 Day</button>
              <button type="button" onClick={() => setCooldown("1week")} className={`py-2.5 rounded-lg text-[12px] font-bold transition ${cooldown === "1week" ? "bg-brand-dark text-white shadow-md" : "bg-white border border-brand-muted/40 text-gray-600 hover:bg-white"}`}>📅 1 Week</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-brand-muted/30 bg-brand-light flex gap-3">
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 bg-brand-dark text-white rounded-xl text-[13px] font-bold tracking-wide hover:bg-black disabled:opacity-60 shadow-md transition">
            {submitting ? "Uploading…" : "✓ Submit Solved — Complete"}
          </button>
          <button onClick={onClose} className="px-6 py-3 bg-white border border-brand-muted rounded-xl text-[13px] font-semibold text-brand-dark hover:bg-brand-cream transition">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ───── card ───── */
const PracticeCard = ({ p, onSolve, onView, onEdit, onDelete, isAdmin }) => {
  const completed = p.status === "completed";
  const [cardMenu, setCardMenu] = useState(false);
  const hasSolution = p.solution || p.solutionImage || p.solutionPdf || p.solutionVideo;
  return (
    <div className={`group bg-brand-light border rounded-[20px] overflow-hidden flex flex-col relative hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${completed ? "border-emerald-100 shadow-sm" : "border-brand-muted/40 shadow-sm"}`}>
      {/* top accent */}
      <div className={`h-1 w-full ${completed ? "bg-gradient-to-r from-emerald-400 to-green-600" : "bg-gradient-to-r from-brand-tan to-brand-orange"}`} />

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-white border border-brand-muted/60 text-brand-dark shadow-sm">{p.category}</span>
            <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border shadow-sm ${p.questionType === "theory" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{p.questionType === "theory" ? "📖 Theory" : "🛠️ Practical"}</span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${p.cooldown === "1week" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.cooldown === "1week" ? "📅 1 Week" : "⏰ 1 Day"}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border shadow-sm ${completed ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{completed ? "✓ Completed" : "● Pending"}</span>
            <div className="relative">
              <button onClick={() => setCardMenu(!cardMenu)} className="w-8 h-8 rounded-full bg-white border border-brand-muted/60 hover:bg-brand-cream flex items-center justify-center text-gray-600 shadow-sm transition">⋮</button>
              {cardMenu && (
                <div className="absolute right-0 top-9 w-44 bg-white border border-brand-muted/40 rounded-2xl shadow-xl z-10 py-1.5 animate-scale-in overflow-hidden">
                  {!completed && <button onClick={() => { setCardMenu(false); onSolve(p);}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium hover:bg-brand-cream flex items-center gap-2">✅ Solve</button>}
                  {completed && hasSolution && <button onClick={() => { setCardMenu(false); onView(p);}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-semibold hover:bg-green-50 text-green-700 flex items-center gap-2"><EyeIcon size={14} /> View Answer</button>}
                  {completed && <button onClick={() => { setCardMenu(false); onSolve(p);}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium hover:bg-sky-50 text-sky-700 flex items-center gap-2">✏️ Update Solution</button>}
                  {isAdmin && <button onClick={() => { setCardMenu(false); onEdit(p);}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium hover:bg-brand-cream flex items-center gap-2">✏️ Edit</button>}
                  {isAdmin && <button onClick={() => { setCardMenu(false); onDelete(p.id);}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium hover:bg-red-50 text-red-600 flex items-center gap-2">🗑️ Delete</button>}
                  {isAdmin && completed && <button onClick={() => { setCardMenu(false); onEdit({ ...p, _reset: true });}} className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium hover:bg-amber-50 text-amber-700 flex items-center gap-2">↩️ Reset</button>}
                  <div className="h-px bg-brand-muted/30 my-1" />
                  <button onClick={() => setCardMenu(false)} className="w-full text-left px-3.5 py-2 text-[11px] text-gray-400 hover:bg-gray-50">✕ Close</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="text-[14px] font-bold leading-snug text-brand-dark line-clamp-2 group-hover:text-black transition">{p.question}</h3>
        <p className="text-[12.5px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">{p.description}</p>

        <QuestionMediaPreview p={p} />

        {completed && hasSolution && (
          <button onClick={() => onView(p)} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-emerald-200 rounded-xl text-[12.5px] font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm hover:shadow transition">
            <EyeIcon size={15} /> View Answer
          </button>
        )}
        {completed && !hasSolution && (
          <div className="mt-3 text-[11px] font-medium text-gray-400 bg-brand-cream border border-dashed border-brand-muted rounded-xl px-3 py-2 text-center">No answer yet — awaiting solution</div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-1.5 text-[11px] text-gray-500 bg-brand-cream/60 rounded-xl px-3 py-2.5 border border-brand-muted/30">
          <p className="flex items-center justify-between"><span className="text-gray-400">Created</span> <span className="font-semibold text-brand-dark">{fmtDate(p.createdAt)}</span></p>
          <p className="flex items-center justify-between"><span className="text-gray-400">Completed</span> <span className={`font-semibold ${completed ? "text-emerald-700" : "text-gray-400"}`}>{completed ? fmtDate(p.completedAt) : "—"}</span></p>
          {completed && p.nextAvailableAt && <p className="flex items-center justify-between"><span className="text-gray-400">Next</span> <span className="font-semibold text-purple-700">{fmtDate(p.nextAvailableAt)}</span></p>}
          {p.completedByEmail && <p className="truncate text-[10px] text-gray-400">👤 {p.completedByEmail}</p>}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-muted/30">
          <span className="text-[11px] font-mono text-gray-400">#{p.id}</span>
          <div className="flex items-center gap-2">
            {completed && hasSolution && <button onClick={() => onView(p)} className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm transition" title="View Answer"><EyeIcon size={14} /></button>}
            {completed ? <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">Done ✓</span> : <button onClick={() => onSolve(p)} className="text-[12.5px] font-bold bg-brand-dark text-white px-4 py-2 rounded-full shadow-md hover:bg-black hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition">Solve →</button>}
          </div>
        </div>
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
  const [filterStatus, setFilterStatus] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "JavaScript", question: "", description: "", questionType: "practical", solution: "", cooldown: "1day" });
  const [qFiles, setQFiles] = useState({ questionImage: null, questionPdf: null, questionVideo: null });
  const [sFiles, setSFiles] = useState({ solutionImage: null, solutionPdf: null, solutionVideo: null });
  const [qYoutube, setQYoutube] = useState("");
  const [sYoutube, setSYoutube] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [solveTarget, setSolveTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [showPie, setShowPie] = useState(false);
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
      const data = await res.json().catch(() => ({}));
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
      const data = await res.json().catch(() => ({}));
      setDaily(data.data || []);
      setDailyDate(data.date || new Date().toISOString().slice(0, 10));
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
  useEffect(() => {
    const h = () => setMenuId(null);
    window.addEventListener("scroll", h, true);
    return () => window.removeEventListener("scroll", h, true);
  }, []);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return;
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
    if (qYoutube.trim()) fd.append("questionVideoUrl", qYoutube.trim());
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
            const j = await res.json().catch(() => ({}));
            throw new Error(j.message || `HTTP ${res.status}`);
          }
          showToast("PraticalQuestion updated ✓");
        }
      } else {
        res = await fetch(`${API_URL}/api/practices/add`, { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
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
      fetch(`${API_URL}/api/practices/${p.id}/reset`, { method: "PATCH" }).then(() => { showToast("Reset ✓"); refresh(); }).catch((err) => showToast(`Reset failed: ${err?.message}`));
      return;
    }
    setForm({ category: p.category, question: p.question, description: p.description || "", questionType: p.questionType || "practical", solution: p.solution || "", cooldown: p.cooldown || "1day" });
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
        const j = await res.json().catch(() => ({}));
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
    const statusOk = filterStatus === "All" || p.status === filterStatus;
    return catOk && typeOk && statusOk;
  });
  const completedCount = practices.filter((p) => p.status === "completed").length;
  const pendingCount = practices.length - completedCount;

  if (!mounted)
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );

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
          <div className="mb-5 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl text-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
            <span>⚠️ {fetchError} <span className="text-[11px] text-gray-500 ml-1">({apiUrl})</span></span>
            <div className="flex gap-2">
              <button onClick={refresh} className="bg-brand-dark text-white px-4 py-1.5 rounded-full text-[11px] font-bold hover:bg-black transition">Retry</button>
              <span className="text-[11px] text-gray-500 self-center hidden sm:inline">or check BAC terminal</span>
            </div>
          </div>
        )}

        {/* header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-brand-light border border-brand-muted/40 rounded-2xl px-4 py-3.5 shadow-sm">
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-brand-dark flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-[12px]">📝</span>
              PraticalQuestion
              <span className="text-[11px] font-bold bg-brand-dark text-white px-2.5 py-1 rounded-full tracking-wide">{practices.length} total • {completedCount} done</span>
            </h1>
            <p className="text-[11px] text-gray-500 mt-1">Table: <code className="bg-brand-cream border border-brand-muted/40 px-1.5 py-0.5 rounded text-[11px]">PraticalQuestion</code> — question + solution in ONE row</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPie(!showPie)}
              className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-4 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border ${showPie ? "bg-brand-dark text-white border-brand-dark" : "bg-white text-brand-dark border-brand-muted hover:bg-brand-cream"}`}
              title="Toggle status pie chart"
            >
              <PieIcon size={14} /> {showPie ? "Hide Chart" : "Pie"}
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditingId(null);
                    setForm({ category: "JavaScript", question: "", description: "", questionType: "practical", solution: "", cooldown: "1day" });
                    setQFiles({ questionImage: null, questionPdf: null, questionVideo: null });
                    setSFiles({ solutionImage: null, solutionPdf: null, solutionVideo: null });
                    setQYoutube(""); setSYoutube("");
                  }
                }}
                className={`text-[13px] font-bold px-5 py-2.5 rounded-full shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${showForm ? "bg-white border border-brand-muted text-brand-dark hover:bg-brand-cream" : "bg-brand-dark text-white hover:bg-black"}`}
              >
                {showForm ? "✕ Close" : editingId ? "✏️ Editing" : "+ Add PraticalQuestion"}
              </button>
            )}
          </div>
        </div>

        {isAdmin && showForm && (
          <div className="bg-brand-light border border-brand-muted/40 rounded-[20px] p-6 mb-6 shadow-md animate-fade-in">
            <h2 className="text-[15px] font-bold tracking-tight text-brand-dark">{editingId ? "Edit" : "Add"} PraticalQuestion</h2>
            <p className="text-[11px] text-gray-500 mb-4">Same PraticalQuestion table • Q img/pdf/vid + Sol img/pdf/vid • YouTube supported • 1 day / 1 week cooldown</p>
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold tracking-wide text-brand-dark uppercase mb-1.5 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3.5 py-2.5 border border-brand-muted bg-white rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15">
                    {PRACTICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-wide text-brand-dark uppercase mb-1.5 block">Type *</label>
                  <select value={form.questionType} onChange={(e) => setForm({ ...form, questionType: e.target.value })} className="w-full px-3.5 py-2.5 border border-brand-muted bg-white rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15">
                    {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-wide text-brand-dark uppercase mb-1.5 block">Cooldown *</label>
                  <select value={form.cooldown} onChange={(e) => setForm({ ...form, cooldown: e.target.value })} className="w-full px-3.5 py-2.5 border border-brand-muted bg-white rounded-xl text-[13px] focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15">
                    <option value="1day">⏰ 1 Day</option>
                    <option value="1week">📅 1 Week</option>
                  </select>
                </div>
              </div>
              <input placeholder="Question *" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required className="w-full px-3.5 py-3 border border-brand-muted bg-white rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15" />
              <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3.5 py-3 border border-brand-muted bg-white rounded-xl text-[13px] placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none" />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-brand-muted/40 rounded-2xl p-4 bg-brand-cream">
                  <p className="text-[12px] font-bold text-brand-dark mb-3 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-white border border-brand-muted flex items-center justify-center text-[11px]">❓</span> Question Media</p>
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between border border-dashed border-brand-muted bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-brand-light transition">
                      <span className="text-[12px] font-medium text-brand-dark">🖼️ Image {qFiles.questionImage?.name && <span className="text-emerald-700 text-[10px] font-semibold">{qFiles.questionImage.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-brand-dark text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setQFiles({ ...qFiles, questionImage: e.target.files[0] })} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed border-brand-muted bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-brand-light transition">
                      <span className="text-[12px] font-medium text-brand-dark">📄 PDF {qFiles.questionPdf?.name && <span className="text-emerald-700 text-[10px] font-semibold">{qFiles.questionPdf.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-brand-dark text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setQFiles({ ...qFiles, questionPdf: e.target.files[0] })} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed border-brand-muted bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-brand-light transition">
                      <span className="text-[12px] font-medium text-brand-dark">🎥 Video {qFiles.questionVideo?.name && <span className="text-emerald-700 text-[10px] font-semibold">{qFiles.questionVideo.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-brand-dark text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setQFiles({ ...qFiles, questionVideo: e.target.files[0] })} />
                    </label>
                    <div className="pt-1">
                      <label className="text-[11px] font-semibold text-brand-dark">▶️ YouTube Link (question)</label>
                      <input value={qYoutube} onChange={(e) => setQYoutube(e.target.value)} placeholder="https://youtu.be/... or youtube.com/watch?v=..." className="w-full mt-1.5 px-3.5 py-2.5 border border-brand-muted bg-white rounded-xl text-[12px] placeholder:text-gray-400 focus:outline-none focus:border-brand-orange" />
                      {qYoutube && isYoutube(qYoutube) && <div className="mt-2"><YoutubePreview url={qYoutube} /></div>}
                    </div>
                  </div>
                </div>
                <div className="border border-emerald-100 rounded-2xl p-4 bg-emerald-50/40">
                  <p className="text-[12px] font-bold text-emerald-800 mb-3 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">✓</span> Solution Media + Text</p>
                  <textarea placeholder="Solution text (optional)" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={2} className="w-full px-3.5 py-2.5 border border-emerald-100 bg-white rounded-xl text-[12px] placeholder:text-gray-400 focus:outline-none focus:border-emerald-300 resize-none mb-3" />
                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between border border-dashed border-emerald-200 bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-emerald-50/50 transition">
                      <span className="text-[12px] font-medium text-brand-dark">🖼️ Sol Image {sFiles.solutionImage?.name && <span className="text-emerald-700 text-[10px] font-semibold">{sFiles.solutionImage.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-emerald-700 text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setSFiles({ ...sFiles, solutionImage: e.target.files[0] })} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed border-emerald-200 bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-emerald-50/50 transition">
                      <span className="text-[12px] font-medium text-brand-dark">📄 Sol PDF {sFiles.solutionPdf?.name && <span className="text-emerald-700 text-[10px] font-semibold">{sFiles.solutionPdf.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-emerald-700 text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setSFiles({ ...sFiles, solutionPdf: e.target.files[0] })} />
                    </label>
                    <label className="flex items-center justify-between border border-dashed border-emerald-200 bg-white rounded-xl px-3.5 py-2.5 cursor-pointer hover:bg-emerald-50/50 transition">
                      <span className="text-[12px] font-medium text-brand-dark">🎥 Sol Video {sFiles.solutionVideo?.name && <span className="text-emerald-700 text-[10px] font-semibold">{sFiles.solutionVideo.name}</span>}</span>
                      <span className="text-[11px] font-bold bg-emerald-700 text-white px-3 py-1 rounded-full">Browse</span>
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setSFiles({ ...sFiles, solutionVideo: e.target.files[0] })} />
                    </label>
                    <div>
                      <label className="text-[11px] font-semibold text-emerald-800">▶️ YouTube Link (solution)</label>
                      <input value={sYoutube} onChange={(e) => setSYoutube(e.target.value)} placeholder="https://youtu.be/... or youtube.com/watch?v=..." className="w-full mt-1.5 px-3.5 py-2.5 border border-emerald-100 bg-white rounded-xl text-[12px] placeholder:text-gray-400 focus:outline-none focus:border-emerald-300" />
                      {sYoutube && isYoutube(sYoutube) && <div className="mt-2"><YoutubePreview url={sYoutube} /></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="bg-brand-dark text-white px-7 py-3 rounded-xl text-[13px] font-bold shadow-md hover:bg-black hover:shadow-lg transition">{editingId ? "Update Row" : "Create Row — PraticalQuestion"}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ category: "JavaScript", question: "", description: "", questionType: "practical", solution: "", cooldown: "1day" }); setQYoutube(""); setSYoutube(""); }} className="bg-white border border-brand-muted px-6 py-3 rounded-xl text-[13px] font-semibold hover:bg-brand-cream transition">Cancel</button>}
              </div>
            </form>
          </div>
        )}

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-brand-light border border-brand-muted/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-tan to-brand-orange opacity-60 group-hover:opacity-100 transition" />
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">PraticalQuestion rows</p>
            <p className="text-[22px] font-bold tracking-tight text-brand-dark mt-1">{practices.length}</p>
            <p className="text-[11px] text-gray-400 mt-1">All questions</p>
          </div>
          <div className="bg-brand-light border border-brand-muted/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-600 opacity-60 group-hover:opacity-100 transition" />
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">Daily 2 • {dailyDate}</p>
            <p className="text-[22px] font-bold tracking-tight text-brand-dark mt-1">{daily.length} / 2</p>
            <p className="text-[11px] text-gray-400 mt-1">Today rotation</p>
          </div>
          <div className="bg-brand-light border border-brand-muted/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-600 opacity-60 group-hover:opacity-100 transition" />
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">Completed</p>
            <p className="text-[22px] font-bold tracking-tight text-emerald-700 mt-1">{completedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">Done</p>
          </div>
          <div className="bg-brand-light border border-brand-muted/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-brand-dark opacity-60 group-hover:opacity-100 transition" />
            <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">Pending</p>
            <p className="text-[22px] font-bold tracking-tight text-brand-dark mt-1">{practices.length - completedCount}</p>
            <p className="text-[11px] text-gray-400 mt-1">To do</p>
          </div>
        </div>

        {/* common pie — only when pi button clicked, otherwise hidden */}
        {showPie && (
          <div className="mb-6 bg-brand-light border border-brand-muted/40 rounded-2xl p-5 shadow-sm animate-fade-in relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-tan via-brand-orange to-brand-dark opacity-60" />
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="text-[13px] font-bold tracking-tight text-brand-dark flex items-center gap-2"><PieIcon size={14} /> Status Overview — Completed vs Pending</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Using CommonPieChart • total {practices.length} • tap segment for detail</p>
              </div>
              <button onClick={() => setShowPie(false)} className="w-8 h-8 rounded-full bg-white border border-brand-muted hover:bg-brand-cream flex items-center justify-center text-gray-500 transition" title="Close chart">✕</button>
            </div>
            {practices.length === 0 ? (
              <p className="text-[12px] text-gray-400 text-center py-10">No data — add PraticalQuestion first</p>
            ) : (
              <>
                <div className="w-full h-[300px]">
                  <CommonPieChart
                    data={[
                      { name: "Completed", value: completedCount },
                      { name: "Pending", value: practices.length - completedCount },
                    ]}
                    centerLabel="Status"
                    height={300}
                    colors={["#16a34a", "#8B7355"]}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] inline-block" /> Completed — {completedCount} ({practices.length ? ((completedCount / practices.length) * 100).toFixed(1) : 0}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-brand-cream border border-brand-muted text-brand-dark px-3 py-1 rounded-full">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B7355] inline-block" /> Pending — {practices.length - completedCount} ({practices.length ? (((practices.length - completedCount) / practices.length) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-brand-light border border-brand-muted/40 rounded-[20px] p-4 h-64 animate-pulse"><div className="h-4 bg-brand-cream rounded w-3/4" /><div className="h-3 bg-brand-cream rounded w-full mt-3" /><div className="h-24 bg-brand-cream rounded-xl mt-4" /></div>)}
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-bold tracking-tight text-brand-dark flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-tan to-brand-orange text-white flex items-center justify-center text-[12px] shadow-sm">🔥</span> Daily 2 — {dailyDate}</h2>
                <span className="text-[11px] font-semibold bg-white border border-brand-muted/40 px-2.5 py-1 rounded-full text-gray-600">{daily.length} items</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {daily.map((p) => (
                  <div key={p.id} className={`bg-brand-light border-2 rounded-[20px] p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden ${p.status === "completed" ? "border-emerald-100" : "border-brand-muted/40"}`}>
                    <div className={`absolute inset-x-0 top-0 h-1 ${p.status === "completed" ? "bg-gradient-to-r from-emerald-400 to-green-600" : "bg-gradient-to-r from-brand-tan to-brand-orange"}`} />
                    <div className="flex gap-1.5 mb-3">
                      <span className="text-[10px] font-bold tracking-wide bg-white border border-brand-muted/60 px-2.5 py-1 rounded-full shadow-sm text-brand-dark">{p.category}</span>
                      <span className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border shadow-sm ${p.questionType === "theory" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>{p.questionType}</span>
                      <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border ${p.status === "completed" ? "bg-emerald-600 text-white border-emerald-600" : "bg-amber-400 text-brand-dark border-amber-400"}`}>{p.status}</span>
                    </div>
                    <h3 className="text-[14px] font-bold leading-snug text-brand-dark">{p.question}</h3>
                    <p className="text-[12.5px] text-gray-600 mt-1.5 leading-relaxed line-clamp-2">{p.description}</p>
                    <QuestionMediaPreview p={p} />
                    {p.status === "completed" && (p.solution || p.solutionImage || p.solutionPdf || p.solutionVideo) && (
                      <button onClick={() => setViewTarget(p)} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-emerald-200 rounded-xl text-[12.5px] font-bold text-emerald-700 hover:bg-emerald-50 shadow-sm transition"><EyeIcon size={15} /> View Answer</button>
                    )}
                    <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-2"><span>📅 {fmtDate(p.createdAt)}</span><span>•</span><span>✅ {p.completedAt ? fmtDate(p.completedAt) : "—"}</span></p>
                    <div className="mt-3">
                      {p.status === "completed" ? (
                        <div className="flex gap-2">
                          <span className="flex-1 inline-flex items-center justify-center gap-1.5 text-emerald-700 font-bold text-[13px] bg-emerald-50 border border-emerald-200 rounded-xl py-2">✓ Completed</span>
                          {(p.solution || p.solutionImage || p.solutionPdf || p.solutionVideo) && <button onClick={() => setViewTarget(p)} className="w-10 h-10 rounded-xl bg-white border border-emerald-200 hover:bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-sm transition" title="View Answer"><EyeIcon size={16} /></button>}
                        </div>
                      ) : (
                        <button onClick={() => setSolveTarget(p)} className="w-full bg-brand-dark text-white py-2.5 rounded-xl text-[13px] font-bold shadow-md hover:bg-black hover:shadow-lg transition">Solve + Upload Solution →</button>
                      )}
                    </div>
                  </div>
                ))}
                {daily.length === 0 && <div className="col-span-2 bg-brand-light border border-dashed border-brand-muted rounded-2xl p-10 text-center text-sm text-gray-400">No questions — add first PraticalQuestion</div>}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-brand-light border border-brand-muted/40 rounded-2xl px-4 py-3 shadow-sm">
              <div>
                <h2 className="text-[14px] font-bold tracking-tight text-brand-dark flex items-center gap-2">All PraticalQuestion <span className="ml-1 text-[11px] font-bold bg-brand-dark text-white px-2.5 py-1 rounded-full">{filtered.length}</span> <span className="text-[10px] font-medium text-gray-400 hidden sm:inline">• cards + table share same filters</span></h2>
                <p className="text-[11px] text-gray-500 mt-0.5 hidden sm:block">Filtered by: <span className="font-semibold text-brand-dark">{filterCat}</span> • <span className="font-semibold text-brand-dark">{filterType}</span> • <span className={`font-semibold ${filterStatus==='pending'?'text-amber-600':filterStatus==='completed'?'text-emerald-600':'text-brand-dark'}`}>{filterStatus}</span> {filterStatus==='pending' && "— showing only pending (Solve) cards as in screenshot"}</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="text-[12px] font-medium bg-white border border-brand-muted rounded-full px-3.5 py-2 focus:outline-none focus:border-brand-orange shadow-sm">
                  <option value="All">All Category</option>{PRACTICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="text-[12px] font-medium bg-white border border-brand-muted rounded-full px-3.5 py-2 focus:outline-none focus:border-brand-orange shadow-sm">
                  <option value="All">All Types</option><option value="practical">🛠️ Practical</option><option value="theory">📖 Theory</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`text-[12px] font-bold rounded-full px-3.5 py-2 focus:outline-none shadow-sm border ${filterStatus==='pending'?'bg-amber-50 border-amber-200 text-amber-700':filterStatus==='completed'?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-white border-brand-muted text-brand-dark'}`}>
                  <option value="All">All Status</option><option value="pending">● Pending only</option><option value="completed">✓ Completed only</option>
                </select>
                {(filterCat !== "All" || filterType !== "All" || filterStatus !== "All") && (
                  <button onClick={() => { setFilterCat("All"); setFilterType("All"); setFilterStatus("All"); }} className="text-[11px] font-bold bg-brand-dark text-white px-3.5 py-2 rounded-full hover:bg-black transition">Clear</button>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => <PracticeCard key={p.id} p={p} onSolve={setSolveTarget} onView={setViewTarget} onEdit={startEdit} onDelete={handleDelete} isAdmin={isAdmin} />)}
            </div>
            {filtered.length === 0 && (
              <div className="bg-brand-light border border-dashed border-brand-muted rounded-2xl p-8 text-center mt-4">
                <p className="text-[13px] font-semibold text-gray-600">No {filterStatus !== "All" ? filterStatus : ""} questions for {filterCat} / {filterType}</p>
                <p className="text-[11px] text-gray-400 mt-1">Cards + table share the same filters — change Category (JS/HTML...), Type (Practical/Theory) or Status above to see other cards. Currently showing <span className="font-bold">{filterStatus}</span>.</p>
                <button onClick={() => { setFilterCat("All"); setFilterType("All"); setFilterStatus("All"); }} className="mt-3 text-[11px] font-bold bg-brand-dark text-white px-4 py-2 rounded-full">Show All</button>
              </div>
            )}

            <div className="mt-8 bg-brand-light border border-brand-muted/40 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-brand-cream border-b border-brand-muted/40 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-bold tracking-tight text-brand-dark flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-[10px]">≡</span> PraticalQuestion Table — Single Table</span>
                <span className="text-[11px] font-medium bg-white border border-brand-muted px-2.5 py-1 rounded-full text-gray-500">⋮ menu → View / Solve / Edit • YouTube</span>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-[11px]">
                  <thead className="bg-brand-cream/70 text-brand-dark/70">
                    <tr><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">#</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Cat</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Type</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Cooldown</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Question</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Q Media</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Sol Media</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Created</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Completed</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Next</th><th className="px-3 py-2.5 text-left font-bold tracking-wide uppercase text-[10px]">Status</th><th className="px-3 py-2.5 text-right font-bold tracking-wide uppercase text-[10px]">⋮</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-t border-brand-muted/20 hover:bg-brand-cream/40 transition">
                        <td className="px-3 py-2.5 font-mono text-gray-500">{p.id}</td>
                        <td className="px-3 py-2.5"><span className="bg-white border border-brand-muted/60 px-2 py-1 rounded-full text-[11px] font-semibold text-brand-dark whitespace-nowrap">{p.category}</span></td>
                        <td className="px-3 py-2.5"><span className={`px-2 py-1 rounded-full border text-[10px] font-bold ${p.questionType === "theory" ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>{p.questionType}</span></td>
                        <td className="px-3 py-2.5"><span className={`text-[10px] px-2 py-1 rounded-full border font-bold ${p.cooldown === "1week" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.cooldown || "1day"}</span></td>
                        <td className="px-3 py-2.5 max-w-[200px]"><p className="truncate font-semibold text-brand-dark text-[12px]">{p.question}</p><p className="truncate text-gray-500 text-[10px]">{p.description}</p></td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{[p.questionImage && "🖼️", p.questionPdf && "📄", p.questionVideo && (isYoutube(p.questionVideo) ? "▶️" : "🎥")].filter(Boolean).join(" ") || <span className="text-gray-300">—</span>}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {(p.solution || p.solutionImage || p.solutionPdf || p.solutionVideo) ? (
                            <button onClick={() => setViewTarget(p)} className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full text-[11px] font-bold hover:bg-emerald-100 transition"><EyeIcon size={12} /> View</button>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">{fmtShort(p.createdAt)}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">{p.completedAt ? fmtShort(p.completedAt) : "—"}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap text-gray-600">{p.nextAvailableAt ? fmtShort(p.nextAvailableAt) : "—"}</td>
                        <td className="px-3 py-2.5"><span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold whitespace-nowrap ${p.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.status}</span></td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              if (menuId === p.id) { setMenuId(null); return; }
                              const r = e.currentTarget.getBoundingClientRect();
                              setMenuPos({ left: r.right - 160, top: r.bottom + 6 });
                              setMenuId(p.id);
                            }}
                            className="w-8 h-8 rounded-full bg-white border border-brand-muted/60 hover:bg-brand-cream flex items-center justify-center shadow-sm transition"
                          >
                            <span className="text-[14px] leading-none">⋮</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={12} className="text-center py-8 text-gray-400">No rows — add question via + Add PraticalQuestion</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {solveTarget && <SolveModal practice={solveTarget} user={user} onClose={() => setSolveTarget(null)} onSubmit={handleSolveSubmit} />}
        {viewTarget && <ViewAnswerModal practice={viewTarget} onClose={() => setViewTarget(null)} />}
        {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[12px] font-medium px-5 py-2.5 rounded-full shadow-xl border border-white/10 animate-slide-up z-50">{toast}</div>}
      </div>

      {menuId && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuId(null)} />
          <div className="fixed z-50 bg-white border border-brand-muted/40 rounded-2xl shadow-2xl w-44 py-1.5 animate-scale-in overflow-hidden" style={{ left: menuPos.left, top: menuPos.top }}>
            {(() => { const mp = practices.find((x) => x.id === menuId); if (!mp) return null; const completed = mp.status === "completed"; const hasSol = mp.solution || mp.solutionImage || mp.solutionPdf || mp.solutionVideo;
              return (
                <>
                  {!completed && <button onClick={() => { setMenuId(null); setSolveTarget(mp); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium hover:bg-brand-cream text-left">✅ Solve</button>}
                  {completed && hasSol && <button onClick={() => { setMenuId(null); setViewTarget(mp); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-50 text-left"><EyeIcon size={14} /> View Answer</button>}
                  {completed && <button onClick={() => { setMenuId(null); setSolveTarget({ ...mp }); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-sky-700 hover:bg-sky-50 text-left">✏️ Update Solution</button>}
                  {isAdmin && <button onClick={() => { setMenuId(null); startEdit(mp); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium hover:bg-brand-cream text-left">✏️ Edit</button>}
                  {isAdmin && <button onClick={() => handleDelete(mp.id)} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-red-600 hover:bg-red-50 text-left">🗑️ Delete</button>}
                  {isAdmin && completed && <button onClick={() => { setMenuId(null); startEdit({ ...mp, _reset: true }); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-medium text-amber-700 hover:bg-amber-50 text-left">↩️ Reset</button>}
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
