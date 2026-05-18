# caiq-lite

> Programmatic schema and validator for the CSA CAIQ-Lite vendor security questionnaire. Author, validate, and diff CAIQ responses as code.

![Status: Incubation — not yet published to npm](https://img.shields.io/badge/status-incubation-orange)

**Planned npm package:** `@hailbytes/caiq-lite`

## Planned Audience

Security engineers, compliance teams, and trust-center operators who need to automate the authoring, validation, and delivery of CSA CAIQ-Lite vendor security questionnaires.

## Planned API

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
