import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { supabase } from '@/lib/supabase';
import { buildPaperGenerationPrompt } from '@/lib/practice/prompt-builder';
import type { PracticePaperConfig, PracticeQuestion } from '@/lib/practice/types';
const PRIMARY_MODEL = 'gemini-3.6-flash';
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];

function friendlyError(message: string): { code: string; message: string } {
  if (/api key|forbidden|401|403|permission|invalid api/i.test(message)) {
    return { code: 'AUTH', message: 'AI service authentication failed.' };
  }
  if (/quota|429|rate limit|resource exhausted/i.test(message)) {
    return { code: 'QUOTA', message: 'AI service quota exceeded. Please try again shortly.' };
  }
  if (/network|fetch failed|undici|socket hang up/i.test(message)) {
    return { code: 'NETWORK', message: 'Network error while reaching the AI service.' };
  }
  return { code: 'API', message: 'The AI service returned an error. Please try again.' };
}

function parseQuestions(raw: string): PracticeQuestion[] {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  }
  try {
    const arr = JSON.parse(cleaned);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through to repair */ }
    }
    const repaired = repairTruncatedArray(cleaned);
    if (repaired.length > 0) return repaired;
    return [];
  }
}

function repairTruncatedArray(raw: string): PracticeQuestion[] {
  try {
    const start = raw.indexOf('[');
    if (start === -1) return [];
    let s = raw.slice(start);
    const lastBrace = s.lastIndexOf('}');
    if (lastBrace === -1) return [];
    s = s.slice(0, lastBrace + 1).replace(/,\s*$/, '') + ']';
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'METHOD', message: 'Method not allowed.' } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { code: 'NO_KEY', message: 'AI API key is not configured.' } });
  }

  let body: { config?: PracticePaperConfig } = {};
  try { body = req.body; } catch { /* malformed */ }

  const config = body.config;
  if (!config || !config.subject || !config.chapter || !config.difficulty || !config.questionCount) {
    return res.status(400).json({ error: { code: 'INVALID', message: 'Missing required paper configuration fields.' } });
  }

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  let wrongQuestionsForReintroduction: any[] = [];
  if (userId) {
    const { data: wq } = await supabase
      .from('practice_wrong_questions')
      .select('*')
      .eq('user_id', userId)
      .eq('mastered', false)
      .order('last_seen_at', { ascending: false })
      .limit(5);
    wrongQuestionsForReintroduction = wq || [];
  }

  let fullPrompt = await buildPaperGenerationPrompt(config);
  if (wrongQuestionsForReintroduction.length > 0) {
    const wqContext = wrongQuestionsForReintroduction.map((wq: any) =>
      `- "${wq.question_text}" (Chapter: ${wq.chapter}, Topic: ${wq.topic || 'Unknown'}, Difficulty: ${wq.difficulty})`
    ).join('\n');
    fullPrompt += `\n\nSMART REVISION: Include 2-3 questions similar to these previously wrong questions (reintroduce concepts, not exact questions):\n${wqContext}`;
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown = null;

  for (const model of [PRIMARY_MODEL, ...FALLBACK_MODELS]) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 65536,
        },
      });

      const raw = response.text?.trim();
      if (!raw) {
        return res.status(502).json({ error: { code: 'EMPTY', message: 'The AI returned an empty response.' } });
      }

      const questions = parseQuestions(raw);
      if (questions.length === 0) {
        console.error('[practice/generate] Unparseable AI response (first 2000 chars):', raw.slice(0, 2000));
        return res.status(502).json({ error: { code: 'PARSE', message: 'Could not parse AI response into questions.' } });
      }

      const paperId = crypto.randomUUID();

      const paper = {
        id: paperId,
        user_id: userId || 'guest',
        class_level: config.classLevel,
        subject: config.subject,
        book: config.book,
        chapter: config.chapter,
        chapter_code: config.chapterCode || null,
        difficulty: config.difficulty,
        question_count: questions.length,
        questions,
        time_taken_sec: null,
        is_completed: false,
        created_at: new Date().toISOString(),
        completed_at: null,
      };

      if (userId) {
        try {
          await supabase.from('practice_papers').insert({
            id: paperId,
            user_id: userId,
            class_level: config.classLevel,
            subject: config.subject,
            book: config.book,
            chapter: config.chapter,
            chapter_code: config.chapterCode || null,
            difficulty: config.difficulty,
            question_count: questions.length,
            questions,
            is_completed: false,
          });

          for (const wq of wrongQuestionsForReintroduction) {
            await supabase.rpc('increment_wrong_question', {
              p_question_id: wq.id,
              p_was_correct: false,
            });
          }
        } catch (err) {
          console.error('Failed to save paper to DB (non-fatal):', err);
        }
      }

      return res.status(200).json({ paper, isGuest: !userId });
    } catch (err) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[practice/generate] Model ${model} failed:`, message);
      if (/(not found|404|not supported|does not exist|invalid argument.*model)/i.test(message)) continue;
      break;
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  return res.status(502).json({ error: friendlyError(message) });
}
