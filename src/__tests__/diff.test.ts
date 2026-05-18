import { describe, it, expect } from 'vitest';
import { diff } from '../diff.js';
import type { CAIQResponse } from '../types.js';

const base: CAIQResponse = {
  version: '3.1',
  vendor: 'Acme Corp',
  product: 'Acme Cloud',
  completedAt: '2026-01-01',
  controls: [
    { id: 'AIS-01', domain: 'AIS', title: 'App Security', answer: 'Yes' },
    { id: 'IAM-01', domain: 'IAM', title: 'Identity Mgmt', answer: 'No' },
    { id: 'GRC-01', domain: 'GRC', title: 'Governance', answer: 'Planned' },
  ],
};

describe('diff', () => {
  it('returns empty diff for identical CAIQs', () => {
    const result = diff(base, base);
    expect(result.changed).toHaveLength(0);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
  });

  it('detects answer change', () => {
    const updated: CAIQResponse = {
      ...base,
      controls: base.controls.map(c =>
        c.id === 'IAM-01' ? { ...c, answer: 'Yes' as const } : c,
      ),
    };
    const result = diff(base, updated);
    expect(result.changed).toHaveLength(1);
    expect(result.changed[0].controlId).toBe('IAM-01');
    expect(result.changed[0].before).toBe('No');
    expect(result.changed[0].after).toBe('Yes');
    expect(result.summary.improvements).toBe(1);
  });

  it('detects regression', () => {
    const updated: CAIQResponse = {
      ...base,
      controls: base.controls.map(c =>
        c.id === 'AIS-01' ? { ...c, answer: 'No' as const } : c,
      ),
    };
    const result = diff(base, updated);
    expect(result.summary.regressions).toBe(1);
  });

  it('detects added controls', () => {
    const updated: CAIQResponse = {
      ...base,
      controls: [
        ...base.controls,
        { id: 'TVM-01', domain: 'TVM', title: 'Vuln Mgmt', answer: 'Yes' },
      ],
    };
    const result = diff(base, updated);
    expect(result.added).toHaveLength(1);
    expect(result.added[0].id).toBe('TVM-01');
  });

  it('detects removed controls', () => {
    const updated: CAIQResponse = {
      ...base,
      controls: base.controls.filter(c => c.id !== 'GRC-01'),
    };
    const result = diff(base, updated);
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0].id).toBe('GRC-01');
  });
});
