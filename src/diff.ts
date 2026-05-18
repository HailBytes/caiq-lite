import type { CAIQResponse, DiffResult, ControlDiff, ControlResponse } from './types.js';

function isImprovement(before: string, after: string): boolean {
  return before === 'No' && (after === 'Yes' || after === 'Planned');
}

function isRegression(before: string, after: string): boolean {
  return before === 'Yes' && (after === 'No' || after === 'Planned');
}

/**
 * Diffs two CAIQResponse objects.
 *
 * Returns which controls changed answer, were added in B, or removed in B.
 */
export function diff(a: CAIQResponse, b: CAIQResponse): DiffResult {
  const aMap = new Map<string, ControlResponse>(a.controls.map(c => [c.id, c]));
  const bMap = new Map<string, ControlResponse>(b.controls.map(c => [c.id, c]));

  const changed: ControlDiff[] = [];
  const added: ControlResponse[] = [];
  const removed: ControlResponse[] = [];

  // Find changed and removed
  for (const [id, aCtrl] of aMap) {
    const bCtrl = bMap.get(id);
    if (!bCtrl) {
      removed.push(aCtrl);
    } else if (aCtrl.answer !== bCtrl.answer || aCtrl.comment !== bCtrl.comment) {
      changed.push({
        controlId: id,
        domain: bCtrl.domain,
        title: bCtrl.title,
        before: aCtrl.answer,
        after: bCtrl.answer,
        commentChanged: aCtrl.comment !== bCtrl.comment,
      });
    }
  }

  // Find added
  for (const [id, bCtrl] of bMap) {
    if (!aMap.has(id)) {
      added.push(bCtrl);
    }
  }

  const improvements = changed.filter(c => isImprovement(c.before, c.after)).length;
  const regressions = changed.filter(c => isRegression(c.before, c.after)).length;

  return {
    changed,
    added,
    removed,
    summary: {
      totalChanged: changed.length,
      totalAdded: added.length,
      totalRemoved: removed.length,
      improvements,
      regressions,
    },
  };
}
