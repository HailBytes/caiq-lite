import { readFile } from 'node:fs/promises';
import { load as yamlLoad } from 'js-yaml';
import type { CAIQResponse } from './types.js';

/**
 * Load a CAIQResponse from a YAML or JSON file.
 *
 * @param filePath - Absolute or relative path to the CAIQ file
 */
export async function loadCAIQ(filePath: string): Promise<CAIQResponse> {
  const raw = await readFile(filePath, 'utf-8');
  const ext = filePath.split('.').pop()?.toLowerCase();

  let parsed: unknown;
  if (ext === 'yaml' || ext === 'yml') {
    parsed = yamlLoad(raw);
  } else if (ext === 'json') {
    parsed = JSON.parse(raw);
  } else {
    // Try YAML first, fall back to JSON
    try {
      parsed = yamlLoad(raw);
    } catch {
      parsed = JSON.parse(raw);
    }
  }

  // Basic shape assertion — full validation via validate()
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`loadCAIQ: file at "${filePath}" did not parse to an object`);
  }

  return parsed as CAIQResponse;
}
