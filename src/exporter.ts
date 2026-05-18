import type { CAIQResponse, ExportOptions } from './types.js';

/**
 * Export a CAIQResponse to a string in the requested format.
 *
 * Supported formats: 'json' | 'markdown' | 'csv'
 */
export function exportTo(caiq: CAIQResponse, options: ExportOptions): string {
  switch (options.format) {
    case 'json':
      return toJSON(caiq, options);
    case 'markdown':
      return toMarkdown(caiq, options);
    case 'csv':
      return toCSV(caiq, options);
    default:
      throw new Error(`Unsupported export format: ${String(options.format)}`);
  }
}

function toJSON(caiq: CAIQResponse, _opts: ExportOptions): string {
  return JSON.stringify(caiq, null, 2);
}

function toMarkdown(caiq: CAIQResponse, opts: ExportOptions): string {
  const lines: string[] = [
    `# CAIQ-Lite: ${caiq.vendor} — ${caiq.product}`,
    ``,
    `**Version:** ${caiq.version}  `,
    `**Completed:** ${caiq.completedAt}  `,
    ``,
    `| Control | Domain | Title | Answer |${opts.includeComments ? ' Comment |' : ''}`,
    `|---------|--------|-------|--------|${opts.includeComments ? '---------|' : ''}`,
  ];

  for (const ctrl of caiq.controls) {
    const commentCell = opts.includeComments ? ` ${ctrl.comment ?? ''} |` : '';
    lines.push(`| ${ctrl.id} | ${ctrl.domain} | ${ctrl.title} | ${ctrl.answer} |${commentCell}`);
  }

  return lines.join('\n');
}

function toCSV(caiq: CAIQResponse, opts: ExportOptions): string {
  const headers = [
    'id',
    'domain',
    'title',
    'answer',
    ...(opts.includeComments ? ['comment', 'evidence'] : []),
  ];
  const rows = caiq.controls.map(ctrl => [
    ctrl.id,
    ctrl.domain,
    `"${ctrl.title.replace(/"/g, '""')}"`,
    ctrl.answer,
    ...(opts.includeComments
      ? [
          `"${(ctrl.comment ?? '').replace(/"/g, '""')}"`,
          `"${(ctrl.evidence ?? '').replace(/"/g, '""')}"`,
        ]
      : []),
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
