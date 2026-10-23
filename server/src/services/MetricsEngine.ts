import { ProcessedRecord, DashboardMetrics, RouteCategory, CallPayload, MeetingPayload } from '../domain/types.js';

export class MetricsEngine {
  public static calculate(records: ProcessedRecord[]): DashboardMetrics {
    const totalSelected = records.length;
    const calls = records.filter(r => r.source_type === 'call');
    const meetings = records.filter(r => r.source_type === 'meeting');

    // Usable transcript counts
    const usableTotal = records.filter(r => r.has_usable_text).length;
    const usableCalls = calls.filter(r => r.has_usable_text).length;
    const usableMeetings = meetings.filter(r => r.has_usable_text).length;

    // Telephony connection calculations
    let connectedCallsCount = 0;
    let callsWithNonNullConnected = 0;
    for (const call of calls) {
      const p = call.payload as CallPayload;
      if (p.is_connected !== null && p.is_connected !== undefined) {
        callsWithNonNullConnected++;
        if (p.is_connected === true) {
          connectedCallsCount++;
        }
      }
    }

    // Review counts
    let unreviewed = 0;
    let reviewed = 0;
    let pendingReReview = 0;
    let manualCorrectionsCount = 0;
    let discrepanciesDetected = 0;

    const routeDistribution: Record<RouteCategory, number> = {
      deal_next_steps: 0,
      sales_coaching: 0,
      customer_success: 0,
      customer_support: 0,
      partnerships: 0,
      internal_ops: 0,
      intake_exception: 0
    };

    for (const r of records) {
      if (r.review_state === 'unreviewed') unreviewed++;
      else if (r.review_state === 'reviewed') reviewed++;
      else if (r.review_state === 'pending_re-review') pendingReReview++;

      if (r.is_manually_corrected) manualCorrectionsCount++;
      if (r.analysis?.discrepancy) discrepanciesDetected++;

      const activeRoutes = r.manual_routes || r.suggested_routes;
      for (const route of activeRoutes) {
        if (routeDistribution[route] !== undefined) {
          routeDistribution[route]++;
        }
      }
    }

    // Activity by Person: Separating Call Reps from Meeting Organizers!
    const repMap = new Map<string, { name: string; email: string | null; total_calls: number; connected_calls: number; usable_transcripts: number }>();
    for (const call of calls) {
      const p = call.payload as CallPayload;
      const repKey = p.rep_name || p.rep_email || 'Unassigned Rep';
      const existing = repMap.get(repKey) || {
        name: p.rep_name || 'Unknown Rep',
        email: p.rep_email,
        total_calls: 0,
        connected_calls: 0,
        usable_transcripts: 0
      };
      existing.total_calls++;
      if (p.is_connected === true) existing.connected_calls++;
      if (call.has_usable_text) existing.usable_transcripts++;
      repMap.set(repKey, existing);
    }

    const orgMap = new Map<string, { email: string; total_meetings: number; recorded_meetings: number; usable_transcripts: number }>();
    for (const meeting of meetings) {
      const p = meeting.payload as MeetingPayload;
      const orgKey = p.organizer_email || 'Unassigned Organizer';
      const existing = orgMap.get(orgKey) || {
        email: orgKey,
        total_meetings: 0,
        recorded_meetings: 0,
        usable_transcripts: 0
      };
      existing.total_meetings++;
      if (p.recording_status === 'recorded') existing.recorded_meetings++;
      if (meeting.has_usable_text) existing.usable_transcripts++;
      orgMap.set(orgKey, existing);
    }

    return {
      total_selected_records: totalSelected,
      total_calls: calls.length,
      total_meetings: meetings.length,

      usable_transcript_coverage_rate: totalSelected > 0 ? Number(((usableTotal / totalSelected) * 100).toFixed(1)) : 0,
      usable_transcript_count: usableTotal,
      usable_transcript_denominator: totalSelected,

      call_transcript_coverage_rate: calls.length > 0 ? Number(((usableCalls / calls.length) * 100).toFixed(1)) : 0,
      call_transcript_count: usableCalls,
      call_transcript_denominator: calls.length,

      meeting_transcript_coverage_rate: meetings.length > 0 ? Number(((usableMeetings / meetings.length) * 100).toFixed(1)) : 0,
      meeting_transcript_count: usableMeetings,
      meeting_transcript_denominator: meetings.length,

      source_reported_connection_rate: callsWithNonNullConnected > 0 
        ? Number(((connectedCallsCount / callsWithNonNullConnected) * 100).toFixed(1)) 
        : 0,
      source_reported_connected_calls: connectedCallsCount,
      source_reported_evaluated_calls: callsWithNonNullConnected,

      review_counts: {
        unreviewed,
        reviewed,
        pending_re_review: pendingReReview
      },

      manual_corrections_count: manualCorrectionsCount,
      discrepancies_detected_count: discrepanciesDetected,

      route_distribution: routeDistribution,

      activity_by_person: {
        call_reps: Array.from(repMap.values()).sort((a, b) => b.total_calls - a.total_calls),
        meeting_organizers: Array.from(orgMap.values()).sort((a, b) => b.total_meetings - a.total_meetings)
      }
    };
  }
}
