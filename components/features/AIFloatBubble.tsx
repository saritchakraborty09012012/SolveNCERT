import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, Sparkles, Loader2 } from 'lucide-react';
import MicButton from './MicButton';
import FileAttach, { AttachedFile } from './FileAttach';
import ReadAloud from './ReadAloud';
import MathRenderer from './MathRenderer';
import AutoGrowTextarea from './AutoGrowTextarea';
import { useFeedbackStore } from '@/store/feedbackStore';
import { cn } from '@/utils/helpers';

type Mode = 'doubt' | 'explain' | 'simplify' | 'revision' | 'logic';
const MODES: { id: Mode; label: string }[] = [
  { id: 'doubt',    label: 'Ask Doubt' },
  { id: 'explain',  label: 'Explain'   },
  { id: 'simplify', label: 'Simplify'  },
  { id: 'revision', label: 'Revise'    },
  { id: 'logic',    label: 'Logic'     },
];
const MODE_LABEL: Record<Mode, string> = Object.fromEntries(MODES.map(m => [m.id, m.label])) as Record<Mode, string>;

/** Auto-select the mode from the user's prompt (English + Hinglish cues). */
function detectMode(q: string): Mode {
  const t = ` ${q.toLowerCase()} `;
  if (/\b(revise|revision|recap|summar(y|ise|ize)|quick notes|revison)\b/.test(t)) return 'revision';
  if (/\b(simplif(y|ied)|simple(r|st)? words?|easy(er)? language|in simple|aasan|asaan|saral|aarambh)\b/.test(t)) return 'simplify';
  if (/\b(why|reason|logic|justify|prove|kyu|kyun|kyo|kaaran|karan|wajah)\b|how (does|do|can|did)\b/.test(t)) return 'logic';
  if (/\b(explain|elaborate|describe|define|meaning|means|difference between|compare|samjhao|samjha|batao|what is|what are|what was|what were)\b/.test(t)) return 'explain';
  return 'doubt';
}

interface Msg { role: 'user' | 'ai'; text: string; mode?: Mode; }

export default function AIFloatBubble({ isOpen, onToggle, initialContext }: { isOpen: boolean; onToggle: () => void; initialContext?: { context: string; prompt: string } | null }) {
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor);
  const [mode,    setMode]    = useState<Mode>('doubt');
  const [query,   setQuery]   = useState('');
  const [msgs,    setMsgs]    = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [files,   setFiles]   = useState<AttachedFile[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (initialContext) setQuery(initialContext.prompt); }, [initialContext]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  async function send(forcedQuery?: string, forcedContext?: string) {
    if ((!(forcedQuery || query.trim()) && files.length === 0) || loading) return;
    const typedQuery = forcedQuery || query.trim() || '(Attached file — please analyse)';
    const selectedText = forcedContext || initialContext?.context;
    const userText = selectedText ? `${typedQuery}\n\nSelected text: ${selectedText}` : typedQuery;
    // Auto-select the mode from the prompt (visible on the tab + message chip)
    const detectedMode = detectMode(typedQuery);
    setMode(detectedMode);
    setQuery('');
    setMsgs(prev => [...prev, { role: 'user', text: userText, mode: detectedMode }]);
    setLoading(true);

    const fileContent = files.map(f => `[File: ${f.name}]\n${f.content.slice(0, 2000)}`).join('\n\n');
    setFiles([]);

    try {
      const res  = await fetch('/api/ai/ask', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userText, mode: detectedMode, fileContent }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: 'ai', text: data.answer || 'Sorry, could not respond.' }]);
      showAiRatingFor('ai-doubt-solver');
    } catch {
      setMsgs(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  }
  useEffect(() => {
    if (initialContext?.prompt) send(initialContext.prompt, initialContext.context);
    // A selected-text action is a one-time automatic request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContext]);

  if (!isOpen) {
    return (
      <button onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold shadow-soft-lg hover:shadow-glow-blue transition-all hover:-translate-y-0.5"
        aria-label="Open AI">
        <Brain size={16} /><span className="hidden sm:inline">AI</span>
      </button>
    );
  }

  return (
    <div className="w-[calc(100vw-1rem)] sm:w-[380px] max-w-[380px] flex flex-col bg-[var(--surface-0)] border border-[var(--border)] rounded-2xl shadow-soft-xl overflow-hidden animate-slide-up" style={{ maxHeight: 'min(520px, calc(100dvh - 6rem))' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
        <div className="flex items-center gap-2"><Sparkles size={14} /><span className="text-sm font-semibold">SolveNCERT AI</span></div>
        <button onClick={onToggle} aria-label="Close AI assistant" className="p-2 -mr-1 rounded-lg hover:bg-white/20 transition-colors"><X size={18} /></button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 px-3 py-2 overflow-x-auto bg-[var(--surface-1)] border-b border-[var(--border)] flex-shrink-0 scrollbar-hide">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={cn('method-tab flex-shrink-0 text-[11px] px-3 py-1.5', mode === m.id ? 'method-tab-active' : 'method-tab-inactive')}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[160px]">
        {msgs.length === 0 && (
          <div className="text-center py-6">
            <Brain size={26} className="mx-auto text-blue-400 mb-2" />
            <p className="text-xs text-[var(--text-muted)]">Ask me anything about your NCERT chapters!</p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">You can also attach files, images, or use voice input</p>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
            {m.role === 'user' && m.mode && (
              <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-500">
                <Sparkles size={8} /> Auto: {MODE_LABEL[m.mode]}
              </span>
            )}
            <div className={cn('max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed',
              m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-[var(--surface-2)] text-[var(--text-secondary)] rounded-bl-sm')}>
              {m.role === 'ai' ? <MathRenderer text={m.text} /> : m.text}
            </div>
            {m.role === 'ai' && (
              <div className="flex items-center gap-1 mt-1 ml-1">
                <ReadAloud text={m.text} size="sm" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[var(--surface-2)] px-3 py-2 rounded-xl rounded-bl-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="px-3 pb-1 flex-shrink-0">
          <FileAttach files={files} onChange={setFiles} />
        </div>
      )}

      {/* Input row */}
      <div className="p-3 border-t border-[var(--border)] flex items-center gap-2 flex-shrink-0">
        {/* Attach */}
        <FileAttach files={[]} onChange={f => setFiles(prev => [...prev, ...f].slice(0,5))} />

        <div className="flex-1 min-w-0">
          {initialContext && <div className="mb-1 truncate rounded-md bg-blue-50 dark:bg-blue-950/30 px-2 py-1 text-[10px] text-blue-700 dark:text-blue-300">Selected: “{initialContext.context}”</div>}
          <AutoGrowTextarea
            value={query}
            onChange={setQuery}
            onEnter={() => send()}
            placeholder="Ask your doubt…"
            className="input-field text-xs py-2 w-full"
          />
        </div>

        {/* Mic — live transcription + auto-send */}
        <MicButton
          onInterim={t => setQuery(t)}
          onResult={t => { setQuery(t); send(t); }}
          size="sm"
        />

        {/* Send */}
        <button onClick={() => send()} disabled={loading || (!query.trim() && files.length === 0)}
          className="flex-shrink-0 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all">
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
