# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- Real devDependencies: `typescript`, `vitest`, `@vitest/coverage-v8`, `typescript-eslint`, `js-yaml`, `@types/node`
- `src/types.ts` — Full domain model: `CAIQResponse`, `ControlResponse`, `ControlDomain` (17 CCM domains), `ControlAnswer`, `ValidationResult`, `ValidationError`, `ValidationWarning`, `DiffResult`, `ControlDiff`, `ExportFormat`, `ExportOptions`
- `src/validate.ts` — `validate()`: required-field checks, control ID pattern validation (`/^[A-Z]{2,3}-\d{2}$/`), duplicate detection, warnings for unanswered Planned/No controls
- `src/diff.ts` — `diff()`: structural diff of two CAIQ responses, tracks improvements and regressions
- `src/loader.ts` — `loadCAIQ()`: async YAML/JSON file loader
- `src/exporter.ts` — `exportTo()`: JSON, Markdown table, and CSV exporters
- `src/index.ts` — Full public API re-exports replacing stub
- Unit test suite: 18 tests across validate, diff, and exporter modules (all passing)
- `eslint.config.js` — Flat config using `typescript-eslint`
- `vitest.config.ts` — Node environment, v8 coverage provider
- `tsconfig.build.json` — Separate build config excluding test files from `dist/`
- Updated `package.json`: real scripts (`build`, `typecheck`, `lint`, `test`, `test:watch`, `test:coverage`), `exports`, `files` fields
- Updated `.gitignore`: exclude compiled JS artifacts from `src/`

### Initial scaffold
- Repository structure, README, LICENSE, CONTRIBUTING.md
