const {
  detectLicense,
  detectLicenseBatch,
  parseSpdxExpression,
  collectLicenseIds,
} = require("../dist/index.js");

const mitText = `MIT License

Copyright (c) 2026 Example Author

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`;

const apacheText = `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.`;

console.log("--- MIT sample ---");
console.log(detectLicense(mitText));

console.log("\n--- Apache-2.0 sample ---");
console.log(detectLicense(apacheText));

// Mutated MIT text: reworded, phrases broken up — confidence should drop.
const mutatedMit = mitText
  .replace(
    "Permission is hereby granted, free of charge, to any person obtaining a copy",
    "You are hereby granted permission at no cost to any individual who obtains a copy"
  )
  .replace(
    'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND',
    "THIS SOFTWARE COMES WITH NO WARRANTIES WHATSOEVER"
  );

console.log("\n--- Mutated MIT sample (should score lower) ---");
const mitResult = detectLicense(mitText).find((r) => r.spdxId === "MIT");
const mutatedResult = detectLicense(mutatedMit, { minConfidence: 0 }).find(
  (r) => r.spdxId === "MIT"
);
console.log({ original: mitResult, mutated: mutatedResult });

if (!mitResult || mitResult.confidence < 0.9) {
  throw new Error("demo assertion failed: expected high MIT confidence");
}
if (!mutatedResult || mutatedResult.confidence >= mitResult.confidence) {
  throw new Error("demo assertion failed: expected mutated confidence to drop");
}

console.log("\n--- Batch mode ---");
console.log(
  detectLicenseBatch([
    { path: "pkg-a/LICENSE", text: mitText },
    { path: "pkg-b/LICENSE", text: apacheText },
  ])
);

console.log("\n--- SPDX expression parsing ---");
const expr = "(MIT OR Apache-2.0) AND GPL-2.0 WITH Classpath-exception-2.0";
const ast = parseSpdxExpression(expr);
console.log(JSON.stringify(ast, null, 2));
console.log("License ids referenced:", collectLicenseIds(ast));

console.log("\nDemo assertions passed.");
