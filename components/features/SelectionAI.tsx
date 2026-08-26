import React, { useEffect, useState } from 'react';
import { MessageCircleQuestion, Lightbulb, Languages, BookOpenCheck, ListChecks } from 'lucide-react';

const actions = [
  ['Ask AI', MessageCircleQuestion, ''], ['Explain', Lightbulb, 'Explain this clearly: '],
  ['Meaning', BookOpenCheck, 'Give the meaning and simple definition of: '], ['Usage', ListChecks, 'Explain how this is used, with examples: '],
  ['Example', Lightbulb, 'Give easy examples for: '],
] as const;

const LANGUAGES = ['Hindi', 'English', 'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Kannada', 'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri', 'Marathi', 'Nepali', 'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu', 'Arabic', 'Chinese', 'French', 'German', 'Japanese', 'Korean', 'Russian', 'Spanish'];

export default function SelectionAI() {
  const [selection, setSelection] = useState('');
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [translateOpen, setTranslateOpen] = useState(false);
  const [language, setLanguage] = useState('Hindi');
  const [customLanguage, setCustomLanguage] = useState('');
  useEffect(() => {
    const update = () => {
      const text = window.getSelection()?.toString().trim() || '';
      if (!text || text.length > 1500) return setSelection('');
      const range = window.getSelection()?.getRangeAt(0); const rect = range?.getBoundingClientRect();
      if (rect) { setSelection(text); setPos({ left: Math.min(window.innerWidth - 240, Math.max(8, rect.left)), top: Math.max(8, rect.bottom + 8) }); }
    };
    document.addEventListener('mouseup', update); document.addEventListener('touchend', update);
    return () => { document.removeEventListener('mouseup', update); document.removeEventListener('touchend', update); };
  }, []);
  function openAI(prompt: string) {
    window.dispatchEvent(new CustomEvent('solvencert-ai-context', { detail: { context: selection, prompt } }));
    setSelection(''); setTranslateOpen(false); window.getSelection()?.removeAllRanges();
  }
  if (!selection) return null;
  return <div style={{ left: pos.left, top: pos.top }} className="fixed z-[60] flex flex-wrap gap-1 max-w-[230px] rounded-xl border border-blue-200 bg-white dark:bg-slate-900 p-1.5 shadow-xl">
    {actions.map(([label, Icon, prompt]) => <button key={label} onClick={() => openAI(prompt)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"><Icon size={11} />{label}</button>)}
    <button onClick={() => setTranslateOpen(v => !v)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40"><Languages size={11} />Translate</button>
    {translateOpen && <div className="w-full border-t border-blue-100 pt-1.5 space-y-1">
      <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full rounded-md border border-blue-200 bg-white px-1.5 py-1 text-[10px] text-slate-700">
        {LANGUAGES.map(l => <option key={l}>{l}</option>)}<option value="Other">Other language</option>
      </select>
      {language === 'Other' && <input autoFocus value={customLanguage} onChange={e => setCustomLanguage(e.target.value)} placeholder="Type any language…" className="w-full rounded-md border border-blue-200 px-1.5 py-1 text-[10px]" />}
      <button onClick={() => openAI(`Translate this into ${language === 'Other' ? (customLanguage || 'the language specified by the user') : language}. Give only the translation, unless context is needed: `)} className="w-full rounded-md bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white">Translate to {language === 'Other' ? (customLanguage || 'language') : language}</button>
    </div>}
  </div>;
}
