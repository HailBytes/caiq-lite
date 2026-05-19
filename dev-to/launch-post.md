---
title: "Stop Maintaining CAIQ Responses in Excel — Treat Them As Code"
published: false
description: CSA CAIQ-Lite responses live in spreadsheets that go stale, never get diffed between versions, and break formatting on every export. This library lets you author CAIQ as YAML, validate against the official schema, diff versions, and export to PDF/XLSX/JSON/Markdown.
tags: security, typescript, opensource, productivity
cover_image: <COVER_IMAGE_URL>
canonical_url: https://github.com/hailbytes/caiq-lite
published_at: 2026-05-24 13:00 +0000
---

<!--
COVER IMAGE PROMPT (1000x420, 2.4:1 banner):

Flat vector illustration, isometric perspective. A stylized YAML / code file icon on the
left transforming (with light, flowing arrows) into a fan of three document icons on the
right — one shaped like a PDF page, one like a spreadsheet grid, one like a markdown doc.
A small shield-with-checkmark badge orbits the transformation, suggesting compliance
validation. Dark navy (#0a1628) background, electric cyan (#00d4ff) for the source file
and arrows, soft green (#5eead4) for the shield, amber (#ffb347) accent on the output
documents. Banner composition with left-to-right flow. Generous negative space. No
readable text in the image — represent docs as iconic shapes only.

Suggested generators: Midjourney v6+ with `--ar 1000:420 --style raw`, DALL-E 3, or Flux.
After generation, host on Cloudinary or GitHub raw and replace <COVER_IMAGE_URL> above.
-->

Every B2B SaaS company eventually has to fill out a CAIQ. If you sell to enterprise, you've probably filled out a dozen.

The current state of the art: someone copies last quarter's `.xlsx` into a new sheet, edits the cells that changed, and emails it to the prospect. Nobody knows what changed between v3 and v4. The schema drifts from the official CSA version. The export breaks Excel formatting in subtle ways that make security reviewers raise eyebrows.

[`@hailbytes/caiq-lite`](https://www.npmjs.com/package/@hailbytes/caiq-lite) lets you treat your CAIQ as code instead.

## Author in YAML

```yaml
# responses.yaml
provider:
  name: Acme Inc
  contact: trust@acme.example
responses:
  AIS-01.1:
    answer: yes
    notes: |
      Application security training is required annually for all engineers.
      Completion is tracked in our LMS and audited each quarter.
  AIS-01.2:
    answer: yes
    notes: SAST runs on every PR via GitHub Actions.
```

## Validate, diff, export

```ts
import { loadCAIQ, validate, diff, exportTo } from '@hailbytes/caiq-lite';

const caiq = await loadCAIQ('responses.yaml');

// Validate against the official CAIQ-Lite schema
const result = validate(caiq);
if (!result.valid) console.error(result.errors);

// Diff against last quarter's version
const changes = diff(previousCAIQ, currentCAIQ);
console.log(changes.added, changes.removed, changes.modified);

// Export to whatever the prospect actually wants
const pdf  = await exportTo(caiq, { format: 'pdf' });
const xlsx = await exportTo(caiq, { format: 'xlsx' });
const md   = await exportTo(caiq, { format: 'markdown' });
```

## Why YAML

Because it diffs cleanly in git, your trust center can render it as a static site, your CI can validate it on every PR, and you stop emailing spreadsheets.

```bash
npm install @hailbytes/caiq-lite
```

Source: [github.com/hailbytes/caiq-lite](https://github.com/hailbytes/caiq-lite) — MIT licensed.
