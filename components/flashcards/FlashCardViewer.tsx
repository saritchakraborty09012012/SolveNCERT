import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, BookmarkCheck, Copy, Download,
  Maximize2, Minimize2, Menu, Share2, Volume2, VolumeX, X, Check, ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils/helpers';

interface FlashCardViewerProps {
  classLevel: number;
  subject: string;
  book: string;
  chapter: string;
  chapterNumber: number;
  pages: { questions: { question: string; answer: string }[] }[];
  shareToken?: string;
  onBack?: () => void;
}

const SUBJECT_COLORS: Record<string, { from: string; to: string; ring: string }> = {
  Mathematics:    { from: '#3b82f6', to: '#6366f1', ring: '#818cf8' },
  Science:        { from: '#22c55e', to: '#10b981', ring: '#34d399' },
  'Social Science': { from: '#f59e0b', to: '#f97316', ring: '#fbbf24' },
  English:        { from: '#f43f5e', to: '#ec4899', ring: '#fb7185' },
  Hindi:          { from: '#a855f7', to: '#7c3aed', ring: '#c084fc' },
  Sanskrit:       { from: '#14b8a6', to: '#06b6d4', ring: '#2dd4bf' },
};

export default function FlashCardViewer({
  classLevel, subject, book, chapter, chapterNumber, pages, shareToken, onBack,
}: FlashCardViewerProps) {
  const totalPages = pages.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const containerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const colors = SUBJECT_COLORS[subject] || SUBJECT_COLORS.Mathematics;
  const currentQuestions = pages[currentPage]?.questions || [];

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    speechRef.current = null;
  }, []);

  useEffect(() => () => stopSpeaking(), [stopSpeaking]);

  const goToPage = useCallback((p: number) => {
    if (p >= 0 && p < totalPages) {
      setCurrentPage(p);
      setExpanded(new Set());
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      else if (e.key === 'ArrowLeft') prevPage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nextPage, prevPage]);

  const handleReadAloud = useCallback(() => {
    if (isSpeaking) { stopSpeaking(); return; }
    const synth = window.speechSynthesis;
    synth.cancel();
    const parts: string[] = [];
    currentQuestions.forEach((q, i) => {
      parts.push('Question ' + (i + 1) + '. ' + q.question);
      parts.push('Answer. ' + q.answer);
    });
    const utter = new SpeechSynthesisUtterance(parts.join('. '));
    utter.rate = 0.95;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    speechRef.current = utter;
    setIsSpeaking(true);
    synth.speak(utter);
  }, [isSpeaking, stopSpeaking, currentQuestions]);

  const handleCopy = useCallback(async () => {
    const text = currentQuestions.map((q, i) => 'Q' + (i + 1) + ': ' + q.question + '\nA: ' + q.answer).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentQuestions]);

  const handleDownloadPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const m = 20; let y = m;
    doc.setFontSize(18); doc.text(subject + ' - Class ' + classLevel, m, y); y += 12;
    doc.setFontSize(14); doc.text(chapter + ' (Ch.' + chapterNumber + ')', m, y); y += 10;
    doc.setFontSize(10); doc.text('Book: ' + book, m, y); y += 12;
    pages.forEach((page, pi) => {
      if (y > 240) { doc.addPage(); y = m; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Page ' + (pi + 1), m, y); y += 8;
      page.questions.forEach((q, qi) => {
        if (y > 260) { doc.addPage(); y = m; }
        doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
        const ql = doc.splitTextToSize('Q' + (qi + 1) + '. ' + q.question, 170);
        doc.text(ql, m, y); y += ql.length * 7;
        doc.setFont('helvetica', 'normal');
        const al = doc.splitTextToSize('A. ' + q.answer, 170);
        doc.text(al, m + 4, y); y += al.length * 7 + 4;
      });
      y += 4;
    });
    doc.save(subject + '_Class' + classLevel + '_' + chapter + '_FlashCards.pdf');
  }, [classLevel, subject, book, chapter, chapterNumber, pages]);

  const handleShare = useCallback(async () => {
    const url = shareToken
      ? window.location.origin + '/flash-cards/share/' + shareToken
      : window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareToken]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[85vh] flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0a0618 0%, #12082a 50%, #0a0618 100%)' }}>

      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0a0618]/80 backdrop-blur-md border-b border-purple-900/20">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(s => !s)} className="lg:hidden p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 transition-colors">
            <Menu size={20} />
          </button>
          <button onClick={onBack} className="hidden lg:flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-sm font-semibold text-purple-200 truncate max-w-[200px] sm:max-w-none">
            {subject} &mdash; Ch.{chapterNumber} {chapter}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-purple-400/60 mr-2 hidden sm:inline">{currentPage + 1}/{totalPages}</span>
          <button onClick={() => setIsBookmarked(b => !b)} className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-amber-400 transition-colors">
            {isBookmarked ? <BookmarkCheck size={18} className="text-amber-400" /> : <Bookmark size={18} />}
          </button>
          <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-white transition-colors">
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <button onClick={handleDownloadPdf} className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-white transition-colors"><Download size={18} /></button>
          <button onClick={handleShare} className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-white transition-colors"><Share2 size={18} /></button>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 hover:text-white transition-colors">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-[#12082a] border-r border-purple-900/40 flex flex-col">
            <div className="flex justify-end p-3"><button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-purple-300"><X size={20} /></button></div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2"><BookOpen size={20} className="text-purple-400" /><h2 className="font-bold text-white">Flash Cards</h2></div>
              <div className="space-y-3 text-sm">
                {[{ l: 'Class', v: classLevel + ' - NCERT' }, { l: 'Subject', v: subject }, { l: 'Book', v: book }, { l: 'Chapter', v: chapterNumber + '. ' + chapter }, { l: 'Pages', v: String(totalPages) }].map(i => (
                  <div key={i.l} className="flex justify-between"><span className="text-purple-400/70">{i.l}</span><span className="text-white font-medium">{i.v}</span></div>
                ))}
              </div>
              <div className="border-t border-purple-900/30 pt-4 text-xs text-purple-400/60">
                Page {currentPage + 1} of {totalPages} &middot; 4 questions per page
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="relative w-full max-w-2xl">

          {/* Left arrow */}
          <button onClick={prevPage} disabled={currentPage === 0}
            className="absolute -left-3 sm:-left-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <ArrowLeft size={20} className="text-purple-300" />
          </button>

          {/* Right arrow */}
          <button onClick={nextPage} disabled={currentPage === totalPages - 1}
            className="absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <ArrowRight size={20} className="text-purple-300" />
          </button>

          {/* Card */}
          <div className="rounded-[20px] overflow-hidden relative"
            style={{
              minHeight: '480px',
              background: 'linear-gradient(145deg, #1a0a2e 0%, #0d1b3e 60%, #1a0a2e 100%)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.08), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}>

            {/* Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colors.from}33, transparent)` }} />

            <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                  {subject}
                </span>
                <span className="text-purple-400/50 text-xs font-mono">Page {currentPage + 1}/{totalPages}</span>
              </div>

              <p className="text-purple-300/50 text-xs mb-4">Class {classLevel} &middot; {book}</p>

              {/* Questions with collapsible answers */}
              <div className="flex-1 space-y-3">
                {currentQuestions.map((q, i) => {
                  const isOpen = expanded.has(i);
                  return (
                    <div key={i}>
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                          style={{ background: `${colors.from}33`, color: colors.ring }}>
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed font-semibold">
                            {q.question}
                          </p>
                          <button
                            onClick={() => setExpanded(prev => {
                              const next = new Set(prev);
                              if (next.has(i)) next.delete(i); else next.add(i);
                              return next;
                            })}
                            className="mt-1.5 flex items-center gap-1 text-[11px] font-medium transition-colors"
                            style={{ color: isOpen ? colors.ring : 'rgba(168,130,255,0.4)' }}
                          >
                            <ChevronDown size={12} className={cn('transition-transform', isOpen && 'rotate-180')} />
                            {isOpen ? 'Hide answer' : 'Show answer'}
                          </button>
                          <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0')}>
                            <p className="text-sm text-white/60 leading-relaxed pl-0">
                              {q.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Page dots */}
              <div className="flex justify-center gap-1 mt-6 pt-4 border-t border-purple-900/20">
                {pages.map((_, i) => (
                  <div key={i} className="h-1.5 rounded-full transition-all cursor-pointer"
                    onClick={() => goToPage(i)}
                    style={{
                      width: i === currentPage ? 20 : 6,
                      background: i === currentPage ? colors.ring : 'rgba(168,130,255,0.2)',
                    }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0a0618]/80 backdrop-blur-md border-t border-purple-900/20">
        <button onClick={prevPage} disabled={currentPage === 0}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}>
          <ArrowLeft size={16} /><span className="hidden sm:inline">Prev</span>
        </button>
        <span className="text-xs sm:text-sm text-purple-400/80">{currentPage + 1} / {totalPages} pages</span>
        <div className="flex items-center gap-2">
          <button onClick={nextPage} disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}>
            <span className="hidden sm:inline">Next</span><ArrowRight size={16} />
          </button>
          <button onClick={handleReadAloud}
            className={cn('p-2 rounded-lg transition-colors', isSpeaking ? 'text-purple-200' : 'text-purple-300 hover:text-white')}
            style={{ background: isSpeaking ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.15)' }}>
            {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
