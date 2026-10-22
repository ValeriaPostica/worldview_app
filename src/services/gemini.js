import { GoogleGenAI } from '@google/genai';
import worldviewData from '../data/worldviewData.json';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const model = 'gemini-3.8-flash';
const requestTimeoutMs = 30000;
const transientStatuses = [429, 500, 502, 503, 504];

const getResponseText = (response) => {
  const text = typeof response.text === 'function' ? response.text() : response.text;
  return text?.trim() || '';
};

const generate = async (request) => {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await Promise.race([
        ai.models.generateContent(request),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Gemini request timed out.')), requestTimeoutMs);
        }),
      ]);
      return response;
    } catch (error) {
      lastError = error;
      const detail = error.message || error.error?.message || '';
      const isTransient = transientStatuses.includes(error.status)
        || /high demand|unavailable|temporarily|overloaded|timed out|timeout/i.test(detail);
      if (!isTransient || attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
    }
  }
  const detail = lastError?.message || lastError?.error?.message || '';
  if (/api key|api_key|unauthorized|permission denied/i.test(detail)) {
    throw new Error('Gemini rejected the API key.', { cause: lastError });
  }
  throw new Error(detail || 'Gemini could not respond.', { cause: lastError });
};

const cleanJson = (text) => {
  const withoutFence = text.replace(/```json|```/gi, '').trim();
  const start = withoutFence.indexOf('{');
  const end = withoutFence.lastIndexOf('}');
  return JSON.parse(withoutFence.slice(start, end + 1));
};

export const isGeminiConfigured = Boolean(ai);

const recommendationCatalog = Object.values(worldviewData.archetypes)
  .flatMap((archetype) => archetype.recommended_media || [])
  .map((item) => ({
    title: item.title,
    type: item.type,
    creator: item.author_or_director,
    reason: item.short_desc,
    searchableText: `${item.title} ${item.author_or_director} ${item.dimension_tag} ${item.short_desc}`.toLowerCase(),
  }));

const getInputWords = (media) => `${media.books || ''} ${media.movies || ''} ${media.quote || ''}`
  .toLowerCase()
  .split(/[^a-z0-9]+/)
  .filter((word) => word.length > 2);

const getInputText = (media) => `${media.books || ''} ${media.movies || ''}`.toLowerCase();

const removeRepeatedRecommendations = (items, media) => {
  const inputText = getInputText(media);
  return items.filter((item) => {
    const title = (item.title || '').toLowerCase().trim();
    const creator = (item.creator || '').toLowerCase().trim();
    return title && !inputText.includes(title) && (!creator || !inputText.includes(creator));
  });
};

export function getLocalRecommendations(media) {
  const words = getInputWords(media);
  return recommendationCatalog
    .map((item) => ({
      ...item,
      score: words.reduce((score, word) => score + (item.searchableText.includes(word) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      const inputText = getInputText(media);
      return !inputText.includes(item.title.toLowerCase())
        && !inputText.includes(item.creator.toLowerCase());
    })
    .slice(0, 4)
    .map(({ title, type, creator, reason, score }) => ({
      title,
      type,
      creator,
      reason: score > 0
        ? `This connects with words or ideas in your interests. ${reason}`
        : `A thoughtful starting point related to philosophy. ${reason}`,
    }));
}

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
  return removeRepeatedRecommendations(parsed.items, media).slice(0, 4);
}

export async function askGemini(message, context, history = []) {
  const transcript = history
    .slice(-6)
    .map((item) => `${item.role === 'user' ? 'User' : 'Aletheia'}: ${item.text}`)
    .join('\n');
  const worldviewMatches = context.result?.worldviewMatches
    ?.map((match) => `${match.title}: ${match.percentage}% match; description: ${match.personalDescription || match.summary}; closest religious match: ${match.religion}; global estimate: ${match.population}`)
    .join('\n') || 'Not available';
  const philosophers = context.result?.matching_philosophers
    ?.map((philosopher) => `${philosopher.name} (${philosopher.era_or_school}): ${philosopher.core_idea}. ${philosopher.detailed_summary}`)
    .join(', ') || 'Not available';
  const media = context.result?.recommended_media
    ?.map((item) => `${item.title} (${item.type}, ${item.author_or_director || 'creator not listed'}): ${item.short_desc}. ${item.detailed_summary}`)
    .join(', ') || 'Not available';
  const personalizedRecommendations = context.recommendations
    ?.map((item) => `${item.title} (${item.type}, ${item.creator}): ${item.reason}`)
    .join(', ') || 'Not available';

      const prompt = `You are Aletheia, a warm and clear conversation partner for philosophical self-reflection.
    Use normal modern language. Be thoughtful, concise, and never claim to diagnose the user.
    Help them explore ideas rather than telling them what they must believe.
    Use the current result page context below when answering questions about the user's worldview,
    percentages, religious matches, philosophers, books, films, articles, or personalized recommendations.
    If something is not listed in the context, say that it is not available instead of inventing details.
    Give a complete answer in 3-5 short paragraphs. Explain your reasoning clearly and use
    the specific result data when it is relevant. Do not answer with only one or two sentences.

Current user result:
- Closest worldview: ${context.result?.archetype_title || 'Not available'} (${context.result?.worldviewMatches?.[0]?.percentage || 0}% match)
- Personal description: ${context.result?.philosophical_thesis || 'Not available'}
- Closest religious match: ${context.result?.religion || 'Not available'}
- Estimated worldview population: ${context.result?.population || 'Not available'}
- Other worldview matches:
${worldviewMatches}
- Philosophers shown: ${philosophers}
- Books, films, and articles shown: ${media}
- Personalized recommendations shown: ${personalizedRecommendations}
- Interests: ${context.media?.books || 'None'}, ${context.media?.movies || 'None'}, ${context.media?.quote || 'None'}

Previous conversation:
${transcript || 'No previous messages.'}

User's new message: ${message}

Reply with plain text only.`;

  if (!ai) {
    return buildKeywordReply(message, context);
  }

  try {
    const response = await generate({
      model,
      contents: prompt,
      config: { temperature: 0.65, maxOutputTokens: 700 },
    });
    const responseText = getResponseText(response);
    if (responseText) return responseText;
  } catch {
    return buildKeywordReply(message, context);
  }
  return buildKeywordReply(message, context);
}

function buildKeywordReply(message, context) {
  const result = context.result || {};
  const text = message.toLowerCase();
  const matches = result.worldviewMatches || [];
  const media = result.recommended_media || [];
  const philosophers = result.matching_philosophers || [];
  const recommendations = context.recommendations || [];
  const contextPrefix = 'Based on the information on your result page, ';

  const mentionedPhilosopher = philosophers.find((philosopher) =>
    text.includes(philosopher.name.toLowerCase())
  );
  if (mentionedPhilosopher) {
    return `${contextPrefix}${mentionedPhilosopher.name} is associated with ${mentionedPhilosopher.era_or_school}. ${mentionedPhilosopher.core_idea} ${mentionedPhilosopher.detailed_summary}`;
  }

  const mentionedMedia = media.find((item) => text.includes(item.title.toLowerCase()));
  if (mentionedMedia) {
    return `${contextPrefix}${mentionedMedia.title} is a ${mentionedMedia.type} by ${mentionedMedia.author_or_director || 'an unlisted creator'}. ${mentionedMedia.short_desc} ${mentionedMedia.detailed_summary}`;
  }

  const mentionedRecommendation = recommendations.find((item) =>
    text.includes(item.title.toLowerCase())
  );
  if (mentionedRecommendation) {
    return `${contextPrefix}${mentionedRecommendation.title} was suggested because ${mentionedRecommendation.reason} It was chosen to extend the interests you entered without repeating them.`;
  }

  if (/percent|percentage|match|score|compare|highest|lowest/.test(text) && matches.length) {
    const summary = matches.map((match) => `${match.title}: ${match.percentage}%`).join('; ');
    return `${contextPrefix}your worldview match scores are ${summary}. The percentages compare your quiz answers across the categories; they are not a permanent label.`;
  }

  if (/religion|religious|god|atheis|spiritual|belief/.test(text) && result.religion) {
    return `${contextPrefix}your closest worldview is ${result.archetype_title} (${matches[0]?.percentage || 0}%). The closest religious or non-religious association shown is ${result.religion}. This is an informational comparison, not a claim about your personal faith.`;
  }

  if (/book|read|movie|film|article|watch/.test(text) && media.length) {
    const titles = media.map((item) => `${item.title} (${item.type})`).join(', ');
    return `${contextPrefix}the result page recommends ${titles}. The book offers a sustained exploration, the movie gives a visual entry point, and the article is a shorter introduction. Select “Read more” on a card for its full description.`;
  }

  if (/recommend|similar|like|interest|suggest/.test(text) && recommendations.length) {
    const titles = recommendations.map((item) => `${item.title} by ${item.creator}`).join(', ');
    return `${contextPrefix}the suggestions based on your interests are ${titles}. Each one is intended to extend the books, films, and ideas you entered without repeating them.`;
  }

  if (/philosopher|thinker|person|socrates|camus|nietzsche|sartre|marcus|descartes/.test(text) && philosophers.length) {
    const names = philosophers.map((philosopher) => philosopher.name).join(', ');
    return `${contextPrefix}the thinkers shown for this result are ${names}. Each represents a different way of exploring the themes in your result. Mention one of them by name and I can explain the connection shown on the page.`;
  }

  if (/why|worldview|result|meaning|purpose|fit|truth|moral|choice/.test(text) && result.philosophical_thesis) {
    return `${contextPrefix}your closest worldview is ${result.archetype_title} (${matches[0]?.percentage || 0}%). ${result.philosophical_thesis}`;
  }

  return `${contextPrefix}I can explain your worldview, compare the percentages, discuss its religious association, or describe any philosopher, book, film, article, or personalized recommendation shown on the page.`;
}
