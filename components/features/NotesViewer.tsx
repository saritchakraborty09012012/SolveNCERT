import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Copy, Download, Share2, ThumbsUp, ThumbsDown,
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import ReadAloud from './ReadAloud';
import type { NotesData, NotesPage } from '@/types/database';

interface Props {
  notes: NotesData;
  noteId?: string;
  onRate?: (rating: 'up' | 'down') => void;
  currentRating?: string | null;
  onShare?: () => void;
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <span key={i} className="notes-bold">{part.slice(2, -2)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

function NotesPageContent({ page, title, pageNum, totalPages }: {
  page: NotesPage;
  title: string;
  pageNum: number;
  totalPages: number;
}) {
  return (
    <div className="notes-page-content">
      {pageNum === 1 && (
        <div className="notes-page-title">{title}</div>
      )}
      {page.sections.map((section, si) => (
        <div key={si} className="notes-section">
          <div className="notes-section-heading">{section.heading}</div>
          {section.content && (
            <div className="notes-section-content">
              {renderBoldText(section.content)}
            </div>
          )}
          {section.bulletPoints && section.bulletPoints.length > 0 && (
            <ul className="notes-bullet-list">
              {section.bulletPoints.map((bp, bi) => (
                <li key={bi}>{renderBoldText(bp)}</li>
              ))}
            </ul>
          )}
          {section.subsections && section.subsections.map((sub, subi) => (
            <div key={subi}>
              <div className="notes-subsection-heading">{sub.heading}</div>
              <div className="notes-subsection-content">{renderBoldText(sub.content)}</div>
            </div>
          ))}
          {section.table && (
            <table className="notes-table">
              <thead>
                <tr>
                  {section.table.headers.map((h, hi) => (
                    <th key={hi}>{renderBoldText(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{renderBoldText(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      <div className="notes-page-number">{pageNum} / {totalPages}</div>
      <div className="notes-novexa-footer">SolveNCERT by Novexa</div>
    </div>
  );
}

export default function NotesViewer({ notes, noteId, onRate, currentRating, onShare }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flip, setFlip] = useState<{ dir: 'next' | 'prev'; from: number; to: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pages = notes.pages || [];
  const totalPages = pages.length;
  const flipping = flip !== null;

  function goToPage(idx: number) {
    if (flipping || idx < 0 || idx >= totalPages || idx === currentPage) return;
    if (idx > currentPage) startFlip('next', idx);
    else startFlip('prev', idx);
  }

  function startFlip(dir: 'next' | 'prev', target?: number) {
    if (flipping) return;
    const to = target !== undefined ? target : dir === 'next' ? currentPage + 1 : currentPage - 1;
    if (to < 0 || to >= totalPages) return;
    if (dir === 'next') {
      // Base switches to destination immediately; leaf (old page) flips away on top.
      setCurrentPage(to);
      setFlip({ dir, from: currentPage, to });
    } else {
      // Base keeps showing the current page; leaf folds back in from the left.
      setFlip({ dir, from: currentPage, to });
    }
  }

  function handleFlipEnd() {
    if (flip && flip.dir === 'prev') setCurrentPage(flip.to);
    setFlip(null);
  }

  function prevPage() { startFlip('prev'); }
  function nextPage() { startFlip('next'); }

  function handleZoomIn() { setZoom(z => Math.min(z + 0.15, 2)); }
  function handleZoomOut() { setZoom(z => Math.max(z - 0.15, 0.5)); }
  function handleResetZoom() { setZoom(1); }
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  function copyPageText() {
    const page = pages[currentPage];
    if (!page) return;
    let text = '';
    if (currentPage === 0) text += notes.title + '\n\n';
    for (const section of page.sections) {
      text += section.heading + '\n';
      if (section.content) text += section.content.replace(/\*\*/g, '') + '\n';
      if (section.bulletPoints) {
        for (const bp of section.bulletPoints) {
          text += '  - ' + bp.replace(/\*\*/g, '') + '\n';
        }
      }
      text += '\n';
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (flipping) return;
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const pageText = (() => {
    const page = pages[currentPage];
    if (!page) return '';
    let text = '';
    if (currentPage === 0) text += notes.title + '. ';
    for (const section of page.sections) {
      text += section.heading + '. ';
      if (section.content) text += section.content.replace(/\*\*/g, '') + ' ';
      if (section.bulletPoints) {
        for (const bp of section.bulletPoints) text += bp.replace(/\*\*/g, '') + '. ';
      }
    }
    return text;
  })();

  if (totalPages === 0) return null;

  return (
    <div ref={containerRef} className="notes-notebook">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-0)] border-b border-[var(--border)] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{notes.title}</span>
          <span className="text-xs text-[var(--text-muted)]">Page {currentPage + 1} of {totalPages}</span>
        </div>
        <div className="flex items-center gap-1">
          <ReadAloud text={pageText} size="sm" />
          <button
            onClick={copyPageText}
            title={copied ? 'Copied!' : 'Copy page text'}
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onShare}
            title="Share notes"
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Share2 size={14} />
          </button>
          <div className="flex items-center gap-0.5 ml-1">
            <button
              onClick={() => onRate?.('up')}
              title="Helpful"
              className={cn('p-1.5 rounded-lg transition-colors', currentRating === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]')}
            >
              <ThumbsUp size={13} fill={currentRating === 'up' ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => onRate?.('down')}
              title="Not helpful"
              className={cn('p-1.5 rounded-lg transition-colors', currentRating === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]')}
            >
              <ThumbsDown size={13} fill={currentRating === 'down' ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Page spread with 3D flip */}
      <div className="notes-single-page" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div className={cn('notes-flip-stage', flipping && 'is-flipping')}>
          <div className={cn('notes-page', currentPage % 2 === 0 ? 'notes-page-left' : 'notes-page-right')}>
            <NotesPageContent
              page={pages[currentPage]}
              title={notes.title}
              pageNum={currentPage + 1}
              totalPages={totalPages}
            />
          </div>
          <div className="notes-flip-shade" />
          {flip && (
            <div
              key={`${flip.dir}-${flip.from}-${flip.to}`}
              className={cn('notes-flip-leaf', flip.dir === 'next' ? 'notes-flip-next' : 'notes-flip-prev')}
              onAnimationEnd={handleFlipEnd}
            >
              <div className="notes-flip-face notes-flip-face-front">
                <div className={cn('notes-page', 'h-full')}>
                  <NotesPageContent
                    page={pages[flip.dir === 'next' ? flip.from : flip.to]}
                    title={notes.title}
                    pageNum={(flip.dir === 'next' ? flip.from : flip.to) + 1}
                    totalPages={totalPages}
                  />
                </div>
              </div>
              <div className="notes-flip-face notes-flip-face-back">
                <div className="notes-flip-blank" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevPage}
        disabled={currentPage === 0 || flipping}
        className="notes-nav-arrow notes-nav-arrow-left"
        title="Previous page"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextPage}
        disabled={currentPage >= totalPages - 1 || flipping}
        className="notes-nav-arrow notes-nav-arrow-right"
        title="Next page"
      >
        <ChevronRight size={24} />
      </button>

      {/* Page dots */}
      <div className="flex justify-center gap-1.5 py-3">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              i === currentPage ? 'bg-[var(--brand-primary)] w-5' : 'bg-[var(--surface-3)] hover:bg-[var(--surface-2)]'
            )}
          />
        ))}
      </div>

      {/* Zoom controls */}
      <div className="notes-zoom-controls">
        <button onClick={handleZoomOut} className="notes-zoom-btn" title="Zoom out">
          <ZoomOut size={16} />
        </button>
        <button onClick={handleResetZoom} className="notes-zoom-btn" title="Reset zoom">
          <RotateCcw size={14} />
        </button>
        <button onClick={handleZoomIn} className="notes-zoom-btn" title="Zoom in">
          <ZoomIn size={16} />
        </button>
        <button onClick={toggleFullscreen} className="notes-zoom-btn" title="Fullscreen">
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
}
