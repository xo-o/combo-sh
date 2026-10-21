export interface WordTimestamp {
  word: string;
  punctuated_word?: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

export interface Utterance {
  text: string;
  start: number;
  end: number;
  confidence?: number;
  speaker?: number;
  words?: WordTimestamp[];
}

export interface CaptionChunk {
  index: number;
  start: number;
  end: number;
  text: string;
  speaker?: number;
  words?: WordTimestamp[];
}

export interface SubtitleOptions {
  maxWordsPerLine?: number;
  maxDurationSeconds?: number;
}

export function formatTime(seconds: number, format: "srt" | "vtt"): string {
  const totalMs = Math.round(Math.max(0, seconds) * 1000);
  const ms = totalMs % 1000;
  const totalSecs = Math.floor(totalMs / 1000);
  const s = totalSecs % 60;
  const totalMins = Math.floor(totalSecs / 60);
  const m = totalMins % 60;
  const h = Math.floor(totalMins / 60);

  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const pad3 = (n: number) => n.toString().padStart(3, "0");

  const msSep = format === "srt" ? "," : ".";
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}${msSep}${pad3(ms)}`;
}

/**
 * Group words into optimal subtitle chunks for video captions (TikTok / Reels / Remotion style)
 */
export function wordsToChunks(
  words: WordTimestamp[],
  options: SubtitleOptions = {},
): CaptionChunk[] {
  if (!words || words.length === 0) return [];

  const maxWords = options.maxWordsPerLine ?? 5;
  const maxDuration = options.maxDurationSeconds ?? 2.5;

  const chunks: CaptionChunk[] = [];
  let currentWords: WordTimestamp[] = [];
  let chunkIndex = 1;

  for (const word of words) {
    if (currentWords.length === 0) {
      currentWords.push(word);
      continue;
    }

    const firstWord = currentWords[0];
    const duration = word.end - firstWord.start;
    const speakerChanged =
      word.speaker !== undefined &&
      currentWords[currentWords.length - 1].speaker !== undefined &&
      word.speaker !== currentWords[currentWords.length - 1].speaker;

    // Check if end of sentence
    const prevWordText =
      currentWords[currentWords.length - 1].punctuated_word || "";
    const isSentenceEnd = /[.!?]$/.test(prevWordText.trim());

    if (
      currentWords.length >= maxWords ||
      duration >= maxDuration ||
      speakerChanged ||
      isSentenceEnd
    ) {
      chunks.push({
        index: chunkIndex++,
        start: firstWord.start,
        end: currentWords[currentWords.length - 1].end,
        text: currentWords
          .map((w) => w.punctuated_word || w.word)
          .join(" ")
          .trim(),
        speaker: firstWord.speaker,
        words: [...currentWords],
      });
      currentWords = [word];
    } else {
      currentWords.push(word);
    }
  }

  if (currentWords.length > 0) {
    const firstWord = currentWords[0];
    chunks.push({
      index: chunkIndex++,
      start: firstWord.start,
      end: currentWords[currentWords.length - 1].end,
      text: currentWords
        .map((w) => w.punctuated_word || w.word)
        .join(" ")
        .trim(),
      speaker: firstWord.speaker,
      words: [...currentWords],
    });
  }

  return chunks;
}

/**
 * Convert subtitle chunks to standard SubRip (.srt) text
 */
export function chunksToSrt(chunks: CaptionChunk[]): string {
  if (!chunks || chunks.length === 0) return "";

  return chunks
    .map((chunk) => {
      const startTime = formatTime(chunk.start, "srt");
      const endTime = formatTime(chunk.end, "srt");
      return `${chunk.index}\n${startTime} --> ${endTime}\n${chunk.text}\n`;
    })
    .join("\n");
}

/**
 * Convert subtitle chunks to WebVTT (.vtt) text
 */
export function chunksToVtt(chunks: CaptionChunk[]): string {
  const header = "WEBVTT\n\n";
  if (!chunks || chunks.length === 0) return header;

  const body = chunks
    .map((chunk) => {
      const startTime = formatTime(chunk.start, "vtt");
      const endTime = formatTime(chunk.end, "vtt");
      return `${chunk.index}\n${startTime} --> ${endTime}\n${chunk.text}\n`;
    })
    .join("\n");

  return header + body;
}

/**
 * Convert utterances to SRT format
 */
export function utterancesToSrt(utterances: Utterance[]): string {
  if (!utterances || utterances.length === 0) return "";

  return utterances
    .map((u, i) => {
      const startTime = formatTime(u.start, "srt");
      const endTime = formatTime(u.end, "srt");
      const speakerPrefix =
        u.speaker !== undefined ? `[Speaker ${u.speaker}] ` : "";
      return `${i + 1}\n${startTime} --> ${endTime}\n${speakerPrefix}${u.text.trim()}\n`;
    })
    .join("\n");
}

/**
 * Convert utterances to WebVTT format
 */
export function utterancesToVtt(utterances: Utterance[]): string {
  const header = "WEBVTT\n\n";
  if (!utterances || utterances.length === 0) return header;

  const body = utterances
    .map((u, i) => {
      const startTime = formatTime(u.start, "vtt");
      const endTime = formatTime(u.end, "vtt");
      const speakerPrefix =
        u.speaker !== undefined ? `<v Speaker ${u.speaker}>` : "";
      return `${i + 1}\n${startTime} --> ${endTime}\n${speakerPrefix}${u.text.trim()}\n`;
    })
    .join("\n");

  return header + body;
}

/**
 * Shorthand: direct words to SRT string
 */
export function wordsToSrt(
  words: WordTimestamp[],
  options?: SubtitleOptions,
): string {
  const chunks = wordsToChunks(words, options);
  return chunksToSrt(chunks);
}

/**
 * Shorthand: direct words to WebVTT string
 */
export function wordsToVtt(
  words: WordTimestamp[],
  options?: SubtitleOptions,
): string {
  const chunks = wordsToChunks(words, options);
  return chunksToVtt(chunks);
}
