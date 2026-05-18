/**
 * Core domain types for @hailbytes/caiq-lite
 *
 * CSA CAIQ-Lite maps to 197 questions across 17 control domains.
 * This module defines the schema for representing, validating, and diffing
 * CAIQ responses as structured data.
 */

/** The 17 CSA Cloud Control Matrix (CCM) control domains */
export type ControlDomain =
  | 'AIS' // Application & Interface Security
  | 'BCR' // Business Continuity Management
  | 'CCC' // Change Control & Configuration
  | 'CEK' // Cryptography, Encryption & Key Mgmt
  | 'DCS' // Datacenter Security
  | 'DSP' // Data Security & Privacy
  | 'GRC' // Governance, Risk & Compliance
  | 'HRS' // Human Resources
  | 'IAM' // Identity & Access Management
  | 'IPY' // Interoperability & Portability
  | 'IVS' // Infrastructure & Virtualization
  | 'LOG' // Logging & Monitoring
  | 'SEF' // Security Incident Management
  | 'STA' // Supply Chain Mgmt & Transparency
  | 'TVM' // Threat & Vulnerability Management
  | 'UEM' // Universal Endpoint Management
  | 'SRM'; // Supply Chain Risk Management

/** Response values for a CAIQ control */
export type ControlAnswer = 'Yes' | 'No' | 'N/A' | 'Planned';

/** A single CAIQ control response */
export interface ControlResponse {
  /** Control ID, e.g. "AIS-01" */
  id: string;
  /** The control domain */
  domain: ControlDomain;
  /** Short name / title of the control */
  title: string;
  /** Vendor's answer */
  answer: ControlAnswer;
  /** Optional free-text explanation */
  comment?: string;
  /** Optional link to evidence (URL or document reference) */
  evidence?: string;
}

/** A complete CAIQ-Lite response document */
export interface CAIQResponse {
  /** Schema version, e.g. "3.1" */
  version: string;
  /** Vendor / organization name */
  vendor: string;
  /** Product or service name this CAIQ covers */
  product: string;
  /** ISO 8601 date of completion */
  completedAt: string;
  /** Optional point-of-contact */
  contact?: {
    name: string;
    email: string;
  };
  /** The control responses — one per CAIQ-Lite control */
  controls: ControlResponse[];
}

/** Result of validating a CAIQResponse */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  /** Summary stats */
  stats: {
    total: number;
    answered: number;
    yes: number;
    no: number;
    na: number;
    planned: number;
  };
}

export interface ValidationError {
  controlId: string;
  field: string;
  message: string;
}

export interface ValidationWarning {
  controlId: string;
  message: string;
}

/** Result of diffing two CAIQResponses */
export interface DiffResult {
  /** Controls where the answer changed */
  changed: ControlDiff[];
  /** Controls present in B but not in A */
  added: ControlResponse[];
  /** Controls present in A but not in B */
  removed: ControlResponse[];
  /** Summary */
  summary: {
    totalChanged: number;
    totalAdded: number;
    totalRemoved: number;
    /** e.g. improvements from No -> Yes */
    improvements: number;
    /** e.g. regressions from Yes -> No */
    regressions: number;
  };
}

export interface ControlDiff {
  controlId: string;
  domain: ControlDomain;
  title: string;
  before: ControlAnswer;
  after: ControlAnswer;
  commentChanged: boolean;
}

/** Supported export formats */
export type ExportFormat = 'json' | 'markdown' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  /** Include comment fields in output */
  includeComments?: boolean;
}
