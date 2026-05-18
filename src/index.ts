/**
 * @hailbytes/caiq-lite
 *
 * Programmatic schema, validator, and diff engine for the CSA CAIQ-Lite
 * vendor security questionnaire. Author, validate, and diff CAIQ responses
 * as structured TypeScript data.
 *
 * @example
 * ```ts
 * import { loadCAIQ, validate, diff, exportTo } from '@hailbytes/caiq-lite';
 *
 * const caiq = await loadCAIQ('./responses.yaml');
 * const result = validate(caiq);
 * if (!result.valid) console.error(result.errors);
 * ```
 */

export { loadCAIQ } from './loader.js';
export { validate } from './validate.js';
export { diff } from './diff.js';
export { exportTo } from './exporter.js';
export type {
  CAIQResponse,
  ControlResponse,
  ControlDomain,
  ControlAnswer,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  DiffResult,
  ControlDiff,
  ExportFormat,
  ExportOptions,
} from './types.js';
