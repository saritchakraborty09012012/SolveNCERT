type GenerateContentParams = {
  model: string;
  contents: Array<{ role?: string; parts: Array<Record<string, unknown>> }>;
  config?: {
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
    maxOutputTokens?: number;
  };
};

type GenerateContentResult = { text?: string };

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

function toApiContents(
  contents: GenerateContentParams['contents']
): Array<{ role: string; parts: Array<Record<string, unknown>> }> {
  return contents.map((c) => ({
    role: c.role === 'model' ? 'model' : 'user',
    parts: c.parts,
  }));
}

function parseText(json: any): string | undefined {
  const parts: string[] = [];
  const candidates = Array.isArray(json?.candidates) ? json.candidates : [];
  for (const candidate of candidates) {
    const contentParts = Array.isArray(candidate?.content?.parts)
      ? candidate.content.parts
      : [];
    for (const part of contentParts) {
      if (typeof part?.text === 'string') parts.push(part.text);
    }
  }
  return parts.length > 0 ? parts.join('') : undefined;
}

/**
 * Drop-in replacement for `GoogleGenAI().models.generateContent()` that uses
 * native fetch() against the Gemini REST API. Keeps the same `.text` result
 * shape and throws errors whose message contains the API error text so that
 * existing model-fallback / retry regex checks keep working.
 */
export async function generateGeminiContent({
  model,
  contents,
  config,
  apiKey,
}: GenerateContentParams & { apiKey: string }): Promise<GenerateContentResult> {
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const generationConfig: Record<string, unknown> = {};
  if (config?.temperature != null) generationConfig.temperature = config.temperature;
  if (config?.maxOutputTokens != null) generationConfig.maxOutputTokens = config.maxOutputTokens;
  if (config?.responseMimeType) generationConfig.responseMimeType = config.responseMimeType;

  const body: Record<string, unknown> = {
    contents: toApiContents(contents),
  };
  if (config?.systemInstruction) {
    body.systemInstruction = { parts: [{ text: config.systemInstruction }] };
  }
  if (Object.keys(generationConfig).length > 0) {
    body.generationConfig = generationConfig;
  }

  const url = `${GEMINI_BASE_URL}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = json?.error?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return { text: parseText(json) };
}
