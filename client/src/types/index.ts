export type SourceType = 'call' | 'meeting';

export interface CallPayload {
  id: string;
  external_call_id: string;
  workspace_slug: string;
  rep_email: string | null;
  rep_name: string | null;
  rep_user_id: string | null;
  direction: string;
  direction_raw: string;
  from_number: string | null;
  to_number: string | null;
  started_at: string;
  duration_seconds: number;
  talk_time_seconds: number | null;
  speaker_count: number | null;
  segment_count: number | null;
  is_connected: boolean | null;
  is_conversation: boolean | null;
  observed_outcome: string | null;
  classification_reason: string | null;
  classification_status: string | null;
  is_campaign_call: boolean | null;
  first_dial_ever: boolean | null;
  first_connect_ever: boolean | null;
  prior_dials_ever: number | null;
  prior_connects_ever: number | null;
  summary: string | null;
  summary_status: string | null;
  transcript: string | null;
}

export interface MeetingTurn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

export interface MeetingTranscriptPayload {
  meeting_id: string;
  turns: MeetingTurn[];
  unavailable_reason: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds: number;
  provider: string;
  join_url: string;
  organizer_email: string | null;
  attendee_count: number | null;
  recording_status: 'recorded' | 'cancelled' | 'not_scheduled' | string;
  recording_detail: string | null;
  recording_id: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary: string | null;
  summary_status: string | null;
  redacted: boolean;
}

export type RouteCategory = 
  | 'deal_next_steps'
  | 'sales_coaching'
  | 'customer_success'
  | 'customer_support'
  | 'partnerships'
  | 'internal_ops'
  | 'intake_exception';

export type ReviewState = 'unreviewed' | 'reviewed' | 'pending_re-review';
export type AnalysisFreshness = 'fresh' | 'stale_pending_re-review' | 'not_applicable';

export interface EvidenceCitation {
  id: string;
  type: 'turn' | 'quote' | 'telemetry';
  reference: string;
  turn_number?: number;
  quote?: string;
  speaker?: string;
  note: string;
}

export interface NextStepAction {
  action: string;
  owner: string | null;
  timing: string | null;
  verifiable: boolean;
}

export interface DiscrepancyAlert {
  field: string;
  upstream_claim: string;
  spoken_reality: string;
  impact_explanation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ConversationAnalysis {
  headline: string;
  what_happened: string;
  why_it_matters: string;
  evidence_citations: EvidenceCitation[];
  what_evidence_does_not_establish: string[];
  next_steps: NextStepAction[];
  discrepancy?: DiscrepancyAlert;
  is_precomputed: boolean;
}

export interface ProcessedRecord {
  identity: string;
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  current_revision: number;
  last_batch_id: string;
  updated_at: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
  suggested_routes: RouteCategory[];
  manual_routes: RouteCategory[] | null;
  manual_override_reason: string | null;
  manual_override_at: string | null;
  is_manually_corrected: boolean;
  review_state: ReviewState;
  analysis_freshness: AnalysisFreshness;
  analysis: ConversationAnalysis;
  has_usable_text: boolean;
  text_length_chars: number;
  speaker_count_computed: number;
}

export interface DashboardMetrics {
  total_selected_records: number;
  total_calls: number;
  total_meetings: number;
  usable_transcript_coverage_rate: number;
  usable_transcript_count: number;
  usable_transcript_denominator: number;
  call_transcript_coverage_rate: number;
  call_transcript_count: number;
  call_transcript_denominator: number;
  meeting_transcript_coverage_rate: number;
  meeting_transcript_count: number;
  meeting_transcript_denominator: number;
  source_reported_connection_rate: number;
  source_reported_connected_calls: number;
  source_reported_evaluated_calls: number;
  review_counts: {
    unreviewed: number;
    reviewed: number;
    pending_re_review: number;
  };
  manual_corrections_count: number;
  discrepancies_detected_count: number;
  route_distribution: Record<RouteCategory, number>;
  activity_by_person: {
    call_reps: Array<{ name: string; email: string | null; total_calls: number; connected_calls: number; usable_transcripts: number }>;
    meeting_organizers: Array<{ email: string; total_meetings: number; recorded_meetings: number; usable_transcripts: number }>;
  };
}

export interface ExportManifestEntry {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  active_routes: RouteCategory[];
  output_paths: string[];
  review_state: ReviewState;
  is_manually_corrected: boolean;
  manual_override_reason: string | null;
  analysis_freshness: AnalysisFreshness;
  last_updated_at: string;
}
