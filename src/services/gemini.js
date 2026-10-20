import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = 'gemini-3.8-flash';
const requestTimeoutMs = 15000;

const getResponseText = (response) => {
  const text = typeof response.text === 'function' ? response.text() : response.text;
  return text?.trim() || '';
};

const generate = async (request) => {
  try {
    const response = await Promise.race([
      ai.models.generateContent(request),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Gemini took too long to respond. Please try again.')), requestTimeoutMs);
      }),
    ]);
    return response;
  } catch (error) {
    const detail = error.message || error.error?.message || '';
    if (/api key|api_key|unauthorized|permission denied/i.test(detail)) {
      throw new Error('Gemini rejected the API key. Check VITE_GEMINI_API_KEY.', { cause: error });
    }
    if (error.status === 429) {
      throw new Error('Gemini is busy right now. Please try again in a moment.', { cause: error });
    }
    if (error.status === 400 || error.status === 404) {
      throw new Error(`Gemini rejected the request${detail ? `: ${detail}` : '. Check the API configuration.'}`, { cause: error });
    }
    throw new Error(detail || 'Gemini could not respond. Please try again.', { cause: error });
  }
};

const cleanJson = (text) => {
  const withoutFence = text.replace(/```json|```/gi, '').trim();
  const start = withoutFence.indexOf('{');
  const end = withoutFence.lastIndexOf('}');
  return JSON.parse(withoutFence.slice(start, end + 1));
};

export const isGeminiConfigured = Boolean(ai);

export async function getPersonalizedRecommendations(media) {
  if (!ai) {
    throw new Error('Gemini is not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const response = await generate({
    model,
    contents: `You recommend thoughtful books, films, essays, podcasts, or games.
Use the user's interests below as inspiration, but do not simply repeat them.
Return exactly 4 genuinely relevant recommendations. Be concise and specific.

User interests:
- Books, writers, or thinkers: ${media.books || 'Not provided'}
- Films, shows, or visual stories: ${media.movies || 'Not provided'}
- Quote or idea: ${media.quote || 'Not provided'}

Return only valid JSON in this shape:
{"items":[{"title":"...","type":"Book|Film|Essay|Podcast|Game","creator":"...","reason":"One sentence explaining the connection."}]}`,
    config: {
      temperature: 0.6,
      maxOutputTokens: 400,
      responseMimeType: 'application/json',
    },
  });

  const parsed = cleanJson(getResponseText(response));
  if (!Array.isArray(parsed.items)) {
    throw new Error('Gemini returned an unexpected recommendation format.');
  }
  return parsed.items.slice(0, 4);
}

export async function askGemini(message, context, history = []) {
  if (!ai) {
    throw new Error('Gemini is not configured. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  const transcript = history
    .slice(-6)
    .map((item) => `${item.role === 'user' ? 'User' : 'Aletheia'}: ${item.text}`)
    .join('\n');

  const response = await generate({
    model,
    contents: `You are Aletheia, a warm and clear conversation partner for philosophical self-reflection.
Use normal modern language. Be thoughtful, concise, and never claim to diagnose the user.
Help them explore ideas rather than telling them what they must believe.

Current user result:
- Thinking style: ${context.result?.archetype_title || 'Not available'}
- Summary: ${context.result?.philosophical_thesis || 'Not available'}
- Interests: ${context.media?.books || 'None'}, ${context.media?.movies || 'None'}, ${context.media?.quote || 'None'}

Previous conversation:
${transcript || 'No previous messages.'}

User's new message: ${message}

Reply with plain text only, in 2-4 short paragraphs.`,
    config: { temperature: 0.65, maxOutputTokens: 250 },
  });

  return getResponseText(response) || 'I could not form a useful reply this time. Try asking that another way.';
}
