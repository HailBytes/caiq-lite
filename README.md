# @hailbytes/caiq-lite
![npm](https://img.shields.io/npm/dt/@hailbytes/caiq-lite)


> Programmatic schema and validator for the CSA CAIQ-Lite vendor security questionnaire. Author, validate, and diff CAIQ responses as code.

[![npm version](https://img.shields.io/npm/v/%40hailbytes%2Fcaiq-lite.svg)](https://www.npmjs.com/package/%40hailbytes%2Fcaiq-lite)
[![npm downloads](https://img.shields.io/npm/dw/%40hailbytes%2Fcaiq-lite.svg)](https://www.npmjs.com/package/@hailbytes/caiq-lite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/%40hailbytes%2Fcaiq-lite)](https://bundlephobia.com/package/@hailbytes/caiq-lite)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-davidhailbytes-blue?logo=linkedin&style=flat)](https://www.linkedin.com/in/davidhailbytes/)

---

## What it does

Treat your CSA CAIQ-Lite vendor security questionnaire as code. Load responses from YAML, validate them against the official schema, diff versions over time, and export to PDF, XLSX, JSON, or Markdown — all programmatically.

---

## Install

```bash
npm install @hailbytes/caiq-lite
```

---

## Quick Start

```ts
import { loadCAIQ, validate, diff, exportTo } from '@hailbytes/caiq-lite';

// 1. Load a CAIQ response from YAML
const caiq = await loadCAIQ('responses.yaml');

// 2. Validate against the CAIQ-Lite schema
const result = validate(caiq);
if (!result.valid) {
  console.error(result.errors);
}

// 3. Diff two CAIQ responses
const changes = diff(previousCAIQ, currentCAIQ);
console.log(changes.added, changes.removed, changes.modified);

// 4. Export to multiple formats
const pdf = await exportTo(caiq, { format: 'pdf' });
const xlsx = await exportTo(caiq, { format: 'xlsx' });
const json = await exportTo(caiq, { format: 'json' });
const md = await exportTo(caiq, { format: 'markdown' });
```

---

## Who Is This For

Security engineers, compliance teams, and trust-center operators who need to automate the authoring, validation, and delivery of CSA CAIQ-Lite vendor security questionnaires.

---

## See Also

- [`@hailbytes/sbom-diff`](https://github.com/HailBytes/sbom-diff) — Diff CycloneDX/SPDX SBOMs
- [HailBytes](https://hailbytes.com)

---

*Part of the [HailBytes](https://hailbytes.com) open-source security toolkit.*