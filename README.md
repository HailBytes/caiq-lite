# caiq-lite

> Programmatic schema and validator for the CSA CAIQ-Lite vendor security questionnaire. Author, validate, and diff CAIQ responses as code.

[![npm version](https://img.shields.io/npm/v/%40hailbytes%2Fcaiq-lite.svg)](https://www.npmjs.com/package/%40hailbytes%2Fcaiq-lite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Who Is This For

Security engineers, compliance teams, and trust-center operators who need to automate the authoring, validation, and delivery of CSA CAIQ-Lite vendor security questionnaires.

## API

```ts
import { loadCAIQ, validate, diff, exportTo } from '@hailbytes/caiq-lite';

// Load a CAIQ response from YAML
const caiq = await loadCAIQ('responses.yaml');

// Validate against the CAIQ-Lite schema
const result = validate(caiq);

// Diff two CAIQ responses
const changes = diff(previousCAIQ, currentCAIQ);

// Export to multiple formats
const pdf = await exportTo(caiq, { format: 'pdf' });
const xlsx = await exportTo(caiq, { format: 'xlsx' });
const json = await exportTo(caiq, { format: 'json' });
const md = await exportTo(caiq, { format: 'markdown' });
```

## See Also

- [`@hailbytes/sbom-diff`](https://github.com/HailBytes/sbom-diff) — Diff CycloneDX/SPDX SBOMs
- [HailBytes](https://hailbytes.com)
---

*Part of the [HailBytes](https://hailbytes.com) open-source security toolkit.*
