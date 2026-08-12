# license-detector

Detect open-source licenses from raw file text via normalized fingerprint matching against a
built-in corpus of 12 common licenses. Strict TypeScript, zero runtime dependencies.

## Why

Scanning a dependency tree or a batch of vendored files for license text usually just needs a
quick, dependency-free heuristic — not a full legal-grade classifier. This library normalizes text
(lowercase, strip copyright lines, collapse whitespace) and scores it against distinctive phrase
sets for each license family, so it's forgiving of copyright-holder differences but honest about
confidence when the text has been reworded or is ambiguous.

**This is a text heuristic, not legal advice.** Always have a human (or counsel) confirm licensing
decisions that matter.

## Quickstart

```ts
import { detectLicense, parseSpdxExpression } from "license-detector";

const results = detectLicense(fileText);
// [{ spdxId: "MIT", name: "MIT License", confidence: 1, matchedPhrases: [...] }]

const ast = parseSpdxExpression("(MIT OR Apache-2.0) AND GPL-2.0 WITH Classpath-exception-2.0");
```

## API

### `detectLicense(text, options?): DetectionResult[]`
Scores `text` against the 12-license corpus, sorted by confidence descending.
`options.minConfidence` (default `0.15`) filters low-confidence noise; `options.limit` (default `3`)
caps results.

### `detectLicenseBatch(files, options?): BatchResult[]`
Runs `detectLicense` over `{ path, text }[]`.

### `normalize(text): string`
The normalization step used internally — lowercase, copyright-line stripping, whitespace collapse.
Exposed for callers who want to inspect or reuse it.

### `listKnownLicenses(): string[]`
The 12 SPDX ids in the corpus: MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, GPL-2.0, GPL-3.0,
LGPL-3.0, MPL-2.0, Unlicense, CC0-1.0, WTFPL.

### `parseSpdxExpression(expression): SpdxNode`
Parses a simplified SPDX license expression (AND / OR / WITH, parenthesized grouping) into an AST.

### `collectLicenseIds(node): string[]`
Flattens all license ids referenced in a parsed SPDX expression.

## Limits

- 12 licenses only — anything outside that corpus scores below `minConfidence` and is omitted.
- Phrase-based matching is sensitive to significant rewording of license text (by design — see the
  demo, where a reworded MIT text drops from confidence 1 to 0.5).
- Confidence is a fraction of matched distinctive phrases, not a probability or legal certainty.

---
Part of the [ferrow-toolkit](https://github.com/FerrowAI/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)
