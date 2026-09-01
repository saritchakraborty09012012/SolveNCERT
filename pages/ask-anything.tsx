import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import MathRenderer from '@/components/features/MathRenderer';
import ReadAloud from '@/components/features/ReadAloud';
import MicButton from '@/components/features/MicButton';
import AutoGrowTextarea from '@/components/features/AutoGrowTextarea';
import { useFeedbackStore } from '@/store/feedbackStore';
import { cn } from '@/utils/helpers';
import { Brain, Copy, Check, Send, Sparkles, Loader2, MessagesSquare } from 'lucide-react';

interface Msg { role: 'user' | 'ai'; text: string; }

const SUGGESTIONS = [
  'Solve: Factorise x² + 5x + 6',
  'Answer key of Maths Ch1 Exercise Set 1.1',
  'Explain why the sky appears blue',
  'Summary of How I Taught My Grandmother to Read',
  'Difference between rational and irrational numbers',
];

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/\$+/g, '')); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium transition-all',
        copied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 border-green-200' : 'bg-[var(--surface-2)] text-[var(--text-muted)] border-transparent hover:border-[var(--border)]')}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export default function AskAnythingPage() {
  const showAiRatingFor = useFeedbackStore(s => s.showAiRatingFor);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, loading]);

  async function send(forced?: string) {
    const q = (forced ?? query).trim();
    if (!q || loading) return;
    const history = msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }) as { role: 'user' | 'assistant'; content: string });
    setMsgs(prev => [...prev, { role: 'user', text: q }]);
    setQuery('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/ask-anything', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, history }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: 'ai', text: data.answer || 'Sorry, could not respond.' }]);
      showAiRatingFor('ask-anything');
    } catch {
      setMsgs(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  }

  return (
    <Layout
      title="Ask Anything — AI Doubt Chatbot"
      description="Ask any question from any subject or book — Maths, Science, English, SST, Advanced Maths & more. Get instant exam-ready solutions and answer keys."
      canonical="/ask-anything"
    >
      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-soft-lg">
            <MessagesSquare size={26} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ask Anything</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-secondary)]">
            Any subject. Any book. Any doubt — even beyond your textbooks. Ask anything, from a solved exercise to a completely new question, and get quick, exam-ready answers in the same official pattern — with proper statements, signs and boxed answers.
          </p>
        </div>

        {/* Chat card */}
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-0)] shadow-soft">
          {/* Messages */}
          <div className="min-h-[320px] space-y-4 overflow-y-auto p-4" style={{ maxHeight: 'min(560px, calc(100dvh - 22rem))' }}>
            {msgs.length === 0 && !loading && (
              <div className="py-8 text-center">
                <Brain size={34} className="mx-auto mb-3 text-blue-400" />
                <p className="text-sm font-medium text-[var(--text-primary)]">Ask me anything from any subject or book!</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">I have every solution from the SolveNCERT solution bank.</p>
                <div className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-1)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:border-blue-400 hover:text-blue-500">
                      <Sparkles size={10} className="mr-1 inline text-blue-400" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={cn('flex flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                <div className={cn('max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'rounded-br-sm bg-blue-600 text-white'
                    : 'rounded-bl-sm border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-secondary)]')}>
                  {m.role === 'ai' ? <MathRenderer text={m.text} /> : m.text}
                </div>
                {m.role === 'ai' && (
                  <div className="ml-1 mt-1.5 flex items-center gap-1.5">
                    <ReadAloud text={m.text} size="sm" />
                    <CopyBtn text={m.text} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-xl rounded-bl-sm bg-[var(--surface-2)] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }} />
                  <span className="ml-1 text-[10px] text-[var(--text-muted)]">Checking the solution bank…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="flex items-end gap-2 border-t border-[var(--border)] p-3">
            <AutoGrowTextarea
              value={query}
              onChange={setQuery}
              onEnter={() => send()}
              placeholder="Type any question or doubt…"
              className="input-field min-w-0 flex-1 py-2.5 text-sm"
            />
            <MicButton onInterim={t => setQuery(t)} onResult={t => { setQuery(t); send(t); }} size="sm" />
            <button onClick={() => send()} disabled={loading || !query.trim()}
              className="flex-shrink-0 rounded-lg bg-blue-600 p-2.5 text-white transition-all hover:bg-blue-700 disabled:opacity-40"
              aria-label="Send question">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-[var(--text-muted)]">
          Answers follow the official SolveNCERT solution pattern — best used for quick solutions and answer keys.
        </p>
      </div>
    </Layout>
  );
}
