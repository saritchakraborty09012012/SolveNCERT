import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Shuffle, RotateCcw,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import ReadAloud from './ReadAloud';
import type { FlashcardsData, FlashcardData } from '@/types/database';

interface Props {
  flashcards: FlashcardsData;
  flashcardId?: string;
  onRate?: (rating: 'up' | 'down') => void;
  currentRating?: string | null;
}

const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

export default function FlashcardsViewer({ flashcards, flashcardId, onRate, currentRating }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [zoom, setZoom] = useState(1);

  const cards = flashcards.cards || [];
  const totalCards = cards.length;
  const card: FlashcardData | undefined = cards[currentIndex];

  function goTo(idx: number) {
    if (idx >= 0 && idx < totalCards) {
      setFlipped(false);
      setCurrentIndex(idx);
    }
  }

  function shuffleCards() {
    const indices = Array.from({ length: totalCards }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // Reorder cards using Fisher-Yates shuffle
    const shuffled = [...cards];
    for (let i = 0; i < totalCards; i++) {
      shuffled[i] = cards[indices[i]];
    }
    // Can't directly set cards, so we'll just jump to random
    const randomIdx = Math.floor(Math.random() * totalCards);
    setFlipped(false);
    setCurrentIndex(randomIdx);
  }

  function renderBoldText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} className="font-bold">{part.slice(2, -2)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  if (totalCards === 0) return null;

  return (
    <div className="notes-notebook">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-0)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--text-primary)]">{flashcards.title}</span>
          <span className="text-xs text-[var(--text-muted)]">{currentIndex + 1} / {totalCards}</span>
          {card && (
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', DIFFICULTY_COLORS[card.difficulty])}>
              {card.difficulty}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={shuffleCards}
            title="Shuffle"
            className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Shuffle size={14} />
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

      {/* Flashcard */}
      <div className="flex justify-center py-8 px-4" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
        <div
          className="flashcard-container"
          onClick={() => setFlipped(f => !f)}
          style={{ cursor: 'pointer' }}
        >
          <div className={cn('flashcard-inner', flipped && 'flipped')}>
            {/* Front */}
            <div className="flashcard-front">
              {card?.category && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--naccent)] mb-3 opacity-70">
                  {card.category}
                </span>
              )}
              <p className="text-lg font-semibold leading-relaxed" style={{ fontFamily: "'Kalam', cursive" }}>
                {card ? renderBoldText(card.front) : ''}
              </p>
              <span className="text-[10px] text-[var(--nink-soft)] mt-4 opacity-50">Tap to flip</span>
            </div>
            {/* Back */}
            <div className="flashcard-back">
              <p className="text-sm leading-relaxed opacity-90" style={{ fontFamily: "'Kalam', cursive" }}>
                {card ? renderBoldText(card.back) : ''}
              </p>
              <span className="text-[10px] opacity-40 mt-4">Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 py-3">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page dots - show 5 around current */}
        <div className="flex gap-1.5">
          {cards.map((_, i) => {
            if (Math.abs(i - currentIndex) > 4 && i !== 0 && i !== totalCards - 1) {
              if (Math.abs(i - currentIndex) === 5) return <span key={i} className="text-[var(--text-muted)]">...</span>;
              return null;
            }
            return (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentIndex ? 'bg-purple-500 w-5' : 'bg-[var(--surface-3)] hover:bg-[var(--surface-2)]'
                )}
              />
            );
          })}
        </div>

        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === totalCards - 1}
          className="p-2 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--surface-3)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Zoom */}
      <div className="notes-zoom-controls">
        <button onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))} className="notes-zoom-btn" title="Zoom out">
          <ZoomOut size={16} />
        </button>
        <button onClick={() => setZoom(1)} className="notes-zoom-btn" title="Reset zoom">
          <RotateCcw size={14} />
        </button>
        <button onClick={() => setZoom(z => Math.min(z + 0.15, 2))} className="notes-zoom-btn" title="Zoom in">
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
}
