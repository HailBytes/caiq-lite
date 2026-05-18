import { describe, it, expect } from 'vitest';
import { validate } from '../validate.js';
import type { CAIQResponse } from '../types.js';

const minimalCAIQ: CAIQResponse = {
  version: '3.1',
  vendor: 'Acme Corp',
  product: 'Acme Cloud',
  completedAt: '2026-01-15',
  controls: [
    { id: 'AIS-01', domain: 'AIS', title: 'Application Security', answer: 'Yes' },
    { id: 'IAM-01', domain: 'IAM', title: 'Identity Management', answer: 'No', comment: 'Using legacy IAM' },
    { id: 'GRC-01', domain: 'GRC', title: 'Governance Policy', answer: 'Planned', comment: 'Q3 2026' },
  ],
};

describe('validate', () => {
  it('accepts a valid CAIQ', () => {
    const result = validate(minimalCAIQ);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('reports missing vendor', () => {
    const result = validate({ ...minimalCAIQ, vendor: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'vendor')).toBe(true);
  });

  it('reports missing product', () => {
    const result = validate({ ...minimalCAIQ, product: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'product')).toBe(true);
  });

  it('reports invalid date', () => {
    const result = validate({ ...minimalCAIQ, completedAt: 'not-a-date' });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'completedAt')).toBe(true);
  });

  it('reports invalid control id format', () => {
    const result = validate({
      ...minimalCAIQ,
      controls: [{ id: 'BADID', domain: 'AIS', title: 'Test', answer: 'Yes' }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.controlId === 'BADID' && e.field === 'id')).toBe(true);
  });

  it('reports duplicate control ids', () => {
    const result = validate({
      ...minimalCAIQ,
      controls: [
        { id: 'AIS-01', domain: 'AIS', title: 'A', answer: 'Yes' },
        { id: 'AIS-01', domain: 'AIS', title: 'B', answer: 'No' },
      ],
    });
    expect(result.errors.some(e => e.message.includes('Duplicate'))).toBe(true);
  });

  it('warns when Planned has no comment', () => {
    const result = validate({
      ...minimalCAIQ,
      controls: [{ id: 'AIS-01', domain: 'AIS', title: 'Test', answer: 'Planned' }],
    });
    expect(result.valid).toBe(true); // warning not error
    expect(result.warnings.some(w => w.controlId === 'AIS-01')).toBe(true);
  });

  it('computes correct stats', () => {
    const result = validate(minimalCAIQ);
    expect(result.stats.total).toBe(3);
    expect(result.stats.yes).toBe(1);
    expect(result.stats.no).toBe(1);
    expect(result.stats.planned).toBe(1);
  });
});
