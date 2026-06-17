"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  FileText, Sparkles, Download, ExternalLink, Loader2,
  CheckCircle2, AlertCircle, Upload, X, Trash2, Link2,
  Palette, Eye, Star, Zap, ArrowRight, RefreshCw, Brain,
  Target, TrendingUp, ChevronRight, File,
} from "lucide-react"
import { toast } from "sonner"

type TemplateName = "Technical" | "Minimal" | "Creative" | "Executive"

const TEMPLATES: { name: TemplateName; desc: string; color: string; preview: string }[] = [
  { name: "Technical",  desc: "Data-forward layout for SDE roles",        color: "#6366f1", preview: "T" },
  { name: "Minimal",    desc: "Clean, ATS-friendly — whitespace driven",  color: "#0ea5e9", preview: "M" },
  { name: "Creative",   desc: "Sidebar layout for design/product roles",  color: "#f59e0b", preview: "C" },
  { name: "Executive",  desc: "Bold headings, achievement-focused",       color: "#10b981", preview: "E" },
]

const ALLOWED_EXT = [".pdf", ".doc", ".docx", ".txt"]

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

// ─── Resume HTML builders (unchanged) ────────────────────────────────────────
function buildTechnicalHTML(s: any): string {
  const platforms = Object.entries(s.linkedPlatforms ?? {}).filter(([,v]:any)=>v?.username)
    .map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;const rt=st.rating??st.currentRating??0;return`<div class="pr"><span class="pn">${pid.charAt(0).toUpperCase()+pid.slice(1)}</span><span class="pu">@${pd.username}</span>${sv?`<span class="ps">${sv} solved</span>`:""}${rt?`<span class="ps">Rating ${rt}</span>`:""}</div>`}).join("")
  const skills=(s.skills??[]).map((sk:string)=>`<span class="sk">${sk}</span>`).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${s.name}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#1e1e2e;font-size:13px;line-height:1.55}.page{max-width:820px;margin:0 auto;padding:40px 44px}.hdr{border-bottom:3px solid #6366f1;padding-bottom:16px;margin-bottom:20px}.name{font-size:26px;font-weight:800;color:#6366f1}.tag{font-size:13px;color:#555;margin-top:2px}.cr{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;font-size:12px;color:#555}.cr a{color:#6366f1;text-decoration:none}h2{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#6366f1;margin:18px 0 8px;padding-bottom:3px;border-bottom:1px solid #e5e5f0}.ir{display:flex;gap:6px;font-size:12.5px;margin-bottom:4px}.il{color:#888;min-width:90px}.iv{color:#1e1e2e;font-weight:500}.pr{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:12px}.pn{font-weight:700;color:#6366f1;min-width:100px}.pu{color:#555}.ps{background:#f0f0ff;color:#6366f1;padding:1px 7px;border-radius:99px;font-size:11px}.skills{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.sk{background:#f0f0ff;color:#6366f1;padding:3px 10px;border-radius:99px;font-size:11.5px;font-weight:500}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><div class="hdr"><div class="name">${s.name??""}</div><div class="tag">${s.degree??"B.Tech"} · ${s.branch??""} · Class of ${s.graduationYear??""}</div><div class="cr">${s.email?`<span>${s.email}</span>`:""}${s.phone?`<span>${s.phone}</span>`:""}${s.location?`<span>${s.location}</span>`:""}${s.linkedinUrl?`<a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`<a href="${s.githubUrl}">GitHub</a>`:""}</div></div>${s.bio?`<h2>About</h2><p style="font-size:12.5px;color:#444">${s.bio}</p>`:""}<h2>Education</h2><div class="ir"><span class="il">Institution</span><span class="iv">${s.collegeName??s.collegeCode??""}</span></div><div class="ir"><span class="il">Degree</span><span class="iv">${s.degree??"B.Tech"} in ${s.branch??""}</span></div><div class="ir"><span class="il">Graduation</span><span class="iv">${s.graduationYear??""}</span></div>${s.rollNumber?`<div class="ir"><span class="il">Roll No</span><span class="iv">${s.rollNumber}</span></div>`:""}${skills?`<h2>Technical Skills</h2><div class="skills">${skills}</div>`:""}${platforms?`<h2>Coding Platforms</h2>${platforms}`:""}</div></body></html>`
}
function buildMinimalHTML(s: any): string {
  const pl=Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username).map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;const rt=st.rating??st.currentRating??0;return`<li><strong>${pid.charAt(0).toUpperCase()+pid.slice(1)}</strong> · @${pd.username}${sv?` · ${sv} problems`:""}${rt?` · rating ${rt}`:""}</li>`}).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${s.name}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Georgia,serif;color:#222;font-size:13.5px;line-height:1.6}.page{max-width:760px;margin:0 auto;padding:50px}h1{font-size:28px;font-weight:400;letter-spacing:2px;text-transform:uppercase}.sub{font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px}.contact{font-size:12px;color:#555;margin-bottom:24px;border-bottom:1px solid #ddd;padding-bottom:10px}.contact a{color:#333;text-decoration:none}h2{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin:22px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}p,li{font-size:13px;color:#333;margin-bottom:4px}ul{padding-left:18px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><h1>${s.name??""}</h1><div class="sub">${s.degree??"B.Tech"} · ${s.branch??""}</div><div class="contact">${[s.email,s.phone,s.location].filter(Boolean).join("  ·  ")}${s.linkedinUrl?`  ·  <a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`  ·  <a href="${s.githubUrl}">GitHub</a>`:""}</div>${s.bio?`<h2>Profile</h2><p>${s.bio}</p>`:""}<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong></p><p>${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p>${(s.skills??[]).length?`<h2>Skills</h2><p>${(s.skills??[]).join(" · ")}</p>`:""}${pl?`<h2>Coding</h2><ul>${pl}</ul>`:""}</div></body></html>`
}
function buildCreativeHTML(s: any): string {
  const skills=(s.skills??[]).map((sk:string)=>`<span style="display:block;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:12px">${sk}</span>`).join("")
  const pl=Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username).map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;return`<div style="margin-bottom:6px"><strong style="color:#f59e0b">${pid.charAt(0).toUpperCase()+pid.slice(1)}</strong><br><span style="font-size:11px;color:#ccc">@${pd.username}${sv?` · ${sv} solved`:""}</span></div>`}).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${s.name}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#333;font-size:13px}.wrapper{display:flex;min-height:100vh;max-width:820px;margin:0 auto}.sidebar{width:230px;background:#1e1e2e;color:#fff;padding:32px 22px;flex-shrink:0}.main{flex:1;padding:36px 34px}.av{width:72px;height:72px;border-radius:50%;background:#f59e0b;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:#fff;margin-bottom:14px}.sidebar h1{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}.role{font-size:11px;color:#f59e0b;text-transform:uppercase;letter-spacing:1px;margin-bottom:20px}.ss{margin-top:20px}.st{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#f59e0b;margin-bottom:8px;font-weight:700}.ci{font-size:11px;color:#bbb;margin-bottom:5px}.ci a{color:#f59e0b;text-decoration:none}.main h2{font-size:15px;font-weight:700;color:#1e1e2e;border-left:3px solid #f59e0b;padding-left:10px;margin:20px 0 10px}.main h2:first-child{margin-top:0}p,li{font-size:12.5px;line-height:1.65;margin-bottom:4px}ul{padding-left:18px}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.wrapper{min-height:unset}}</style></head><body><div class="wrapper"><div class="sidebar"><div class="av">${(s.name??"?")[0]}</div><h1>${s.name??""}</h1><div class="role">${s.branch??"Engineering"}</div><div class="ss"><div class="st">Contact</div>${s.email?`<div class="ci">${s.email}</div>`:""}${s.phone?`<div class="ci">${s.phone}</div>`:""}${s.location?`<div class="ci">${s.location}</div>`:""}${s.linkedinUrl?`<div class="ci"><a href="${s.linkedinUrl}">LinkedIn</a></div>`:""}${s.githubUrl?`<div class="ci"><a href="${s.githubUrl}">GitHub</a></div>`:""}</div>${skills?`<div class="ss"><div class="st">Skills</div>${skills}</div>`:""}${pl?`<div class="ss"><div class="st">Coding</div>${pl}</div>`:""}</div><div class="main">${s.bio?`<h2>Profile</h2><p>${s.bio}</p>`:""}<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong></p><p>${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p></div></div></body></html>`
}
function buildExecutiveHTML(s: any): string {
  const pl=Object.entries(s.linkedPlatforms??{}).filter(([,v]:any)=>v?.username).map(([pid,pd]:any)=>{const st=pd.stats??{};const sv=st.totalSolved??st.problemsSolved??0;const rt=st.rating??st.currentRating??0;return`<tr><td style="padding:4px 12px 4px 0;font-weight:600;color:#10b981">${pid.charAt(0).toUpperCase()+pid.slice(1)}</td><td style="padding:4px 12px;color:#555">@${pd.username}</td><td style="padding:4px 0;color:#888">${sv?`${sv} solved`:""}${rt?(sv?" · ":"")+`Rating ${rt}`:""}</td></tr>`}).join("")
  const skills=(s.skills??[]).map((sk:string)=>`<span style="display:inline-block;margin:2px 4px;padding:3px 12px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:99px;font-size:12px;color:#065f46">${sk}</span>`).join("")
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${s.name}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:#111;font-size:13px;line-height:1.6}.page{max-width:820px;margin:0 auto;padding:44px 50px}.hdr{text-align:center;border-bottom:2px solid #10b981;padding-bottom:20px;margin-bottom:24px}.name{font-size:32px;font-weight:900;color:#111;letter-spacing:-1px}.tag{font-size:13px;color:#666;margin-top:4px}.cr{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:12px;color:#555}.cr a{color:#10b981;text-decoration:none}h2{font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#111;margin:22px 0 10px;display:flex;align-items:center;gap:8px}h2::after{content:"";flex:1;height:1px;background:#e5e7eb}p,li{font-size:12.5px;color:#333;margin-bottom:5px}table{width:100%;border-collapse:collapse}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><div class="hdr"><div class="name">${s.name??""}</div><div class="tag">${s.degree??"B.Tech"} in ${s.branch??""} · ${s.collegeName??s.collegeCode??""} · Class of ${s.graduationYear??""}</div><div class="cr">${s.email?`<span>${s.email}</span>`:""}${s.phone?`<span>${s.phone}</span>`:""}${s.location?`<span>${s.location}</span>`:""}${s.linkedinUrl?`<a href="${s.linkedinUrl}">LinkedIn</a>`:""}${s.githubUrl?`<a href="${s.githubUrl}">GitHub</a>`:""}</div></div>${s.bio?`<h2>Professional Summary</h2><p>${s.bio}</p>`:""}<h2>Education</h2><p><strong>${s.collegeName??s.collegeCode??""}</strong> · ${s.degree??"B.Tech"} in ${s.branch??""} · Class of ${s.graduationYear??""}</p>${skills?`<h2>Core Skills</h2><div style="margin-top:4px">${skills}</div>`:""}${pl?`<h2>Competitive Programming</h2><table>${pl}</table>`:""}</div></body></html>`
}

function getTemplateHTML(name: TemplateName, student: any): string {
  if (name === "Minimal")   return buildMinimalHTML(student)
  if (name === "Creative")  return buildCreativeHTML(student)
  if (name === "Executive") return buildExecutiveHTML(student)
  return buildTechnicalHTML(student)
}

// ─── Main component ────────────────────────────────────────────────────────
export function ResumeClient({ student: init, autoAnalyze = false }: { student: any; autoAnalyze?: boolean }) {
  const [student, setStudent]   = useState<any>(init)
  const [template, setTemplate] = useState<TemplateName>("Technical")
  const [analysis, setAnalysis] = useState<any>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError]   = useState("")
  const [tab, setTab]           = useState<"upload" | "smart">("upload")
  const [link, setLink]         = useState(init?.resumeUrl ?? "")
  const [uploadTab, setUploadTab] = useState<"link" | "file">("file")
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savingLink, setSavingLink] = useState(false)
  const [removing, setRemoving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoAnalyze && !analysis && !aiLoading) runAI()
  }, [autoAnalyze])

  const runAI = async () => {
    setAiLoading(true); setAiError(""); setTab("smart")
    try {
      const res = await fetch("/api/student/enhancv", { method: "POST", credentials: "include" })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.analysis)
        if (data.analysis?.templateRecommendation?.name) setTemplate(data.analysis.templateRecommendation.name)
        toast.success("Smart Resume analysis complete!")
      } else {
        setAiError(data.error ?? "Analysis failed")
      }
    } catch { setAiError("Network error — please try again") }
    finally { setAiLoading(false) }
  }

  const uploadFile = async (file: File) => {
    if (!ALLOWED_EXT.some(e => file.name.toLowerCase().endsWith(e))) { toast.error("PDF, DOC, DOCX or TXT only"); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append("file", file)
      const res = await fetch("/api/student/resume-upload", { method: "POST", body: fd })
      const data = await res.json()
      if (data.success) {
        setStudent((p: any) => ({ ...p, resumeFile: { fileName: data.fileName, sizeBytes: data.sizeBytes, mimeType: data.mimeType, uploadedAt: new Date().toISOString() } }))
        toast.success("Resume uploaded!")
      } else toast.error(data.error ?? "Upload failed")
    } catch { toast.error("Network error") }
    finally { setUploading(false) }
  }

  const removeFile = async () => {
    setRemoving(true)
    try {
      const res = await fetch("/api/student/resume-upload", { method: "DELETE" })
      const data = await res.json()
      if (data.success) { setStudent((p: any) => ({ ...p, resumeFile: null })); toast.success("File removed") }
    } catch { toast.error("Network error") }
    finally { setRemoving(false) }
  }

  const saveLink = async () => {
    setSavingLink(true)
    try {
      const res = await fetch("/api/student/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeUrl: link.trim() }) })
      const data = await res.json()
      if (data.success) { setStudent((p: any) => ({ ...p, resumeUrl: link.trim() })); toast.success("Link saved") }
    } catch { toast.error("Network error") }
    finally { setSavingLink(false) }
  }

  const openPreview = (print = false) => {
    const html = getTemplateHTML(template, student)
    const w = window.open("", "_blank")
    if (w) { w.document.write(html); w.document.close(); w.focus(); if (print) setTimeout(() => w.print(), 600) }
  }

  const hasResume = !!(student?.resumeUrl || student?.resumeFile)
  const a = analysis

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <div className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Resume Studio</h1>
              <p className="text-xs text-muted-foreground">Upload · Analyse · Export</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openPreview(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button onClick={() => openPreview(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-5">

          {/* ── LEFT COLUMN (Upload + Templates) ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Resume Upload Card */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Resume File</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT · max 5MB</p>
                </div>
              </div>

              {/* Tab toggle */}
              <div className="flex border-b border-border/60">
                {(["file", "link"] as const).map(t => (
                  <button key={t} onClick={() => setUploadTab(t)}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${uploadTab === t ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
                    {t === "file" ? "Upload File" : "Link / URL"}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {uploadTab === "file" && (
                  <div className="space-y-3">
                    {student?.resumeFile && (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                          <File className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{student.resumeFile.fileName}</p>
                          <p className="text-[10px] text-muted-foreground">{fmtBytes(student.resumeFile.sizeBytes)} · {new Date(student.resumeFile.uploadedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href="/api/student/resume-download" download={student.resumeFile.fileName}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          <button onClick={removeFile} disabled={removing}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all">
                            {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true) }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f) }}
                      onClick={() => !uploading && fileRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-3 p-7 rounded-xl border-2 border-dashed cursor-pointer transition-all ${dragging ? "border-primary bg-primary/8" : "border-border hover:border-primary/40 hover:bg-primary/3"} ${uploading ? "pointer-events-none opacity-60" : ""}`}>
                      {uploading ? <><Loader2 className="h-7 w-7 text-primary animate-spin" /><p className="text-sm text-muted-foreground">Uploading…</p></>
                        : <><Upload className="h-7 w-7 text-muted-foreground" /><div className="text-center"><p className="text-sm font-medium text-foreground">{student?.resumeFile ? "Replace file" : "Drop resume here"}</p><p className="text-xs text-muted-foreground mt-0.5">or <span className="text-primary">click to browse</span></p></div></>}
                      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = "" }} />
                    </div>
                  </div>
                )}
                {uploadTab === "link" && (
                  <div className="space-y-3">
                    {student?.resumeUrl && (
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline flex-1 truncate flex items-center gap-1">
                          {student.resumeUrl}<ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    )}
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
                        placeholder="https://drive.google.com/..." value={link} onChange={e => setLink(e.target.value)} onKeyDown={e => e.key === "Enter" && saveLink()} />
                    </div>
                    <button onClick={saveLink} disabled={savingLink || !link.trim()}
                      className="w-full h-9 rounded-xl text-sm font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                      {savingLink ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</> : <><CheckCircle2 className="h-3.5 w-3.5" />Save Link</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Template Picker */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Palette className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">Template</p>
                  {a?.templateRecommendation && <p className="text-[10px] text-primary">AI recommends: {a.templateRecommendation.name}</p>}
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {TEMPLATES.map(t => (
                  <button key={t.name} onClick={() => setTemplate(t.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${template === t.name ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-background hover:border-primary/30"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white text-xs font-black" style={{ background: t.color }}>{t.preview}</div>
                      <span className="text-xs font-semibold text-foreground">{t.name}</span>
                      {a?.templateRecommendation?.name === t.name && <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">AI</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Resume CTA */}
            <div className="rounded-2xl border border-violet-500/20 overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(99,102,241,0.08))" }}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Smart Resume AI</p>
                    <p className="text-[10px] text-muted-foreground">ResumeWorded-style deep analysis</p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  {["ATS score + keyword gaps", "Bullet-by-bullet grading + rewrites", "Section scores (A–F)", "Job match % for 3 roles"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />{f}
                    </div>
                  ))}
                </div>
                <button onClick={runAI} disabled={aiLoading || !hasResume}
                  className="w-full h-10 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
                  {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Analysing…</> : <><Sparkles className="h-4 w-4" />Analyse Resume</>}
                </button>
                {!hasResume && <p className="text-[10px] text-muted-foreground text-center mt-2">Upload a resume first</p>}
                {aiError && <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{aiError}</p>}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (Analysis Results) ── */}
          <div className="lg:col-span-3 space-y-4">
            {!a && !aiLoading && (
              <div className="rounded-2xl border border-dashed border-border bg-card/40 flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <p className="font-bold text-foreground text-lg mb-1">Smart Resume Analysis</p>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">Upload your resume and click "Analyse Resume" to get a deep ResumeWorded-style report — ATS score, bullet grading, job match, and more.</p>
              </div>
            )}

            {aiLoading && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center py-20 px-6">
                <div className="relative mb-5">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-primary" />
                </div>
                <p className="font-bold text-foreground text-lg mb-1">Analysing your resume…</p>
                <p className="text-sm text-muted-foreground">ATS check · Section grading · Bullet rewrites · Job matching</p>
              </div>
            )}

            {a && (
              <div className="space-y-4">
                {/* Score strip */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Overall", value: a.overallScore ?? 0 },
                    { label: "ATS Score", value: a.atsScore ?? 0 },
                    { label: "Interview Ready", value: a.interviewReadiness ?? 0 },
                  ].map(s => {
                    const c = s.value >= 80 ? "#10b981" : s.value >= 60 ? "#f59e0b" : "#ef4444"
                    return (
                      <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                        <p className="text-3xl font-black tabular-nums" style={{ color: c }}>{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    )
                  })}
                </div>

                {/* Score breakdown */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground mb-1">Score Breakdown</p>
                  {a.overallReason && <p className="text-xs text-muted-foreground mb-4 italic">{a.overallReason}</p>}
                  <div className="space-y-3">
                    {Object.values(a.scoreBreakdown ?? {}).map((s: any) => {
                      const pct = Math.round((s.score / s.max) * 100)
                      const c = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444"
                      return (
                        <div key={s.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{s.label}</span>
                            <span className="font-bold tabular-nums" style={{ color: c }}>{s.score}/{s.max}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: c }} />
                          </div>
                          {s.why && <p className="text-[10px] text-muted-foreground italic mt-0.5">{s.why}</p>}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Critical issues + Strengths */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {(a.criticalIssues ?? []).length > 0 && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />Critical Issues</p>
                      <ul className="space-y-1">{a.criticalIssues.map((c: string, i: number) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-red-400 shrink-0">✗</span>{c}</li>)}</ul>
                    </div>
                  )}
                  {(a.strengthPoints ?? []).length > 0 && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5"><Star className="h-3.5 w-3.5" />Strengths</p>
                      <ul className="space-y-1">{a.strengthPoints.map((s: string, i: number) => <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-emerald-400 shrink-0">✓</span>{s}</li>)}</ul>
                    </div>
                  )}
                </div>

                {/* ATS Keywords */}
                <div className="rounded-xl border border-border bg-card/50 p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">ATS Keywords</p>
                  {a.atsReason && <p className="text-xs text-muted-foreground mb-3 italic">{a.atsReason}</p>}
                  <div className="space-y-2">
                    <div><p className="text-[10px] font-bold text-emerald-400 mb-1.5">✓ FOUND IN RESUME</p><div className="flex flex-wrap gap-1.5">{(a.atsKeywords?.found ?? []).map((k: string) => <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{k}</span>)}</div></div>
                    <div><p className="text-[10px] font-bold text-red-400 mb-1.5">✗ MISSING — ADD THESE</p><div className="flex flex-wrap gap-1.5">{(a.atsKeywords?.missing ?? []).map((k: string) => <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{k}</span>)}</div></div>
                  </div>
                </div>

                {/* Section scores */}
                {(a.sectionScores ?? []).length > 0 && (
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Section Scores</p>
                    <div className="space-y-3">
                      {a.sectionScores.map((s: any) => {
                        const gc: Record<string,string> = { A:"#10b981", B:"#6366f1", C:"#f59e0b", D:"#ef4444", F:"#dc2626" }
                        const c = gc[s.grade] ?? "#6366f1"
                        return (
                          <div key={s.name}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-black" style={{ background: `${c}20`, color: c }}>{s.grade}</span>
                                <span className="text-sm font-medium text-foreground">{s.name}</span>
                              </div>
                              <span className="text-xs font-bold tabular-nums" style={{ color: c }}>{s.score}/100</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 mb-1.5">
                              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.score}%`, background: c }} />
                            </div>
                            <p className="text-xs text-muted-foreground">{s.feedback}</p>
                            {s.howToFix && <p className="text-[10px] text-blue-400 mt-1 italic">Fix: {s.howToFix}</p>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Bullet analysis */}
                {(a.bulletAnalysis ?? []).length > 0 && (
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Bullet Analysis</p>
                    <div className="space-y-4">
                      {a.bulletAnalysis.map((b: any, i: number) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-muted-foreground flex-1 italic">"{b.original}"</p>
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black" style={{ background: b.score >= 7 ? "#10b98120" : b.score >= 5 ? "#f59e0b20" : "#ef444420", color: b.score >= 7 ? "#10b981" : b.score >= 5 ? "#f59e0b" : "#ef4444" }}>{b.score}</span>
                          </div>
                          {b.issues?.length > 0 && <div className="flex flex-wrap gap-1">{b.issues.map((iss: string, j: number) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{iss}</span>)}</div>}
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                            <p className="text-[9px] font-bold text-emerald-400 mb-1">✦ IMPROVED</p>
                            <p className="text-xs text-emerald-100">{b.improved}</p>
                            {b.explanation && <p className="text-[10px] text-muted-foreground mt-1 italic">{b.explanation}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick wins */}
                {(a.quickWins ?? []).length > 0 && (
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Quick Wins</p>
                    <div className="space-y-2">
                      {a.quickWins.map((w: any, i: number) => {
                        const ic: Record<string,string> = { high:"#ef4444", medium:"#f59e0b", low:"#6366f1" }
                        return (
                          <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card/30 p-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold">{i+1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground">{w.action}</p>
                              {w.whyItMatters && <p className="text-[10px] text-muted-foreground mt-0.5">{w.whyItMatters}</p>}
                              <div className="flex gap-1.5 mt-1.5">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: `${ic[w.impact] ?? "#6366f1"}20`, color: ic[w.impact] ?? "#6366f1" }}>{w.impact} impact</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-border">{w.effort} effort</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Job matches */}
                {(a.jobMatches ?? []).length > 0 && (
                  <div className="rounded-xl border border-border bg-card/50 p-4">
                    <p className="text-sm font-semibold text-foreground mb-3">Job Match</p>
                    <div className="space-y-3">
                      {a.jobMatches.map((j: any, i: number) => {
                        const c = j.match >= 80 ? "#10b981" : j.match >= 60 ? "#f59e0b" : "#ef4444"
                        return (
                          <div key={i} className="rounded-xl border border-border bg-card/30 p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div><p className="text-sm font-semibold text-foreground">{j.role}</p><p className="text-xs text-muted-foreground">{j.company}</p></div>
                              <span className="text-2xl font-black tabular-nums" style={{ color: c }}>{j.match}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 mb-2"><div className="h-full rounded-full" style={{ width: `${j.match}%`, background: c }} /></div>
                            <p className="text-xs text-muted-foreground">{j.reason}</p>
                            {j.howToClose && <p className="text-[10px] text-violet-400 mt-1 italic">→ {j.howToClose}</p>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {a.improvedSummary && (
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                    <p className="text-xs font-bold text-violet-400 mb-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />AI-Rewritten Summary</p>
                    <p className="text-sm text-foreground leading-relaxed font-medium mb-2">{a.improvedSummary}</p>
                    {a.summaryExplanation && <p className="text-[10px] text-muted-foreground italic border-t border-violet-500/15 pt-2 mt-2">{a.summaryExplanation}</p>}
                  </div>
                )}

                {/* Re-analyse */}
                <button onClick={runAI} disabled={aiLoading}
                  className="w-full h-10 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                  <RefreshCw className="h-4 w-4" /> Re-analyse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
