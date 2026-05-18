import type {
  CAIQResponse,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ControlAnswer,
} from './types.js';

const VALID_ANSWERS: ControlAnswer[] = ['Yes', 'No', 'N/A', 'Planned'];
const CONTROL_ID_PATTERN = /^[A-Z]{2,3}-\d{2}$/;

/**
 * Validates a CAIQResponse against the CAIQ-Lite schema rules.
 *
 * Rules enforced:
 * - Required top-level fields (vendor, product, version, completedAt)
 * - Each control must have a valid id, domain, title, and answer
 * - Control IDs must match pattern /^[A-Z]{2,3}-\d{2}$/
 * - Duplicate control IDs are flagged as errors
 * - Controls with answer 'Planned' and no comment get a warning
 */
export function validate(caiq: CAIQResponse): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Top-level required fields
  if (!caiq.vendor?.trim()) {
    errors.push({ controlId: '__root__', field: 'vendor', message: 'vendor is required and must be non-empty' });
  }
  if (!caiq.product?.trim()) {
    errors.push({ controlId: '__root__', field: 'product', message: 'product is required and must be non-empty' });
  }
  if (!caiq.version?.trim()) {
    errors.push({ controlId: '__root__', field: 'version', message: 'version is required' });
  }
  if (!caiq.completedAt?.trim()) {
    errors.push({ controlId: '__root__', field: 'completedAt', message: 'completedAt is required (ISO 8601 date)' });
  } else if (isNaN(Date.parse(caiq.completedAt))) {
    errors.push({
      controlId: '__root__',
      field: 'completedAt',
      message: `completedAt "${caiq.completedAt}" is not a valid date`,
    });
  }

  if (!Array.isArray(caiq.controls) || caiq.controls.length === 0) {
    errors.push({
      controlId: '__root__',
      field: 'controls',
      message: 'controls array is required and must be non-empty',
    });
    return buildResult(errors, warnings, caiq);
  }

  // Per-control validation
  const seenIds = new Set<string>();

  for (const ctrl of caiq.controls) {
    const id = ctrl.id ?? '__unknown__';

    if (!ctrl.id?.trim()) {
      errors.push({ controlId: id, field: 'id', message: 'Control id is required' });
    } else if (!CONTROL_ID_PATTERN.test(ctrl.id)) {
      errors.push({
        controlId: id,
        field: 'id',
        message: `Control id "${ctrl.id}" does not match pattern AIS-01`,
      });
    }

    if (seenIds.has(id)) {
      errors.push({ controlId: id, field: 'id', message: `Duplicate control id "${id}"` });
    }
    seenIds.add(id);

    if (!ctrl.title?.trim()) {
      errors.push({ controlId: id, field: 'title', message: 'title is required' });
    }
    if (!ctrl.domain?.trim()) {
      errors.push({ controlId: id, field: 'domain', message: 'domain is required' });
    }
    if (!VALID_ANSWERS.includes(ctrl.answer)) {
      errors.push({
        controlId: id,
        field: 'answer',
        message: `Invalid answer "${ctrl.answer}". Must be one of: ${VALID_ANSWERS.join(', ')}`,
      });
    }

    // Warnings
    if (ctrl.answer === 'Planned' && !ctrl.comment?.trim()) {
      warnings.push({
        controlId: id,
        message: 'Answer is "Planned" but no comment/timeline is provided',
      });
    }
    if (ctrl.answer === 'No' && !ctrl.comment?.trim()) {
      warnings.push({
        controlId: id,
        message: 'Answer is "No" — consider adding a comment explaining compensating controls',
      });
    }
  }

  return buildResult(errors, warnings, caiq);
}

function buildResult(
  errors: ValidationError[],
  warnings: ValidationWarning[],
  caiq: CAIQResponse,
): ValidationResult {
  const controls = Array.isArray(caiq.controls) ? caiq.controls : [];
  const stats = {
    total: controls.length,
    answered: controls.filter(c => c.answer).length,
    yes: controls.filter(c => c.answer === 'Yes').length,
    no: controls.filter(c => c.answer === 'No').length,
    na: controls.filter(c => c.answer === 'N/A').length,
    planned: controls.filter(c => c.answer === 'Planned').length,
  };
  return { valid: errors.length === 0, errors, warnings, stats };
}
