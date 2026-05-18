import { describe, it, expect } from 'vitest';
import { exportTo } from '../exporter.js';
import type { CAIQResponse } from '../types.js';

const sample: CAIQResponse = {
  version: '3.1',
  vendor: 'Acme Corp',
  product: 'Acme Cloud',
  completedAt: '2026-01-15',
  controls: [
    { id: 'AIS-01', domain: 'AIS', title: 'App Security', answer: 'Yes', comment: 'Fully implemented' },
  ],
};

describe('exportTo', () => {
  it('exports to JSON', () => {
    const out = exportTo(sample, { format: 'json' });
    const parsed = JSON.parse(out) as CAIQResponse;
    expect(parsed.vendor).toBe('Acme Corp');
    expect(parsed.controls).toHaveLength(1);
  });

  it('exports to markdown', () => {
    const out = exportTo(sample, { format: 'markdown' });
    expect(out).toContain('# CAIQ-Lite');
    expect(out).toContain('AIS-01');
    expect(out).toContain('Yes');
  });

  it('includes comments in markdown when requested', () => {
    const out = exportTo(sample, { format: 'markdown', includeComments: true });
    expect(out).toContain('Fully implemented');
  });

  it('exports to CSV', () => {
    const out = exportTo(sample, { format: 'csv' });
    expect(out).toContain('id,domain,title,answer');
    expect(out).toContain('AIS-01');
  });

  it('throws on unsupported format', () => {
    expect(() => exportTo(sample, { format: 'xml' as never })).toThrow();
  });
});
