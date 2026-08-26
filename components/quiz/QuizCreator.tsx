import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, ChevronLeft, Sparkles, Loader2, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import Router from 'next/router';

interface QuizCreatorProps {
  onQuizGenerated?: (attemptId: string) => void;
}

const GUEST_USAGE_KEY = 'sn_quiz_guest_usage';

function getGuestUsage(): { count: number; resetAt: number } {
  try {
    const raw = localStorage.getItem(GUEST_USAGE_KEY);
    if (!raw) return { count: 0, resetAt: Date.now() + 86400000 };
    const data = JSON.parse(raw);
    if (Date.now() > data.resetAt) {
      localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify({ count: 0, resetAt: Date.now() + 86400000 }));
      return { count: 0, resetAt: Date.now() + 86400000 };
    }
    return data;
  } catch {
    return { count: 0, resetAt: Date.now() + 86400000 };
  }
}

function incrementGuestUsage(): number {
  const data = getGuestUsage();
  data.count++;
  localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(data));
  return 5 - data.count;
}

function getGuestRemaining(): number {
  const data = getGuestUsage();
  return Math.max(0, 5 - data.count);
}

const SUBJECTS = [
  { value: 'maths', label: 'Mathematics', book: 'Ganita Manjari Part I', bookSlug: 'ganita-manjari' },
  { value: 'science', label: 'Science', book: 'Exploration', bookSlug: 'exploration' },
  { value: 'english', label: 'English', book: 'Kaveri', bookSlug: 'kaveri' },
  { value: 'sst', label: 'Social Science', book: 'Understanding Society India and Beyond', bookSlug: 'understanding-society-india-and-beyond' },
  { value: 'hindi', label: 'Hindi', book: 'Ganga', bookSlug: 'ganga' },
  { value: 'sanskrit', label: 'Sanskrit', book: 'Sharda', bookSlug: 'sharda' },
];

const CHAPTERS: Record<string, string[]> = {
  maths: ['Orienting Yourself: The Use of Coordinates', 'Introduction to Linear Polynomials', 'The World of Numbers', 'Exploring Algebraic Identities', 'Circles', 'Measuring Space: Perimeter and Area', 'Introduction to Probability', 'Exploring Sequences and Progressions'],
  science: ['Exploring the World of Science', 'The Cell', 'Tissues', 'Describing Motion', 'Mixtures', 'How Forces Affect Motion', 'Work, Energy and Simple Machines', 'Journey Inside the Atom', 'Sound Waves', 'Reproduction', 'Diversity in Living Organisms', 'Earth as a System'],
  english: ['How I Taught My Grandmother to Read', 'The Pot Maker', 'Winds of Change', 'Vitamin M', 'World of Limitless Possibilities', 'Twin Melodies', 'Carrier of Words', 'Follow That Dream'],
  sst: ['Understanding Social Science', 'Shaping of the Earth\'s Surface', 'Atmosphere and Climate', 'Early Humans and Beginning of Civilisation', 'State and Society up to 1000 CE', 'Democracy', 'Elections', 'The Problem of Choice', 'What Drives the Market'],
  hindi: ['गिल्लू', 'स्मृति', 'हामिद खान', 'टोपी शखर सिंह', 'एक कुत्ता और एक मैना'],
  sanskrit: ['शाश्वती स्मृतिः', 'आर्या भारतम्', 'मित्रसंदेशः'],
};

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: '#22c55e' },
  { value: 'moderate', label: 'Moderate', color: '#f59e0b' },
  { value: 'hard', label: 'Hard', color: '#ef4444' },
];

const optionBtn = (active: boolean) => ({
  background: active ? 'var(--brand-primary)' : 'var(--surface-2)',
  color: active ? '#fff' : 'var(--text-primary)',
  borderColor: active ? 'var(--brand-primary)' : 'var(--border)',
});

export default function QuizCreator({ onQuizGenerated }: QuizCreatorProps) {
  const { user, isGuest } = useAuthStore();
  const [step, setStep] = useState(0);
  const [cls, setCls] = useState('9');
  const [subject, setSubject] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [diff, setDiff] = useState('moderate');
  const [numQ, setNumQ] = useState(10);
  const [gen, setGen] = useState(false);
  const [search, setSearch] = useState('');
  const [guestRemaining, setGuestRemaining] = useState(5);

  useEffect(() => {
    if (isGuest) setGuestRemaining(getGuestRemaining());
  }, [isGuest]);

  const selectedSubject = SUBJECTS.find(s => s.value === subject);
  const books = subject ? [selectedSubject?.book || ''] : [];
  const chapters = subject ? (CHAPTERS[subject] || []).filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return !!subject;
    if (step === 2) return !!book;
    if (step === 3) return !!chapter;
    return true;
  };

  const handleGenerate = async () => {
    if (isGuest && getGuestRemaining() <= 0) {
      toast.error('You have used all 5 free quizzes today. Sign up for unlimited!');
      return;
    }
    setGen(true);
    try {
      const subjectData = SUBJECTS.find(s => s.value === subject);
      const config = {
        classNum: parseInt(cls),
        subject: subject,
        book: subjectData?.book || book,
        bookSlug: subjectData?.bookSlug || '',
        chapter: chapter || undefined,
        chapterSlug: chapter ? chapter.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '') : undefined,
        difficulty: diff,
        numQuestions: numQ,
      };
      const guestId = isGuest ? `guest_${localStorage.getItem('sn_guest_id') || (() => { const id = crypto.randomUUID().slice(0, 8); localStorage.setItem('sn_guest_id', id); return id; })()}` : undefined;
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, userId: isGuest ? guestId : user?.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to generate quiz');
        return;
      }
      if (data.attemptId) {
        if (isGuest) {
          const remaining = incrementGuestUsage();
          setGuestRemaining(remaining);
          try {
            sessionStorage.setItem('sn_quiz_' + data.attemptId, JSON.stringify({
              attempt: {
                id: data.attemptId,
                subject: config.subject,
                book: config.book || '',
                chapter: config.chapter || null,
                difficulty: diff,
                totalQuestions: (data.questions || []).length,
                timeLimitSeconds: (data.questions || []).length * 60,
                status: 'in_progress',
              },
              questions: data.questions || [],
            }));
          } catch {}
        }
        toast.success('Quiz generated!');
        if (onQuizGenerated) {
          onQuizGenerated(data.attemptId);
        } else {
          Router.push(`/quizzes/${data.attemptId}`);
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setGen(false);
    }
  };

  const labels = ['Class', 'Subject', 'Book', 'Chapter', 'Difficulty', 'Questions'];
  const values = [cls, subject || '—', book || '—', chapter || '—', diff, String(numQ)];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-0)' }}>
      <div className="w-full max-w-xl rounded-2xl p-8 shadow-xl border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-primary)' }}>
            <BookOpen size={20} color="#fff" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Quiz</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Step {step + 1} of 6</p>
          </div>
          {isGuest && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{
              background: guestRemaining > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: guestRemaining > 0 ? '#22c55e' : '#ef4444',
              border: `1px solid ${guestRemaining > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <Zap size={12} /> {guestRemaining}/5 free today
            </div>
          )}
        </div>

        <div className="flex gap-1.5 mb-8">
          {labels.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? 'var(--brand-primary)' : 'var(--surface-2)' }} />
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{labels[step]}</h3>

        <div className="min-h-[160px]">
          {step === 0 && (
            <div className="space-y-3 animate-fadeIn">
              {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                <button key={c} onClick={() => setCls(String(c))} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border" style={optionBtn(cls === String(c))}>
                  Class {c}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 animate-fadeIn">
              {SUBJECTS.map((s) => (
                <button key={s.value} onClick={() => { setSubject(s.value); setBook(s.book); setChapter(''); }} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border" style={optionBtn(subject === s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 animate-fadeIn">
              {books.filter(Boolean).map((b) => (
                <button key={b} onClick={() => { setBook(b); setChapter(''); }} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border" style={optionBtn(book === b)}>
                  {b}
                </button>
              ))}
              {books.filter(Boolean).length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Auto-selected based on subject</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <input type="text" placeholder="Search chapters..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              {chapters.map((ch) => (
                <button key={ch} onClick={() => setChapter(ch)} className="w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 border" style={optionBtn(chapter === ch)}>
                  {ch}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 animate-fadeIn">
              {DIFFICULTIES.map((d) => (
                <button key={d.value} onClick={() => setDiff(d.value)} className="w-full px-4 py-4 rounded-xl text-left font-medium transition-all duration-200 border flex items-center gap-3"
                  style={{ background: diff === d.value ? 'var(--surface-2)' : 'transparent', borderColor: diff === d.value ? d.color : 'var(--border)', borderWidth: diff === d.value ? '2px' : '1px' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: 'var(--text-primary)' }}>{d.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setNumQ(n => Math.max(1, n - 1))}
                  className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <ChevronDown size={22} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={numQ}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (!isNaN(v) && v >= 1) setNumQ(v);
                  }}
                  className="w-28 h-14 rounded-xl text-center text-3xl font-bold outline-none border transition-all duration-200 focus:ring-2 focus:ring-[var(--brand-primary)]/30"
                  style={{
                    background: 'var(--surface-1)',
                    borderColor: 'var(--brand-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={() => setNumQ(n => n + 1)}
                  className="w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <ChevronUp size={22} />
                </button>
              </div>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>As many as you need</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border"
              style={{ background: 'transparent', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < 5 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200"
              style={{ background: canProceed() ? 'var(--brand-primary)' : 'var(--surface-2)', color: canProceed() ? '#fff' : 'var(--text-muted)' }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={gen}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-lg transition-all duration-200"
              style={{ background: gen ? 'var(--surface-2)' : 'var(--brand-primary)', color: gen ? 'var(--text-muted)' : '#fff' }}
            >
              {gen ? <><Loader2 size={20} className="animate-spin" /> Generating...</> : <><Sparkles size={20} /> Generate Quiz</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
