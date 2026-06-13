"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Sparkles, Download, ExternalLink, Loader2,
  CheckCircle2, AlertCircle, Lightbulb, Target, TrendingUp,
  Zap, Star, ChevronRight, RefreshCw, Eye, Palette,
  Link2, Upload, X, File, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

// ── Template definitions ────────────────────────────────────────────────────

type TemplateName = "Technical" | "Minimal" | "Creative" | "Executive"

const TEMPLATES: { name: TemplateName; desc: string; accent: string }[] = [
  { name: "Technical",  desc: "Data-forward layout for software & engineering roles", accent: "#6366f1" },
  { name: "Minimal",    desc: "Clean, whitespace-driven — ATS-friendly & easy to scan", accent: "#0ea5e9" },
  { name: "Creative",   desc: "Sidebar layout with colour accents for design/product roles", accent: "#f59e0b" },
  { name: "Executive",  desc: "Bold headings, achievement-focused — great for leadership", accent: "#10b981" },
]

// ── HTML builders ───────────────────────────────────────────────────────────

function buildTechnicalHTML(s: any): string {
  const platforms = Object.entries(s.linkedPlatforms ?? {})
    .filter(([, v]: any) => v?.username)
    .map(([pid, pd]: any) => {
      const st = pd.stats ?? {}
      const solved = st.totalSolved ?? st.problemsSolved ?? 0
      const rating = st.rating ?? st.currentRating ?? 0
      return `<div class="pr"><span class="pn">${pid.charAt(0).toUpperCase()+pid.slice(1)}</span><span class="pu">@${pd.username}</span>${solved?`<span class="ps">${solved} solved</span>`:""}${rating?`<span class="ps">Rating ${rating}</span>`:""}</div>`
    }).join("")
  const skills = (s.skills ?? []).map((sk: string) => `<span class="sk">${sk}</span>`).join("")
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${s.name??""} — Resume</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e1e2e;font-size:13px;line-height:1.55}.page{max-width:820px;margin:0 auto;padding:40px 44px}.hdr{border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:20px}.name{font-size:26px;font-weight:800;color:#6366f1}.tag{font-size:13px;color:#555;margin-top:2px}.cr{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;font-size:12px;color:#555}.cr a{color:#6366f1;text-decoration:none}h2{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#6366f1;margin:18px 0 8px;padding-bottom:3px;border-bottom:1px solid #e5e5f0}.ir{display:flex;gap:6px;font-size:12.5px;margin-bottom:4px}.il{color:#888;min-width:90px}.iv{color:#1e1e2e;font-weight:500}.pr{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px}.pr:last-child{border-bottom:none}.pn{font-weight:700;color:#6366f1;min-width:100px}.pu{color:#555}.ps{background:#f0f0ff;color:#6366f1;padding:1px 7px;border-radius:99px;font-size:11px}.skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.sk{background:#f0f0ff;color:#6366f1;padding:3px 10px;border-radius:99px;font-size:11.5px;font-weight:500}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
</head><body><div class="page">
<div class="hdr"><div class="name">${s.name??""}</div><div class="tag">${s.degree??"B.Tech"} · ${s.branch??""} · Class of ${s.graduationYear??""}</div>
<div class="cr">${s.email?`<span>${s.email}</span>`:""}${s.phone?`<span>${s.phone}</span>`:""}${s.location?`<span>${s.location}</span>`:""}${s.linkedinUrl?`<a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`<a href="${s.githubUrl}">GitHub</a>`:""}${s.portfolioUrl?`<a href="${s.portfolioUrl}">Portfolio</a>`:""}
</div></div>
${s.bio?`<h2>About</h2><p style="font-size:12.5px;color:#444;line-height:1.65">${s.bio}</p>`:""}
<h2>Education</h2>
<div class="ir"><span class="il">Institution</span><span class="iv">${s.collegeName??s.collegeCode??""}</span></div>
<div class="ir"><span class="il">Degree</span><span class="iv">${s.degree??"B.Tech"} in ${s.branch??""}</span></div>
<div class="ir"><span class="il">Graduation</span><span class="iv">${s.graduationYear??""}</span></div>
${s.rollNumber?`<div class="ir"><span class="il">Roll No</span><span class="iv">${s.rollNumber}</span></div>`:""}
${skills?`<h2>Technical Skills</h2><div class="skills">${skills}</div>`:""}
${platforms?`<h2>Coding Platforms</h2>${platforms}`:""}
</div></body></html>`
}

function buildMinimalHTML(s: any): string {
  const pl = Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username)
    .map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;const rt=st.rating??st.currentRating??0;return`<li><strong>${pid.charAt(0).toUpperCase()+pid.slice(1)}</strong> · @${pd.username}${sv?` · ${sv} problems`:""}${rt?` · rating ${rt}`:""}</li>`}).join("")
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${s.name??""}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,'Times New Roman',serif;color:#222;font-size:13.5px;line-height:1.6}.page{max-width:760px;margin:0 auto;padding:50px}h1{font-size:28px;font-weight:400;letter-spacing:2px;text-transform:uppercase}.sub{font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}.contact{font-size:12px;color:#555;margin-bottom:24px;border-bottom:1px solid #ddd;padding-bottom:10px}.contact a{color:#333;text-decoration:none}h2{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin:22px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}p,li{font-size:13px;color:#333;margin-bottom:4px}ul{padding-left:18px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
</head><body><div class="page">
<h1>${s.name??""}</h1><div class="sub">${s.degree??"B.Tech"} · ${s.branch??""}</div>
<div class="contact">${[s.email,s.phone,s.location].filter(Boolean).join("  ·  ")}${s.linkedinUrl?`  ·  <a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`  ·  <a href="${s.githubUrl}">GitHub</a>`:""}</div>
${s.bio?`<h2>Profile</h2><p>${s.bio}</p>`:""}
<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong></p>
<p>${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p>
${(s.skills??[]).length?`<h2>Skills</h2><p>${(s.skills??[]).join(" · ")}</p>`:""}
${pl?`<h2>Coding</h2><ul>${pl}</ul>`:""}
</div></body></html>`
}

function buildCreativeHTML(s: any): string {
  const skills = (s.skills??[]).map((sk:string)=>`<span style="display:block;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:12px">${sk}</span>`).join("")
  const pl = Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username)
    .map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;return`<div style="margin-bottom:6px"><strong style="color:#f59e0b">${pid.charAt(0).toUpperCase()+pid.slice(1)}</strong><br><span style="font-size:11px;color:#ccc">@${pd.username}${sv?` · ${sv} solved`:""}</span></div>`}).join("")
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${s.name??""}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#333;font-size:13px}.wrapper{display:flex;min-height:100vh;max-width:820px;margin:0 auto}.sidebar{width:230px;background:#1e1e2e;color:#fff;padding:32px 22px;flex-shrink:0}.main{flex:1;padding:36px 34px}.av{width:72px;height:72px;border-radius:50%;background:#f59e0b;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;margin-bottom:14px}.sidebar h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}.role{font-size:11px;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;margin-bottom:20px}.ss{margin-top:20px}.st{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#f59e0b;margin-bottom:8px;font-weight:700}.ci{font-size:11px;color:#bbb;margin-bottom:5px;word-break:break-all}.ci a{color:#f59e0b;text-decoration:none}.main h2{font-size:15px;font-weight:700;color:#1e1e2e;border-left:3px solid #f59e0b;padding-left:10px;margin:20px 0 10px}.main h2:first-child{margin-top:0}p,li{font-size:12.5px;line-height:1.65;margin-bottom:4px}ul{padding-left:18px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.wrapper{min-height:unset}}</style>
</head><body><div class="wrapper">
<div class="sidebar"><div class="av">${(s.name??"?")[0].toUpperCase()}</div><h1>${s.name??""}</h1><div class="role">${s.branch??"Engineering"}</div>
<div class="ss"><div class="st">Contact</div>${s.email?`<div class="ci">${s.email}</div>`:""}${s.phone?`<div class="ci">${s.phone}</div>`:""}${s.location?`<div class="ci">${s.location}</div>`:""}${s.linkedinUrl?`<div class="ci"><a href="${s.linkedinUrl}">LinkedIn</a></div>`:""}${s.githubUrl?`<div class="ci"><a href="${s.githubUrl}">GitHub</a></div>`:""}</div>
${skills?`<div class="ss"><div class="st">Skills</div>${skills}</div>`:""}
${pl?`<div class="ss"><div class="st">Coding</div>${pl}</div>`:""}
</div>
<div class="main">
${s.bio?`<h2>Profile</h2><p>${s.bio}</p>`:""}
<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong></p>
<p>${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p>
${s.rollNumber?`<p>Roll No: ${s.rollNumber}</p>`:""}
</div></div></body></html>`
}

function buildExecutiveHTML(s: any): string {
  const pl = Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username)
    .map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;const rt=st.rating??st.currentRating??0;return`<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#10b981">${pid.charAt(0).toUpperCase()+pid.slice(1)}</td><td style="padding:4px 12px;color:#555">@${pd.username}</td><td style="padding:4px 0;color:#888">${sv?`${sv} solved`:""}${rt?(sv?" · ":"")+`Rating ${rt}`:""}</td></tr>`}).join("")
  const skills = (s.skills??[]).map((sk:string)=>`<span style="display:inline-block;margin:2px 4px;padding:3px 12px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:99px;font-size:12px;color:#065f46">${sk}</span>`).join("")
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${s.name??""}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#111;font-size:13px;line-height:1.6}.page{max-width:820px;margin:0 auto;padding:44px 50px}.hdr{text-align:center;border-bottom:2px solid #10b981;padding-bottom:20px;margin-bottom:24px}.name{font-size:32px;font-weight:900;color:#111;letter-spacing:-1px}.tag{font-size:13px;color:#666;margin-top:4px}.cr{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:12px;color:#555}.cr a{color:#10b981;text-decoration:none}h2{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#111;margin:22px 0 10px;display:flex;align-items:center;gap:8px}h2::after{content:"";flex:1;height:1px;background:#e5e7eb}p,li{font-size:12.5px;color:#333;margin-bottom:5px}table{width:100%;border-collapse:collapse}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
</head><body><div class="page">
<div class="hdr"><div class="name">${s.name??""}</div><div class="tag">${s.degree??"B.Tech"} in ${s.branch??""} · ${s.collegeName??s.collegeCode??""} · Class of ${s.graduationYear??""}</div>
<div class="cr">${s.email?`<span>${s.email}</span>`:""}${s.phone?`<span>${s.phone}</span>`:""}${s.location?`<span>${s.location}</span>`:""}${s.linkedinUrl?`<a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`<a href="${s.githubUrl}">GitHub</a>`:""}${s.portfolioUrl?`<a href="${s.portfolioUrl}">Portfolio</a>`:""}
</div></div>
${s.bio?`<h2>Professional Summary</h2><p>${s.bio}</p>`:""}
<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong> · ${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p>
${skills?`<h2>Core Skills</h2><div style="margin-top:4px">${skills}</div>`:""}
${pl?`<h2>Competitive Programming</h2><table>${pl}</table>`:""}
</div></body></html>`
}

function getTemplateHTML(name: TemplateName, student: any): string {
  if (name === "Minimal")   return buildMinimalHTML(student)
  if (name === "Creative")  return buildCreativeHTML(student)
  if (name === "Executive") return buildExecutiveHTML(student)
  return buildTechnicalHTML(student)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  high:   "bg-red-500/10 text-red-600 border-red-400/30",
  medium: "bg-amber-500/10 text-amber-600 border-amber-400/30",
  low:    "bg-blue-500/10 text-blue-600 border-blue-400/30",
}

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

const ALLOWED_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]
const ALLOWED_EXT  = [".pdf", ".doc", ".docx", ".txt"]

// ── Upload section component ─────────────────────────────────────────────────

function ResumeUpload({
  resumeUrl, resumeFile, onSaved,
}: {
  resumeUrl?: string
  resumeFile?: { fileName: string; sizeBytes: number; uploadedAt: string; mimeType: string } | null
  onSaved: (data: { resumeUrl?: string; resumeFile?: any }) => void
}) {
  const [tab, setTab] = useState<"link" | "file">(resumeFile ? "file" : "link")
  const [link, setLink] = useState(resumeUrl ?? "")
  const [savingLink, setSavingLink] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // ── link save ──
  const saveLink = async () => {
    const url = link.trim()
    if (!url) return
    setSavingLink(true)
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: url }),
      })
      const data = await res.json()
      if (data.success) { toast.success("Resume link saved"); onSaved({ resumeUrl: url }) }
      else toast.error(data.error ?? "Failed to save")
    } catch { toast.error("Network error") }
    finally { setSavingLink(false) }
  }

  const removeLink = async () => {
    setSavingLink(true)
    try {
      await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl: "" }),
      })
      setLink("")
      onSaved({ resumeUrl: "" })
      toast.success("Link removed")
    } catch { toast.error("Network error") }
    finally { setSavingLink(false) }
  }

  // ── file upload ──
  const uploadFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.some(e => file.name.toLowerCase().endsWith(e))) {
      toast.error("Only PDF, DOC, DOCX or TXT files are supported"); return
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large — max 5 MB"); return }

    setUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetch("/api/student/resume-upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.success) {
        toast.success("Resume uploaded!")
        onSaved({ resumeFile: { fileName: data.fileName, sizeBytes: data.sizeBytes, mimeType: data.mimeType, uploadedAt: new Date().toISOString() } })
      } else {
        toast.error(data.error ?? "Upload failed")
      }
    } catch { toast.error("Network error") }
    finally { setUploading(false) }
  }

  const removeFile = async () => {
    setRemoving(true)
    try {
      const res = await fetch("/api/student/resume-upload", { method: "DELETE" })
      const data = await res.json()
      if (data.success) { toast.success("File removed"); onSaved({ resumeFile: null }) }
      else toast.error(data.error ?? "Failed")
    } catch { toast.error("Network error") }
    finally { setRemoving(false) }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }, [])

  const fileIcon = (mime: string) => {
    if (mime?.includes("pdf")) return "📄"
    if (mime?.includes("word") || mime?.includes("doc")) return "📝"
    return "📃"
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Upload Resume</h2>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted mb-4">
        {([["link", Link2, "Resume Link"], ["file", Upload, "Upload File"]] as const).map(([t, Icon, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Link tab */}
      {tab === "link" && (
        <div className="space-y-3">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
              placeholder="https://drive.google.com/... or dropbox.com/..."
              value={link}
              onChange={e => setLink(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveLink()}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Paste a public link — Google Drive, Dropbox, OneDrive, personal site, etc.
          </p>

          {/* Current saved link */}
          {resumeUrl && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:underline truncate flex-1 flex items-center gap-1">
                {resumeUrl} <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <button onClick={removeLink} disabled={savingLink}
                className="text-muted-foreground hover:text-red-500 transition-colors p-0.5">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <Button onClick={saveLink} disabled={savingLink || !link.trim()}
            className="w-full rounded-xl gap-2">
            {savingLink ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><CheckCircle2 className="h-4 w-4" />Save Link</>}
          </Button>
        </div>
      )}

      {/* File tab */}
      {tab === "file" && (
        <div className="space-y-3">
          {/* Existing file */}
          {resumeFile && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-2xl shrink-0">{fileIcon(resumeFile.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{resumeFile.fileName}</p>
                <p className="text-[10px] text-muted-foreground">
                  {fmtBytes(resumeFile.sizeBytes)} · uploaded {new Date(resumeFile.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <a href="/api/student/resume-download" download={resumeFile.fileName}
                className="text-xs text-primary border border-primary/30 rounded-lg px-2 py-1 hover:bg-primary/5 transition-colors">
                <Download className="h-3.5 w-3.5" />
              </a>
              <button onClick={removeFile} disabled={removing}
                className="text-muted-foreground hover:text-red-500 transition-colors p-0.5">
                {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              dragging
                ? "border-primary bg-primary/8 scale-[1.01]"
                : "border-border hover:border-primary/40 hover:bg-primary/3"
            }`}
          >
            {uploading ? (
              <><Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-medium">Uploading…</p></>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    {resumeFile ? "Replace file" : "Drop your resume here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    or <span className="text-primary">browse</span> · PDF, DOC, DOCX, TXT · max 5 MB
                  </p>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = "" }} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export function ResumeClient({ student: initialStudent, autoAnalyze = false }: { student: any; autoAnalyze?: boolean }) {
  const [student, setStudent] = useState<any>(initialStudent)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("Technical")
  const [analysis, setAnalysis] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")

  const hasAnyResume = !!(student?.resumeUrl || student?.resumeFile)

  // Auto-trigger AI analysis when arriving from profile "Analyse" button
  useEffect(() => {
    if (autoAnalyze && !analysis && !aiLoading) {
      runAI()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAnalyze])

  const handleSaved = (data: { resumeUrl?: string; resumeFile?: any }) => {
    setStudent((prev: any) => ({ ...prev, ...data }))
  }

  const runAI = async () => {
    setAiLoading(true); setAiError("")
    try {
      const res = await fetch("/api/student/resume-ai", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.analysis)
        if (data.analysis?.templateRecommendation?.name) {
          setSelectedTemplate(data.analysis.templateRecommendation.name as TemplateName)
        }
        toast.success("AI analysis complete!")
      } else {
        setAiError(data.error ?? "Analysis failed")
      }
    } catch { setAiError("Network error — please try again") }
    finally { setAiLoading(false) }
  }

  const openInTab = (print: boolean) => {
    const html = getTemplateHTML(selectedTemplate, student)
    const w = window.open("", "_blank")
    if (w) {
      w.document.write(html); w.document.close(); w.focus()
      if (print) setTimeout(() => w.print(), 600)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Auto-analyze banner */}
      {autoAnalyze && aiLoading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-3"
        >
          <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Running AI analysis on your resume…</p>
            <p className="text-xs text-muted-foreground">Reviewing your profile, platforms and resume. Results will appear on the right.</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> Resume Builder
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your resume (PDF, Word, or link), pick a template, and get AI-powered job suggestions.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">

        {/* ── LEFT ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">

          {/* Upload section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
            <ResumeUpload
              resumeUrl={student?.resumeUrl}
              resumeFile={student?.resumeFile}
              onSaved={handleSaved}
            />
          </motion.div>

          {/* Template picker */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Palette className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Choose a Template</h2>
              {analysis?.templateRecommendation && (
                <Badge className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
                  AI recommends: {analysis.templateRecommendation.name}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map(t => (
                <button key={t.name} onClick={() => setSelectedTemplate(t.name)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedTemplate === t.name
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-background hover:border-primary/30"
                  }`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: selectedTemplate === t.name ? t.accent : "#94a3b8" }}>
                      {selectedTemplate === t.name && <div className="w-2 h-2 rounded-full" style={{ background: t.accent }} />}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    {analysis?.templateRecommendation?.name === t.name && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">AI Pick</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Export */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" /> Export Resume
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Resume is built from your live platform data. Preview in a new tab, then
              use <strong>Ctrl + P</strong> to save as PDF.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => openInTab(false)} className="flex-1 gap-2 rounded-xl">
                <Eye className="h-4 w-4" />Preview
              </Button>
              <Button onClick={() => openInTab(true)} className="flex-1 gap-2 rounded-xl">
                <Download className="h-4 w-4" />Download PDF
              </Button>
            </div>
          </motion.div>

          {/* ATS Keywords */}
          {analysis?.atsKeywords?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-500" /> ATS Keywords to Include
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.atsKeywords.map((kw: string) => (
                  <Badge key={kw} variant="outline" className="text-xs bg-violet-500/5 text-violet-600 border-violet-400/30">{kw}</Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI summary */}
          {analysis?.summary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> AI-Generated Summary
              </h2>
              <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
              <button onClick={() => { navigator.clipboard.writeText(analysis.summary); toast.success("Copied!") }}
                className="mt-3 text-xs text-primary hover:underline">
                Copy to clipboard →
              </button>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: AI panel ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className={`rounded-2xl border bg-card p-5 ${autoAnalyze && aiLoading ? "border-primary/40 bg-primary/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? "text-primary animate-pulse" : "text-violet-500"}`} />
              </div>
              <h2 className="text-sm font-semibold text-foreground">AI Resume Advisor</h2>
              {autoAnalyze && aiLoading && (
                <span className="ml-auto text-[10px] text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full animate-pulse">
                  Auto-analysing…
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              AI reads your uploaded resume + coding profile to suggest the best job roles, fill gaps, 
              and recommend a template.
              {!hasAnyResume && <span className="block mt-1 text-amber-500">Upload a resume above for deeper analysis.</span>}
            </p>
            <Button onClick={runAI} disabled={aiLoading}
              className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white border-0">
              {aiLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" />Analysing…</>
                : analysis
                  ? <><RefreshCw className="h-4 w-4" />Re-analyse</>
                  : <><Sparkles className="h-4 w-4" />Get AI Suggestions</>
              }
            </Button>
            {aiError && <p className="mt-2 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{aiError}</p>}
          </motion.div>

          <AnimatePresence>
          {analysis && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* Score */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Profile Score</h3>
                  <span className={`text-2xl font-black tabular-nums ${analysis.overallScore>=75?"text-emerald-500":analysis.overallScore>=50?"text-amber-500":"text-red-500"}`}>
                    {analysis.overallScore}<span className="text-sm font-normal text-muted-foreground">/100</span>
                  </span>
                </div>
                <Progress value={analysis.overallScore} className="h-2" />
              </div>

              {/* Roles */}
              {analysis.topRoles?.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />Best-fit Roles
                  </h3>
                  <div className="space-y-3">
                    {analysis.topRoles.map((r: any) => (
                      <div key={r.role}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-foreground">{r.role}</span>
                          <span className={`text-xs font-bold tabular-nums ${r.match>=75?"text-emerald-500":r.match>=55?"text-amber-500":"text-red-400"}`}>{r.match}%</span>
                        </div>
                        <Progress value={r.match} className="h-1.5 mb-1" />
                        <p className="text-[10px] text-muted-foreground">{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths?.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <h3 className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />Strengths
                  </h3>
                  {analysis.strengths.map((s: string) => (
                    <div key={s} className="flex items-start gap-2 mb-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <p className="text-xs text-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Gaps */}
              {analysis.gaps?.length > 0 && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" />Gaps to Address
                  </h3>
                  {analysis.gaps.map((g: string) => (
                    <div key={g} className="flex items-start gap-2 mb-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <p className="text-xs text-foreground">{g}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Action plan */}
              {analysis.suggestions?.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />Action Plan
                  </h3>
                  <div className="space-y-2.5">
                    {analysis.suggestions.map((sg: any, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${PRIORITY_COLOR[sg.priority]??PRIORITY_COLOR.low}`}>
                          {sg.priority?.toUpperCase()}
                        </span>
                        <p className="text-xs text-foreground leading-relaxed">{sg.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template rec */}
              {analysis.templateRecommendation && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" />Recommended Template
                  </h3>
                  <p className="text-sm font-bold text-foreground">{analysis.templateRecommendation.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{analysis.templateRecommendation.reason}</p>
                  <button onClick={() => setSelectedTemplate(analysis.templateRecommendation.name as TemplateName)}
                    className="mt-2 text-xs text-primary hover:underline flex items-center gap-1">
                    Apply this template <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>

          {!analysis && !aiLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">No AI insights yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Get AI Suggestions" above to analyse your profile</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
