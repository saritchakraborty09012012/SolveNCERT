import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle, ArrowRight, BookOpenCheck, Camera, CheckCircle2, ChevronLeft,
  ClipboardCheck, Copy, FileImage, FileSpreadsheet, FileText, FileType2,
  ImageIcon, Loader2, PenLine, Presentation, RotateCcw, ScanSearch,
  Sparkles, Target, Type as TypeIcon, Upload, X,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import MathRenderer from '@/components/features/MathRenderer';
import { CLASS_9_SUBJECTS } from '@/lib/content';
import toast from 'react-hot-toast';

/* ---------------------------------- types ---------------------------------- */

type Severity = 'critical' | 'major' | 'minor' | 'polish';

interface Annotation {
  id: number;
  imageIndex: number;
  type: 'rect' | 'circle' | 'underline';
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  label: string;
  severity: Severity;
  explanation: string;
  remark: string;
  marksLost?: number;
  labelSide?: 'left' | 'right';
  needsRewrite?: boolean;
}

interface Criterion { name: string; score: number; max: number; note: string }

interface CheckResult {
  detectedQuestion?: string;
  detectedSubject?: string;
  marksObtained?: number;
  marksTotal?: number;
  scorePercent?: number;
  grade?: string;
  verdict?: string;
  summary?: string;
  criteria?: Criterion[];
  annotations?: Annotation[];
  strengths?: string[];
  nextSteps?: string[];
}

interface UploadedImage { id: string; previewUrl: string; data: string; mimeType: string; name: string }
interface UploadedDoc { id: string; name: string; data: string; mimeType: string }

type WriteState = { status: 'idle' | 'loading' | 'done' | 'error'; answer?: string; error?: string };

const SEVERITY_META: Record<Severity, { color: string; bg: string; border: string; text: string }> = {
  critical: { color: '#ef4444', bg: 'bg-red-500/10',   border: 'border-red-500/40',   text: 'text-red-600 dark:text-red-400' },
  major:    { color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-600 dark:text-orange-400' },
  minor:    { color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', text: 'text-yellow-600 dark:text-yellow-500' },
  polish:   { color: '#38bdf8', bg: 'bg-sky-500/10',    border: 'border-sky-500/40',    text: 'text-sky-600 dark:text-sky-400' },
};

const SEVERITY_LABEL: Record<Severity, string> = {
  critical: 'Marks Lost',
  major: 'Value Point Missed',
  minor: 'Presentation',
  polish: 'Quality Issue',
};

function subjectLabel(s: typeof CLASS_9_SUBJECTS[number]): string {
  if (s.id === 'it-part-a') return 'IT Part A — Employability Skills';
  if (s.id === 'it-part-b') return 'IT Part B — IT Code 402';
  const rm = s.book.match(/^(R1 and R2|R3)\s*book-?\s*(.+)$/i);
  if (rm) return `${s.name} — ${rm[1].replace(' and ', ' & ')} (${rm[2].trim()})`;
  return s.book && s.book !== s.name ? `${s.name} (${s.book})` : s.name;
}

const SUBJECTS = CLASS_9_SUBJECTS.map((s) => ({ value: subjectLabel(s), label: subjectLabel(s) }));

const DOC_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv';

const CHECKING_STAGES = [
  'Uploading your answer securely…',
  'Examiner Nova is reading every line…',
  'Matching against the NCERT marking scheme…',
  'Checking step-marking & value points…',
  'Marking errors with the red pen…',
  'Preparing strict board verdict…',
];

function docIcon(name: string) {
  if (/\.(xlsx|xls|csv)$/i.test(name)) return FileSpreadsheet;
  if (/\.(pptx|ppt)$/i.test(name)) return Presentation;
  return FileText;
}

/* ------------------------------ image helpers ------------------------------ */

function fileToDownscaled(file: File, maxDim = 1600, quality = 0.82): Promise<{ dataUrl: string; data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unsupported'));
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({ dataUrl, data: dataUrl.split(',')[1] || '', mimeType: 'image/jpeg' });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => resolve({ data: String(reader.result).split(',')[1] || '', mimeType: file.type || guessMime(file.name) });
    reader.readAsDataURL(file);
  });
}

function guessMime(name: string): string {
  if (/\.pdf$/i.test(name)) return 'application/pdf';
  if (/\.docx$/i.test(name)) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (/\.xlsx$/i.test(name)) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (/\.pptx$/i.test(name)) return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  if (/\.csv$/i.test(name)) return 'text/csv';
  return 'text/plain';
}

/* --------------------------- annotation overlays --------------------------- */

function roman(n: number): string {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) { while (n >= v) { out += s; n -= v; } }
  return out || 'I';
}

function isMarkable(a: Annotation): boolean {
  return Array.isArray(a.box) && a.box.some((v) => v > 0);
}

function tagPos(a: Annotation): { x: number; y: number } {
  const [ymin, xmin, ymax, xmax] = a.box;
  const goRight = a.labelSide !== 'left';
  return {
    x: goRight ? Math.min(94, Math.max(6, (xmax + 190) / 10)) : Math.min(94, Math.max(6, (xmin - 190) / 10)),
    y: Math.min(96, Math.max(4, (ymin + ymax) / 20)),
  };
}

function AnnotationOverlay({
  ann, active, dimmed, onSelect,
}: { ann: Annotation; active: boolean; dimmed: boolean; onSelect: () => void }) {
  const [ymin, xmin, ymax, xmax] = ann.box;
  const meta = SEVERITY_META[ann.severity];
  const common = {
    fill: ann.type === 'circle' || ann.type === 'underline' ? 'none' : `${meta.color}1a`,
    stroke: meta.color,
    vectorEffect: 'non-scaling-stroke' as const,
    strokeWidth: active ? 4 : 2.5,
    opacity: dimmed ? 0.25 : 1,
  };

  let shape: React.ReactNode = null;
  if (ann.type === 'rect') {
    shape = <rect x={xmin} y={ymin} width={Math.max(2, xmax - xmin)} height={Math.max(2, ymax - ymin)} rx={10} {...common} />;
  } else if (ann.type === 'circle') {
    const cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
    shape = <ellipse cx={cx} cy={cy} rx={Math.max(6, (xmax - xmin) / 2)} ry={Math.max(6, (ymax - ymin) / 2)} {...common} />;
  } else {
    shape = (
      <line x1={xmin} y1={ymax} x2={xmax} y2={ymax} stroke={meta.color}
        strokeWidth={active ? 5 : 3.5} vectorEffect="non-scaling-stroke" opacity={dimmed ? 0.25 : 1} strokeLinecap="round" />
    );
  }

  return (
    <g onClick={onSelect} className="cursor-pointer">
      {shape}
      {active && (
        <rect x={xmin - 6} y={ymin - 6} width={Math.max(8, xmax - xmin) + 12} height={Math.max(8, ymax - ymin) + 12}
          fill="none" stroke={meta.color} strokeWidth={1} strokeDasharray="6 6" vectorEffect="non-scaling-stroke" opacity={0.7}>
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite" />
        </rect>
      )}
    </g>
  );
}

function AnnotationArrow({ ann, active, dimmed }: { ann: Annotation; active: boolean; dimmed: boolean }) {
  const [ymin, xmin, ymax, xmax] = ann.box;
  const meta = SEVERITY_META[ann.severity];
  const goRight = ann.labelSide !== 'left';
  const cy = Math.min(970, Math.max(30, (ymin + ymax) / 2));
  const tag = tagPos(ann);

  const anchorX = goRight ? Math.min(990, xmax + 10) : Math.max(10, xmin - 10);
  const endX = tag.x * 10 + (goRight ? -22 : 22);

  return (
    <>
      <line x1={anchorX} y1={cy} x2={endX} y2={tag.y * 10} stroke={meta.color} strokeWidth={active ? 3 : 2}
        vectorEffect="non-scaling-stroke" opacity={(dimmed ? 0.25 : 1) * 0.9} markerEnd={`url(#arrow-${ann.id})`} />
      <defs>
        <marker id={`arrow-${ann.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={meta.color} opacity={dimmed ? 0.25 : 1} />
        </marker>
      </defs>
    </>
  );
}

function AnnotationTag({ ann, num, active, dimmed, onSelect }: { ann: Annotation; num: string; active: boolean; dimmed: boolean; onSelect: () => void }) {
  const meta = SEVERITY_META[ann.severity];
  const pos = tagPos(ann);
  return (
    <button
      onClick={onSelect}
      className={`absolute z-20 rounded-full border-2 px-2 py-0.5 text-[11px] font-extrabold leading-none text-white shadow-lg transition-transform sm:text-xs ${active ? 'scale-110' : ''}`}
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: 'translate(-50%, -50%)',
        background: meta.color,
        borderColor: 'rgba(255,255,255,0.85)',
        opacity: dimmed ? 0.3 : 1,
      }}
      aria-label={`Remark ${num}`}
    >{num}</button>
  );
}

function MarkerChip({ ann, num, onSelect }: { ann: Annotation; num: string; onSelect: () => void }) {
  const [ymin, xmin] = ann.box;
  const meta = SEVERITY_META[ann.severity];
  return (
    <button
      onClick={onSelect}
      className="absolute z-20 grid min-w-5 place-items-center rounded-full px-1 text-[9px] font-bold text-white shadow-md transition-transform hover:scale-125 sm:min-w-6 sm:text-[10px]"
      style={{ left: `${xmin}%`, top: `${ymin}%`, transform: 'translate(-50%, -50%)', background: meta.color }}
      aria-label={`Remark ${num}`}
    >{num}</button>
  );
}

/* --------------------------------- main page -------------------------------- */

export default function AnswerCheckerPage() {
  const [mode, setMode] = useState<'upload' | 'typed'>('upload');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [subject, setSubject] = useState('');
  const [questionContext, setQuestionContext] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [checking, setChecking] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [activeAnn, setActiveAnn] = useState<number | null>(null);
  const [writes, setWrites] = useState<Record<number, WriteState>>({});
  const [dragActive, setDragActive] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!checking) return;
    setStageIdx(0);
    const t = setInterval(() => setStageIdx((i) => Math.min(i + 1, CHECKING_STAGES.length - 1)), 2600);
    return () => clearInterval(t);
  }, [checking]);

  const resetResults = () => { setResult(null); setWrites({}); setActiveAnn(null); };

  const addImageFiles = useCallback(async (files: File[]) => {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) { toast.error('Please choose image files.'); return; }
    try {
      const processed = await Promise.all(valid.slice(0, 6).map(async (f) => {
        const { dataUrl, data, mimeType } = await fileToDownscaled(f);
        return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, previewUrl: dataUrl, data, mimeType, name: f.name };
      }));
      setImages((prev) => [...prev, ...processed].slice(0, 6));
      resetResults();
      toast.success(`${processed.length} photo${processed.length > 1 ? 's' : ''} added`);
    } catch {
      toast.error('Could not process one or more images.');
    }
  }, []);

  const addDocs = useCallback(async (files: File[]) => {
    const allowed = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|md)$/i;
    const valid = files.filter((f) => allowed.test(f.name) || /^text\//.test(f.type) || /pdf|word|powerpoint|excel|spreadsheet|presentation/i.test(f.type));
    if (valid.length === 0) { toast.error('Allowed files: PDF, Word, Excel, PowerPoint, TXT, CSV'); return; }
    const tooBig = valid.find((f) => f.size > 8 * 1024 * 1024);
    if (tooBig) { toast.error(`"${tooBig.name}" is larger than 8 MB.`); return; }
    try {
      const processed = await Promise.all(valid.slice(0, 4).map(async (f) => {
        const { data, mimeType } = await fileToBase64(f);
        return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: f.name, data, mimeType };
      }));
      setDocs((prev) => [...prev, ...processed].slice(0, 4));
      resetResults();
      toast.success(`${processed.length} file${processed.length > 1 ? 's' : ''} attached`);
    } catch {
      toast.error('Could not read one or more files.');
    }
  }, []);

  const handleDroppedFiles = useCallback((files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    const others = files.filter((f) => !f.type.startsWith('image/'));
    if (imgs.length) addImageFiles(imgs);
    if (others.length) addDocs(others);
  }, [addImageFiles, addDocs]);

  const removeImage = (id: string) => { setImages((prev) => prev.filter((img) => img.id !== id)); resetResults(); };
  const removeDoc = (id: string) => { setDocs((prev) => prev.filter((d) => d.id !== id)); resetResults(); };

  const canSubmit = mode === 'upload'
    ? (images.length > 0 || docs.length > 0)
    : answerText.trim().length > 10;

  const runCheck = async () => {
    if (!canSubmit) {
      toast.error(mode === 'upload' ? 'Add at least one photo or file first.' : 'Type your answer first (at least a few words).');
      return;
    }
    setChecking(true);
    resetResults();
    try {
      const res = await fetch('/api/answer-checker/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: mode === 'upload' && images.length > 0 ? images.map((img) => ({ data: img.data, mimeType: img.mimeType })) : undefined,
          documents: docs.length > 0 ? docs.map((d) => ({ name: d.name, mimeType: d.mimeType, data: d.data })) : undefined,
          answerText: mode === 'typed' ? answerText.trim() : undefined,
          subject: subject || undefined,
          classLevel: 'Class 9',
          questionContext: questionContext || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Checking failed.');
      const r = json.result as CheckResult;
      if (!r || !Array.isArray(r.annotations)) throw new Error('Could not evaluate this answer. Please retry.');
      setResult(r);
      setActiveImg(0);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      toast.success('Evaluation ready — examiner mode ON.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setChecking(false);
    }
  };

  const writeForMe = async (ann: Annotation) => {
    setWrites((w) => ({ ...w, [ann.id]: { status: 'loading' } }));
    try {
      const res = await fetch('/api/answer-checker/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: result?.detectedQuestion || questionContext,
          issues: [`${SEVERITY_LABEL[ann.severity]} — ${ann.label}: ${ann.explanation}`, `Examiner remark: ${ann.remark}`],
          originalAnswer: mode === 'typed' ? answerText.trim().slice(0, 4000) : undefined,
          subject: result?.detectedSubject || subject || undefined,
          classLevel: 'Class 9',
          marksHint: result?.marksTotal ? `${result.marksTotal} marks` : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || 'Could not write the answer.');
      setWrites((w) => ({ ...w, [ann.id]: { status: 'done', answer: json.answer as string } }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setWrites((w) => ({ ...w, [ann.id]: { status: 'error', error: msg } }));
      toast.error(msg);
    }
  };

  const resetAll = () => {
    setImages([]); setDocs([]); setAnswerText(''); setQuestionContext(''); setSubject('');
    resetResults(); setActiveImg(0); setMode('upload');
  };

  /* ------------------------------ derived data ------------------------------ */

  const anns = useMemo(
    () => (result?.annotations || []).filter((a) => a && Array.isArray(a.box) && a.box.length === 4),
    [result],
  );
  const annNum = useCallback((a: Annotation) => roman(anns.indexOf(a) + 1), [anns]);
  const markableOnActive = useMemo(
    () => anns.filter((a) => (a.imageIndex ?? 0) === activeImg && isMarkable(a)),
    [anns, activeImg],
  );
  const pageCount = useMemo(() => Math.max(images.length, ...anns.map((a) => (a.imageIndex ?? 0) + 1), 1), [images, anns]);
  const hasImagesForViewer = images.length > 0 && markableOnActive.length >= 0 && images.length > 0;
  const scorePct = Math.max(0, Math.min(100, result?.scorePercent ?? (result?.marksObtained && result?.marksTotal ? Math.round((result.marksObtained / result.marksTotal) * 100) : 0)));
  const rewriteCount = anns.filter((a) => a.needsRewrite).length;

  /* --------------------------------- render --------------------------------- */

  return (
    <Layout
      title="AI Answer Checker — Strict CBSE 2026 Board Examiner"
      description="Upload photos of your answer copy, attach PDF/Word/Excel/PPT files, or type your answer. The strictest CBSE 2026-pattern AI examiner pins every error with red circles, rectangles and arrows, gives remarks, and writes the perfect answer for you."
      canonical="/answer-checker"
    >
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <div className="mb-8 page-intro p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)] font-medium">Answer Checker</span>
          </nav>
          <span className="badge-2026 mb-3 inline-flex">2026 Board Pattern · Strictest Examiner</span>
          <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-2 mt-1 flex items-center gap-2">
            <ScanSearch className="text-red-500" size={28} /> AI Answer Checker
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-xl">
            Upload your written copy, click a photo, attach a PDF/Word/Excel/PPT — ya seedha apna answer type karo. <span className="font-semibold text-[var(--text-primary)]">Examiner Nova</span> checks everything like the harshest CBSE evaluator:
            <span className="text-red-500 font-semibold"> red circles</span> &amp; <span className="text-red-500 font-semibold">rectangles</span> pin-point errors,
            arrows explain why marks are cut, and weak lines get <span className="underline decoration-wavy decoration-yellow-500">underlined with remarks</span>.
          </p>
        </div>

        {/* Input card */}
        {!checking && !result && (
          <div className="card p-5 sm:p-6">
            {/* Mode tabs */}
            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-[var(--surface-2)] p-1">
              {([
                { id: 'upload' as const, label: 'Upload / Scan Copy', icon: Camera },
                { id: 'typed' as const, label: 'Type Your Answer', icon: TypeIcon },
              ]).map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setMode(id)}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                    mode === id ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {mode === 'upload' ? (
              <>
                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); handleDroppedFiles(Array.from(e.dataTransfer.files)); }}
                  onClick={() => galleryInputRef.current?.click()}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-8 ${
                    dragActive ? 'border-red-500 bg-red-500/5' : 'border-[var(--border)] hover:border-red-400/60 hover:bg-red-500/[0.03]'}`}
                >
                  <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
                    <Upload size={26} />
                  </div>
                  <p className="font-display font-bold text-[var(--text-primary)]">Drag &amp; drop your copy here</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    Images, PDF, Word, Excel, PowerPoint · up to 6 photos + 4 files
                  </p>
                </div>

                {/* Action buttons */}
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => { addImageFiles(Array.from(e.target.files || [])); e.currentTarget.value = ''; }} />
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => { addImageFiles(Array.from(e.target.files || [])); e.currentTarget.value = ''; }} />
                  <input ref={docInputRef} type="file" accept={DOC_ACCEPT} multiple className="hidden"
                    onChange={(e) => { addDocs(Array.from(e.target.files || [])); e.currentTarget.value = ''; }} />

                  <button onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-500/40 bg-red-500/5 px-3 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-500/15 dark:text-red-400">
                    <Camera size={17} /> Click Image
                  </button>
                  <button onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-500/40 bg-blue-500/5 px-3 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-500/15 dark:text-blue-400">
                    <ImageIcon size={17} /> Upload Image
                  </button>
                  <button onClick={() => docInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-violet-500/40 bg-violet-500/5 px-3 py-3 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-500/15 dark:text-violet-400">
                    <FileType2 size={17} /> Attach Files
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] leading-snug text-[var(--text-muted)]">
                  📷 <b>Click Image</b> opens your camera · 🖼 <b>Upload Image</b> picks from gallery/files · 📎 <b>Attach Files</b> for PDF / Word / Excel / PPT
                </p>

                {/* Image thumbs */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {images.map((img, i) => (
                      <div key={img.id} className="group relative overflow-hidden rounded-lg border border-[var(--border)] aspect-[3/4]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.previewUrl} alt={`Page ${i + 1}`} className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">{i + 1}</span>
                        <button onClick={() => removeImage(img.id)}
                          className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Remove"><X size={11} /></button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Doc chips */}
                {docs.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {docs.map((d) => {
                      const Icon = docIcon(d.name);
                      return (
                        <span key={d.id} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                          <Icon size={13} className="text-violet-500" /> {d.name}
                          <button onClick={() => removeDoc(d.id)} className="ml-0.5 text-[var(--text-muted)] hover:text-red-500" aria-label={`Remove ${d.name}`}><X size={12} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* Typed mode */
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Question *</label>
                  <input value={questionContext} onChange={(e) => setQuestionContext(e.target.value)}
                    placeholder="e.g. Q. Describe the process of photosynthesis (3 marks)"
                    className="input-field w-full px-3.5 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Your Answer *</label>
                  <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)}
                    rows={10}
                    placeholder="Type exactly what you would write in the exam — points, steps, definitions…"
                    className="input-field w-full resize-y px-3.5 py-3 text-sm leading-relaxed" />
                  <p className="mt-1 text-right text-[10px] text-[var(--text-muted)]">{answerText.trim().length} characters</p>
                </div>
              </div>
            )}

            {/* Shared options */}
            <div className="mt-4 grid gap-3 sm:grid-cols-[200px_1fr]">
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field px-3 py-2.5 text-sm">
                <option value="">Subject (auto-detect)</option>
                {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {mode === 'upload' && (
                <input value={questionContext} onChange={(e) => setQuestionContext(e.target.value)}
                  placeholder="Optional: which question / chapter? e.g. 'Ch 3 — Long answer Q14'"
                  className="input-field px-3 py-2.5 text-sm" />
              )}
            </div>

            <button onClick={runCheck} disabled={checking || !canSubmit}
              className="btn-primary mt-4 flex w-full items-center justify-center gap-2 text-sm disabled:opacity-50 sm:w-auto">
              <ClipboardCheck size={16} /> Evaluate My Answer
            </button>
            <p className="mt-2 text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <AlertTriangle size={11} className="text-amber-500" /> Strict mode: expect brutal honesty. Full marks are rare here.
            </p>
          </div>
        )}

        {/* Checking */}
        {checking && (
          <div className="card p-8 text-center">
            <div className="relative mx-auto mb-5 grid size-20 place-items-center">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-red-500/20 border-t-red-500" style={{ animationDuration: '1.6s' }} />
              <ScanSearch className="text-red-500" size={30} />
            </div>
            <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">Examiner Nova is checking your answer</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)] flex items-center justify-center gap-2">
              <Loader2 size={13} className="animate-spin" /> {CHECKING_STAGES[stageIdx]}
            </p>
            <div className="mx-auto mt-5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[var(--surface-2)]">
              <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-700" style={{ width: `${((stageIdx + 1) / CHECKING_STAGES.length) * 92}%` }} />
            </div>
          </div>
        )}

        {/* Results */}
        {result && !checking && (
          <div ref={resultsRef} className="space-y-5 scroll-mt-20">

            {/* Verdict card */}
            <div className="card overflow-hidden">
              <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center">
                <div className="relative mx-auto size-32 flex-shrink-0 md:mx-0">
                  <div className="size-32 rounded-full" style={{
                    background: `conic-gradient(${scorePct >= 75 ? '#22c55e' : scorePct >= 50 ? '#f59e0b' : '#ef4444'} ${scorePct * 3.6}deg, var(--surface-2) 0deg)`,
                  }} />
                  <div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-[var(--surface-0)]">
                    <span className="text-2xl font-extrabold text-[var(--text-primary)]">{result.marksObtained ?? '-'}/{result.marksTotal ?? '-'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Grade {result.grade || '-'}</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${scorePct >= 75 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : scorePct >= 50 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                      Board Verdict
                    </span>
                    {rewriteCount > 0 && (
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">
                        {rewriteCount} answer{rewriteCount > 1 ? 's' : ''} worth rewriting
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold text-[var(--text-primary)]">{result.verdict || 'Evaluated'}</h2>
                  {result.detectedQuestion && (
                    <p className="mt-1 truncate text-xs text-[var(--text-muted)]"><Target size={11} className="mr-1 inline" />{result.detectedQuestion}</p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{result.summary}</p>
                  <div className="mt-3 flex justify-center md:justify-start">
                    <button onClick={resetAll}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400">
                      <RotateCcw size={12} /> Check Another Answer
                    </button>
                  </div>
                </div>
              </div>

              {Array.isArray(result.criteria) && result.criteria.length > 0 && (
                <div className="border-t border-[var(--border)] p-5 sm:p-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">2026 Pattern Scorecard</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {result.criteria.map((c, i) => {
                      const pct = c.max > 0 ? Math.round((c.score / c.max) * 100) : 0;
                      return (
                        <div key={`${c.name}-${i}`}>
                          <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                            <span className="font-semibold text-[var(--text-secondary)]">{c.name}</span>
                            <span className="font-mono text-[var(--text-muted)]">{c.score}/{c.max}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                            <div className={`h-full rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          {c.note && <p className="mt-1 text-[11px] leading-snug text-[var(--text-muted)]">{c.note}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Annotated copy */}
            {hasImagesForViewer && images[activeImg] && (
              <div className="card p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <PenLine size={16} className="text-red-500" /> Your Copy — Marked by Examiner Nova
                  </h3>
                  {pageCount > 1 && (
                    <div className="flex gap-1.5">
                      {Array.from({ length: pageCount }).map((_, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                            activeImg === i ? 'bg-red-500 text-white' : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                          Page {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative mx-auto max-w-2xl select-none overflow-hidden rounded-xl border-2 border-red-500/30 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[activeImg].previewUrl} alt={`Checked page ${activeImg + 1}`} className="block w-full" />
                  <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    {markableOnActive.map((a) => (
                      <AnnotationOverlay key={a.id} ann={a} active={activeAnn === a.id} dimmed={activeAnn !== null && activeAnn !== a.id}
                        onSelect={() => setActiveAnn(activeAnn === a.id ? null : a.id)} />
                    ))}
                    {markableOnActive.map((a) => (
                      <AnnotationArrow key={`t-${a.id}`} ann={a} active={activeAnn === a.id} dimmed={activeAnn !== null && activeAnn !== a.id} />
                    ))}
                  </svg>
                  {markableOnActive.map((a) => (
                    <AnnotationTag key={`g-${a.id}`} ann={a} num={annNum(a)} active={activeAnn === a.id} dimmed={activeAnn !== null && activeAnn !== a.id}
                      onSelect={() => setActiveAnn(activeAnn === a.id ? null : a.id)} />
                  ))}
                  {markableOnActive.map((a) => (
                    <MarkerChip key={`m-${a.id}`} ann={a} num={annNum(a)} onSelect={() => setActiveAnn(activeAnn === a.id ? null : a.id)} />
                  ))}
                  {markableOnActive.length === 0 && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-center">
                      <span className="text-xs font-semibold text-white">No marked errors on this page</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-medium text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm border-2 border-red-500" /> Wrong content / calculation</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-orange-500" /> Small localized error</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-yellow-500" /> Weak quality line</span>
                </div>
              </div>
            )}

            {/* Remarks list */}
            {anns.length > 0 && (
              <div className="card p-5 sm:p-6">
                <h3 className="mb-4 font-display text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <FileImage size={16} className="text-red-500" /> Examiner Nova&apos;s Remarks ({anns.length})
                </h3>
                <div className="space-y-3">
                  {anns.map((a) => {
                    const meta = SEVERITY_META[a.severity];
                    const ws = writes[a.id] || { status: 'idle' as const };
                    const num = annNum(a);
                    return (
                      <div key={a.id}
                        onMouseEnter={() => isMarkable(a) && setActiveAnn(a.id)}
                        onFocus={() => setActiveAnn(a.id)}
                        onMouseLeave={() => setActiveAnn(null)}
                        className={`rounded-xl border p-3.5 transition-shadow ${meta.border} ${activeAnn === a.id ? 'shadow-lg shadow-red-500/10' : ''} ${meta.bg}`}>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid size-6 flex-shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: meta.color }}>{num}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-sm font-bold ${meta.text}`}>{a.label}</span>
                              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${meta.border} ${meta.text}`}>{SEVERITY_LABEL[a.severity]}</span>
                              {typeof a.marksLost === 'number' && a.marksLost > 0 && (
                                <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">−{a.marksLost} mark{a.marksLost > 1 ? 's' : ''}</span>
                              )}
                              {isMarkable(a) && (a.imageIndex ?? 0) !== activeImg && images.length > 1 && (
                                <button onClick={() => setActiveImg(a.imageIndex ?? 0)} className="text-[10px] font-semibold text-blue-500 hover:underline">Show on page {(a.imageIndex ?? 0) + 1} →</button>
                              )}
                            </div>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                              <ArrowRight size={12} className="mr-1 inline text-[var(--text-muted)]" />{a.explanation}
                            </p>
                            <p className="mt-1 text-[12px] font-medium italic text-[var(--text-muted)]">✍️ “{a.remark}”</p>

                            {a.needsRewrite && (
                              <div className="mt-3">
                                {ws.status !== 'done' ? (
                                  <button onClick={() => writeForMe(a)} disabled={ws.status === 'loading'}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-transform hover:scale-[1.03] disabled:opacity-60">
                                    {ws.status === 'loading'
                                      ? <><Loader2 size={13} className="animate-spin" /> Writing the perfect answer…</>
                                      : <><Sparkles size={13} /> Write It For Me</>}
                                  </button>
                                ) : (
                                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3.5">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                                        <BookOpenCheck size={13} /> Full-Marks Model Answer (2026 pattern)
                                      </span>
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => { navigator.clipboard.writeText(ws.answer || '').then(() => toast.success('Copied')); }}
                                          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-2)]">
                                          <Copy size={10} /> Copy
                                        </button>
                                        <button onClick={() => setWrites((w) => ({ ...w, [a.id]: { status: 'idle' } }))}
                                          className="grid size-6 place-items-center rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)]" aria-label="Close"><X size={12} /></button>
                                      </div>
                                    </div>
                                    <MathRenderer text={ws.answer || ''} className="block text-sm leading-relaxed text-[var(--text-secondary)]" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strengths + next steps */}
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.isArray(result.strengths) && result.strengths.length > 0 && (
                <div className="card p-5">
                  <h3 className="mb-2.5 text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5"><CheckCircle2 size={15} /> What earned marks</h3>
                  <ul className="space-y-1.5">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-snug text-[var(--text-secondary)]"><CheckCircle2 size={13} className="mt-0.5 flex-shrink-0 text-green-500" />{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Array.isArray(result.nextSteps) && result.nextSteps.length > 0 && (
                <div className="card p-5">
                  <h3 className="mb-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"><Target size={15} /> Fix before boards</h3>
                  <ul className="space-y-1.5">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-snug text-[var(--text-secondary)]"><ChevronLeft size={13} className="mt-0.5 flex-shrink-0 rotate-180 text-blue-500" />{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* How it works strip (pre-check) */}
        {!checking && !result && (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Camera, title: '1 · Add your answer', desc: 'Click a photo, upload from gallery, attach PDF/Word/Excel/PPT — ya seedha type kar do.' },
              { icon: ScanSearch, title: '2 · Strict evaluation', desc: 'Red circles, rectangles & arrows pin-point every error on the image itself.' },
              { icon: Sparkles, title: '3 · Fix instantly', desc: 'Tap “Write It For Me” under any weak remark for the full-marks answer.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-4">
                <Icon size={18} className="mb-2 text-red-500" />
                <p className="text-sm font-bold text-[var(--text-primary)]">{title}</p>
                <p className="mt-0.5 text-xs leading-snug text-[var(--text-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
