/**
 * license-detector
 * Detect open-source licenses from raw file text via normalized
 * fingerprint matching against a built-in corpus of 12 common licenses.
 * This is a text heuristic, not a legal determination.
 */

import { LICENSE_CORPUS, LicenseFingerprint } from "./corpus";

export interface DetectionResult {
  spdxId: string;
  name: string;
  /** 0..1, fraction of the license's distinctive phrases found in the text. */
  confidence: number;
  matchedPhrases: string[];
}

export interface DetectOptions {
  /** Minimum confidence to include in results. Default 0.15. */
  minConfidence?: number;
  /** Max results to return, best first. Default 3. */
  limit?: number;
}

/**
 * Normalize license text for fingerprint matching: lowercase, strip
 * copyright/attribution lines (they vary per-project), collapse all
 * whitespace runs to single spaces.
 */
export function normalize(text: string): string {
  const lines = text.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim().toLowerCase();
    if (trimmed.length === 0) return false;
    if (/^copyright\b/.test(trimmed)) return false;
    if (/^\(c\)\s/.test(trimmed)) return false;
    if (/^©/.test(trimmed)) return false;
    return true;
  });
  return lines
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function scoreAgainst(
  normalizedText: string,
  fingerprint: LicenseFingerprint
): { confidence: number; matchedPhrases: string[] } {
  const matched: string[] = [];
  for (const phrase of fingerprint.phrases) {
    if (normalizedText.includes(phrase)) {
      matched.push(phrase);
    }
  }
  const confidence = fingerprint.phrases.length
    ? matched.length / fingerprint.phrases.length
    : 0;
  return { confidence, matchedPhrases: matched };
}

/**
 * Detect the most likely license(s) matching the given raw file text.
 * Returns results sorted by confidence, descending.
 */
export function detectLicense(
  text: string,
  options: DetectOptions = {}
): DetectionResult[] {
  const minConfidence = options.minConfidence ?? 0.15;
  const limit = options.limit ?? 3;
  const normalized = normalize(text);

  const results: DetectionResult[] = LICENSE_CORPUS.map((fp) => {
    const { confidence, matchedPhrases } = scoreAgainst(normalized, fp);
    return {
      spdxId: fp.spdxId,
      name: fp.name,
      confidence: Math.round(confidence * 1000) / 1000,
      matchedPhrases,
    };
  })
    .filter((r) => r.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence);

  return results.slice(0, limit);
}

export interface BatchInput {
  path: string;
  text: string;
}

export interface BatchResult {
  path: string;
  matches: DetectionResult[];
}

/** Run detectLicense over a list of {path, text} files. */
export function detectLicenseBatch(
  files: BatchInput[],
  options: DetectOptions = {}
): BatchResult[] {
  return files.map((file) => ({
    path: file.path,
    matches: detectLicense(file.text, options),
  }));
}

/** All SPDX ids known to this corpus. */
export function listKnownLicenses(): string[] {
  return LICENSE_CORPUS.map((fp) => fp.spdxId);
}

// --- SPDX expression parsing ---------------------------------------------

export type SpdxNode =
  | { kind: "license"; id: string }
  | { kind: "and"; left: SpdxNode; right: SpdxNode }
  | { kind: "or"; left: SpdxNode; right: SpdxNode }
  | { kind: "with"; license: SpdxNode; exception: string };

/**
 * Parse a (simplified) SPDX license expression supporting AND / OR / WITH
 * and parenthesized grouping, e.g. "(MIT OR Apache-2.0) AND GPL-2.0 WITH Classpath-exception-2.0".
 * Throws on malformed input.
 */
export function parseSpdxExpression(expression: string): SpdxNode {
  const tokens = tokenize(expression);
  let pos = 0;

  function peek(): string | undefined {
    return tokens[pos];
  }
  function next(): string {
    const t = tokens[pos];
    if (t === undefined) throw new Error("Unexpected end of SPDX expression");
    pos += 1;
    return t;
  }

  function parseExpression(): SpdxNode {
    let left = parseAnd();
    while (peek()?.toUpperCase() === "OR") {
      next();
      const right = parseAnd();
      left = { kind: "or", left, right };
    }
    return left;
  }

  function parseAnd(): SpdxNode {
    let left = parseWith();
    while (peek()?.toUpperCase() === "AND") {
      next();
      const right = parseWith();
      left = { kind: "and", left, right };
    }
    return left;
  }

  function parseWith(): SpdxNode {
    let node = parseAtom();
    if (peek()?.toUpperCase() === "WITH") {
      next();
      const exception = next();
      node = { kind: "with", license: node, exception };
    }
    return node;
  }

  function parseAtom(): SpdxNode {
    const token = next();
    if (token === "(") {
      const inner = parseExpression();
      const closing = next();
      if (closing !== ")") throw new Error("Expected closing parenthesis");
      return inner;
    }
    if (token === ")" || token.toUpperCase() === "AND" || token.toUpperCase() === "OR" || token.toUpperCase() === "WITH") {
      throw new Error(`Unexpected token: ${token}`);
    }
    return { kind: "license", id: token };
  }

  const result = parseExpression();
  if (pos !== tokens.length) {
    throw new Error(`Unexpected trailing tokens: ${tokens.slice(pos).join(" ")}`);
  }
  return result;
}

function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  const re = /\(|\)|[^\s()]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expression)) !== null) {
    tokens.push(m[0]);
  }
  return tokens;
}

/** Collect all license ids referenced anywhere in a parsed SPDX expression. */
export function collectLicenseIds(node: SpdxNode): string[] {
  switch (node.kind) {
    case "license":
      return [node.id];
    case "with":
      return collectLicenseIds(node.license);
    case "and":
    case "or":
      return [...collectLicenseIds(node.left), ...collectLicenseIds(node.right)];
  }
}
