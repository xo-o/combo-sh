import { getEnv } from "./config";
import { uploadAsset } from "./storage";
import {
  type CaptionChunk,
  type SubtitleOptions,
  type Utterance,
  type WordTimestamp,
  wordsToChunks,
  wordsToSrt,
  wordsToVtt,
} from "./subtitles";

export interface VoiceInfo {
  id: string;
  name: string;
  engine: "flux" | "aura-2" | "aura";
  gender: "female" | "male";
  language: string;
  accent: string;
  age?: string;
  character?: string[];
  useCases?: string[];
  featured?: boolean;
}

export const VOICES_CATALOG: VoiceInfo[] = [
  // Deepgram Flux TTS Voices (English)
  {
    id: "flux-hannah-en",
    name: "Hannah",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Young",
    character: ["Clear", "Confident", "Thoughtful", "Pleasant"],
    useCases: ["Casual chat", "Storytelling", "Video narration"],
    featured: true,
  },
  {
    id: "flux-kit-en",
    name: "Kit",
    engine: "flux",
    gender: "male",
    language: "en-GB",
    accent: "British",
    age: "Young Adult",
    character: ["Friendly", "Energetic", "Thoughtful", "Calm"],
    useCases: ["Customer service", "Narration", "Explainer videos"],
    featured: true,
  },
  {
    id: "flux-alexis-en",
    name: "Alexis",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Adult",
    character: ["Clear", "Professional", "Calm", "Empathetic"],
    useCases: ["Customer service", "Corporate video", "IVR"],
    featured: true,
  },
  {
    id: "flux-cliff-en",
    name: "Cliff",
    engine: "flux",
    gender: "male",
    language: "en-US",
    accent: "American",
    age: "Mature",
    character: ["Deep", "Confident", "Calm", "Raspy", "Clear"],
    useCases: ["Documentary", "Financial services", "Narration"],
    featured: true,
  },
  {
    id: "flux-sienna-en",
    name: "Sienna",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Young Adult",
    character: ["Clear", "Professional", "Calm", "Warm"],
    useCases: ["Narration", "Commercials", "Social media videos"],
    featured: true,
  },
  {
    id: "flux-cole-en",
    name: "Cole",
    engine: "flux",
    gender: "male",
    language: "en-US",
    accent: "American",
    age: "Young",
    character: ["Friendly", "Clear", "Interesting", "Engaging"],
    useCases: ["YouTube videos", "IVR", "Tutorials"],
    featured: true,
  },
  {
    id: "flux-brooke-en",
    name: "Brooke",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Young",
    character: ["Friendly", "Intelligent", "Fast", "Confident", "Energetic"],
    useCases: ["TikTok / Reels", "Casual chat", "Social promos"],
    featured: true,
  },
  {
    id: "flux-colin-en",
    name: "Colin",
    engine: "flux",
    gender: "male",
    language: "en-GB",
    accent: "British",
    age: "Adult",
    character: ["Warm", "Friendly", "Trustworthy", "Authoritative"],
    useCases: ["Documentary", "Educational video", "Narration"],
    featured: true,
  },
  {
    id: "flux-gemma-en",
    name: "Gemma",
    engine: "flux",
    gender: "female",
    language: "en-GB",
    accent: "British",
    age: "Young",
    character: ["Friendly", "Kind", "Approachable", "Happy"],
    useCases: ["Storytelling", "IVR", "Commercials"],
    featured: true,
  },
  {
    id: "flux-haley-en",
    name: "Haley",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Young Adult",
    character: ["Clear", "Professional", "Caring", "Calm"],
    useCases: ["Corporate narration", "Explainer video"],
    featured: true,
  },
  {
    id: "flux-heather-en",
    name: "Heather",
    engine: "flux",
    gender: "female",
    language: "en-US",
    accent: "American",
    age: "Young",
    character: ["Clear", "Engaging", "Energetic", "Friendly"],
    useCases: ["Commercials", "Social media", "Promos"],
    featured: true,
  },
  {
    id: "flux-miles-en",
    name: "Miles",
    engine: "flux",
    gender: "male",
    language: "en-US",
    accent: "American",
    age: "Adult",
    character: ["Clear", "Calm", "Professional", "Confident"],
    useCases: ["Tutorials", "Informative videos", "News"],
    featured: true,
  },
  {
    id: "flux-sean-en",
    name: "Sean",
    engine: "flux",
    gender: "male",
    language: "en-GB",
    accent: "British",
    age: "Mature",
    character: ["Friendly", "Kind", "Caring", "Calming"],
    useCases: ["Audiobook", "Calm narration"],
    featured: true,
  },
  {
    id: "flux-maeve-en",
    name: "Maeve",
    engine: "flux",
    gender: "female",
    language: "en-IE",
    accent: "Irish",
    age: "Adult",
    character: ["Friendly", "Energetic", "Confident", "Gentle"],
    useCases: ["Storytelling", "Narration"],
    featured: false,
  },
  {
    id: "flux-sharon-en",
    name: "Sharon",
    engine: "flux",
    gender: "female",
    language: "en-AU",
    accent: "Australian",
    age: "Young",
    character: ["Formal", "Calm", "Relaxed", "Confident"],
    useCases: ["Informative", "Corporate"],
    featured: false,
  },
  {
    id: "flux-kai-en",
    name: "Kai",
    engine: "flux",
    gender: "male",
    language: "en-SG",
    accent: "Singaporean",
    age: "Young Adult",
    character: ["Clear", "Calm", "Professional", "Knowledgeable"],
    useCases: ["Tech tutorials", "Informative"],
    featured: false,
  },
  {
    id: "flux-marcelo-en",
    name: "Marcelo",
    engine: "flux",
    gender: "male",
    language: "en-PH",
    accent: "Filipino",
    age: "Young Adult",
    character: ["Clear", "Calm", "Professional", "Knowledgeable"],
    useCases: ["Support", "Explainer"],
    featured: false,
  },
  {
    id: "flux-priya-en",
    name: "Priya",
    engine: "flux",
    gender: "female",
    language: "en-IN",
    accent: "Indian",
    age: "Adult",
    character: ["Confident", "Empathetic", "Professional", "Reassuring"],
    useCases: ["Customer service", "Education"],
    featured: false,
  },
  {
    id: "flux-naveen-en",
    name: "Naveen",
    engine: "flux",
    gender: "male",
    language: "en-IN",
    accent: "Indian",
    age: "Adult",
    character: ["Clear", "Professional", "Knowledgeable", "Calm"],
    useCases: ["Education", "Narration"],
    featured: false,
  },

  // Deepgram Aura-2 Multilingual Voices
  {
    id: "aura-2-celeste-es",
    name: "Celeste",
    engine: "aura-2",
    gender: "female",
    language: "es-CO",
    accent: "Colombian",
    character: ["Clear", "Energetic", "Positive", "Friendly"],
    useCases: ["Spanish Narration", "Advertising"],
    featured: true,
  },
  {
    id: "aura-2-nestor-es",
    name: "Néstor",
    engine: "aura-2",
    gender: "male",
    language: "es-ES",
    accent: "Peninsular",
    character: ["Calm", "Professional", "Approachable", "Clear"],
    useCases: ["Spanish Narration", "Explainer"],
    featured: true,
  },
  {
    id: "aura-2-agathe-fr",
    name: "Agathe",
    engine: "aura-2",
    gender: "female",
    language: "fr-FR",
    accent: "French",
    character: ["Charismatic", "Cheerful", "Enthusiastic", "Natural"],
    useCases: ["French Narration", "Commercials"],
    featured: true,
  },
  {
    id: "aura-2-julius-de",
    name: "Julius",
    engine: "aura-2",
    gender: "male",
    language: "de-DE",
    accent: "German",
    character: ["Casual", "Cheerful", "Engaging", "Friendly"],
    useCases: ["German Narration", "Tutorials"],
    featured: true,
  },
  {
    id: "aura-2-livia-it",
    name: "Livia",
    engine: "aura-2",
    gender: "female",
    language: "it-IT",
    accent: "Italian",
    character: ["Approachable", "Cheerful", "Clear", "Expressive"],
    useCases: ["Italian Narration", "Audiobook"],
    featured: true,
  },
  {
    id: "aura-2-fujin-ja",
    name: "Fujin",
    engine: "aura-2",
    gender: "male",
    language: "ja-JP",
    accent: "Japanese",
    character: ["Calm", "Confident", "Knowledgeable", "Smooth"],
    useCases: ["Japanese Narration", "Anime/Gaming"],
    featured: true,
  },
];

export interface ListVoicesFilter {
  engine?: "flux" | "aura-2" | "all";
  language?: string;
  gender?: "female" | "male";
  accent?: string;
  featuredOnly?: boolean;
  query?: string;
}

export function listVoices(filters: ListVoicesFilter = {}): VoiceInfo[] {
  return VOICES_CATALOG.filter((voice) => {
    if (
      filters.engine &&
      filters.engine !== "all" &&
      voice.engine !== filters.engine
    ) {
      return false;
    }
    if (filters.gender && voice.gender !== filters.gender) {
      return false;
    }
    if (filters.featuredOnly && !voice.featured) {
      return false;
    }
    if (filters.language) {
      const targetLang = filters.language.toLowerCase();
      if (!voice.language.toLowerCase().startsWith(targetLang)) {
        return false;
      }
    }
    if (filters.accent) {
      const targetAccent = filters.accent.toLowerCase();
      if (!voice.accent.toLowerCase().includes(targetAccent)) {
        return false;
      }
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matchName = voice.name.toLowerCase().includes(q);
      const matchId = voice.id.toLowerCase().includes(q);
      const matchAccent = voice.accent.toLowerCase().includes(q);
      const matchChar = voice.character?.some((c) =>
        c.toLowerCase().includes(q),
      );
      if (!matchName && !matchId && !matchAccent && !matchChar) {
        return false;
      }
    }
    return true;
  });
}

export interface SynthesizeOptions {
  text: string;
  voice?: string;
  speed?: number; // 0.5 to 1.5
  expressivity?: number; // -2 to 2 (Flux only)
  encoding?: "mp3" | "wav" | "flac" | "aac" | "opus";
  saveToStorage?: boolean;
  folder?: string;
  filename?: string;
}

export interface SynthesizeResult {
  audioUrl?: string;
  key?: string;
  buffer?: Buffer;
  contentType: string;
  size: number;
  voice: string;
  text: string;
  characterCount: number;
  durationSecondsEstimate: number;
}

/**
 * Synthesize speech using Deepgram Flux TTS (or Aura-2 for multilingual)
 */
export async function synthesizeSpeech(
  options: SynthesizeOptions,
): Promise<SynthesizeResult> {
  const env = getEnv();
  const text = options.text.trim();
  if (!text) {
    throw new Error("Text parameter cannot be empty");
  }

  const voice = options.voice || "flux-alexis-en";
  const isFlux = voice.startsWith("flux-");
  const saveToStorage = options.saveToStorage ?? true;
  const encoding = options.encoding || "mp3";

  // Deepgram Flux uses /v2/speak; Aura/Aura-2 uses /v1/speak
  const endpoint = isFlux
    ? "https://api.deepgram.com/v2/speak"
    : "https://api.deepgram.com/v1/speak";

  const url = new URL(endpoint);
  url.searchParams.set("model", voice);
  url.searchParams.set("encoding", encoding);

  if (options.speed !== undefined) {
    url.searchParams.set("speed", options.speed.toFixed(2));
  }

  if (isFlux && options.expressivity !== undefined) {
    url.searchParams.set("expressivity", options.expressivity.toString());
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Deepgram TTS synthesis failed (${response.status} ${response.statusText}): ${errorText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get("content-type") || "audio/mpeg";
  const characterCount = Number.parseInt(
    response.headers.get("dg-char-count") || `${text.length}`,
    10,
  );

  // Estimate duration: average speech is ~15 characters per second
  const speed = options.speed || 1.0;
  const durationSecondsEstimate = Number.parseFloat(
    (text.length / (15 * speed)).toFixed(2),
  );

  if (!saveToStorage) {
    return {
      buffer: audioBuffer,
      contentType,
      size: audioBuffer.byteLength,
      voice,
      text,
      characterCount,
      durationSecondsEstimate,
    };
  }

  // Save to Cloudflare R2
  const folder = options.folder || "audio/tts";
  const filename = options.filename || `speech-${voice}`;

  const storedAsset = await uploadAsset(audioBuffer, {
    folder,
    filename,
    contentType,
    metadata: {
      voice,
      charCount: characterCount.toString(),
      engine: isFlux ? "flux" : "aura",
    },
  });

  return {
    audioUrl: storedAsset.url,
    key: storedAsset.key,
    contentType,
    size: storedAsset.size,
    voice,
    text,
    characterCount,
    durationSecondsEstimate,
  };
}

export interface TranscribeOptions {
  model?: string; // default "nova-3"
  language?: string;
  smart_format?: boolean;
  diarize?: boolean;
  utterances?: boolean;
  punctuate?: boolean;
  paragraphs?: boolean;
  subtitleOptions?: SubtitleOptions;
}

export interface TranscribeResult {
  transcript: string;
  duration: number;
  confidence: number;
  words: WordTimestamp[];
  utterances: Utterance[];
  chunks: CaptionChunk[];
  srt: string;
  vtt: string;
}

/**
 * Transcribe audio using Deepgram Nova-3 / Nova-2
 */
export async function transcribeAudio(
  source: string | Buffer | Uint8Array,
  options: TranscribeOptions = {},
): Promise<TranscribeResult> {
  const env = getEnv();
  const model = options.model || "nova-3";

  const url = new URL("https://api.deepgram.com/v1/listen");
  url.searchParams.set("model", model);
  url.searchParams.set("smart_format", String(options.smart_format ?? true));
  url.searchParams.set("punctuate", String(options.punctuate ?? true));
  url.searchParams.set("utterances", String(options.utterances ?? true));

  if (options.diarize) {
    url.searchParams.set("diarize", "true");
  }

  if (options.paragraphs ?? true) {
    url.searchParams.set("paragraphs", "true");
  }

  if (options.language) {
    url.searchParams.set("language", options.language);
  } else {
    url.searchParams.set("detect_language", "true");
  }

  const headers: Record<string, string> = {
    Authorization: `Token ${env.DEEPGRAM_API_KEY}`,
  };

  let body: BodyInit;

  if (typeof source === "string") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({ url: source });
  } else {
    headers["Content-Type"] = "audio/wav";
    body = new Uint8Array(source);
  }

  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Deepgram STT transcription failed (${response.status} ${response.statusText}): ${errorText}`,
    );
  }

  const data = await response.json();

  const channel = data.results?.channels?.[0];
  const alternative = channel?.alternatives?.[0];

  const transcript = alternative?.transcript || "";
  const confidence = alternative?.confidence || 0;
  const duration = data.metadata?.duration || 0;

  interface RawWordItem {
    word: string;
    punctuated_word?: string;
    start: number | string;
    end: number | string;
    confidence: number | string;
    speaker?: number | string;
  }

  interface RawUtteranceItem {
    transcript: string;
    start: number | string;
    end: number | string;
    confidence?: number | string;
    speaker?: number | string;
    words?: RawWordItem[];
  }

  // Extract word-level timestamps
  const rawWords = (alternative?.words || []) as RawWordItem[];
  const words: WordTimestamp[] = rawWords.map((w) => ({
    word: w.word,
    punctuated_word: w.punctuated_word || w.word,
    start: Number(w.start),
    end: Number(w.end),
    confidence: Number(w.confidence),
    speaker: w.speaker !== undefined ? Number(w.speaker) : undefined,
  }));

  // Extract utterances
  const rawUtterances = (data.results?.utterances || []) as RawUtteranceItem[];
  const utterances: Utterance[] = rawUtterances.map((u) => ({
    text: u.transcript,
    start: Number(u.start),
    end: Number(u.end),
    confidence: u.confidence !== undefined ? Number(u.confidence) : undefined,
    speaker: u.speaker !== undefined ? Number(u.speaker) : undefined,
    words: (u.words || []).map((w) => ({
      word: w.word,
      punctuated_word: w.punctuated_word || w.word,
      start: Number(w.start),
      end: Number(w.end),
      confidence: Number(w.confidence),
      speaker: w.speaker !== undefined ? Number(w.speaker) : undefined,
    })),
  }));

  // Generate subtitle chunks optimized for video editing
  const chunks = wordsToChunks(words, options.subtitleOptions);
  const srt = wordsToSrt(words, options.subtitleOptions);
  const vtt = wordsToVtt(words, options.subtitleOptions);

  return {
    transcript,
    duration,
    confidence,
    words,
    utterances,
    chunks,
    srt,
    vtt,
  };
}
