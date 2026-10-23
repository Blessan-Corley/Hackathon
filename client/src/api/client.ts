import { ProcessedRecord, DashboardMetrics, RouteCategory, ReviewState, ExportManifestEntry } from '../types/index.js';

const BASE_URL = '/api';

export async function fetchRecords(params: {
  person?: string;
  source_type?: string;
  route?: string;
  review_state?: string;
  has_transcript?: string;
  search?: string;
}): Promise<{ count: number; records: ProcessedRecord[] }> {
  const query = new URLSearchParams();
  if (params.person && params.person !== 'all') query.set('person', params.person);
  if (params.source_type && params.source_type !== 'all') query.set('source_type', params.source_type);
  if (params.route && params.route !== 'all') query.set('route', params.route);
  if (params.review_state && params.review_state !== 'all') query.set('review_state', params.review_state);
  if (params.has_transcript && params.has_transcript !== 'all') query.set('has_transcript', params.has_transcript);
  if (params.search) query.set('search', params.search);

  const res = await fetch(`${BASE_URL}/records?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
}

export async function fetchRecord(source_type: string, source_id: string): Promise<ProcessedRecord> {
  const res = await fetch(`${BASE_URL}/records/${source_type}/${source_id}`);
  if (!res.ok) throw new Error(`Failed to fetch record ${source_type}:${source_id}`);
  return res.json();
}

export async function fetchMetrics(): Promise<DashboardMetrics> {
  const res = await fetch(`${BASE_URL}/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function fetchManagerBrief(): Promise<{
  date: string;
  timezone: string;
  scope: string;
  content: string;
  urgent_alerts: Array<{ id: string; type: string; title: string; citation: string; action: string }>;
}> {
  const res = await fetch(`${BASE_URL}/manager-brief`);
  if (!res.ok) throw new Error('Failed to fetch manager brief');
  return res.json();
}

export async function updateRoute(
  source_type: string,
  source_id: string,
  routes: RouteCategory[],
  reason?: string
): Promise<{ success: boolean; record: ProcessedRecord }> {
  const res = await fetch(`${BASE_URL}/records/${source_type}/${source_id}/route`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routes, reason })
  });
  if (!res.ok) throw new Error('Failed to update route');
  return res.json();
}

export async function resetRoute(
  source_type: string,
  source_id: string
): Promise<{ success: boolean; record: ProcessedRecord }> {
  const res = await fetch(`${BASE_URL}/records/${source_type}/${source_id}/reset-route`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset route');
  return res.json();
}

export async function updateReviewState(
  source_type: string,
  source_id: string,
  review_state: ReviewState
): Promise<{ success: boolean; record: ProcessedRecord }> {
  const res = await fetch(`${BASE_URL}/records/${source_type}/${source_id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review_state })
  });
  if (!res.ok) throw new Error('Failed to update review state');
  return res.json();
}

// --- REPLAY CONTRACT ACTIONS ---

export async function replayReset(): Promise<{ current_records: number }> {
  const res = await fetch(`${BASE_URL}/replay/reset`, { method: 'POST' });
  return res.json();
}

export async function replayInitial(): Promise<any> {
  const res = await fetch(`${BASE_URL}/replay/initial`, { method: 'POST' });
  return res.json();
}

export async function replayRepeatInitial(): Promise<any> {
  const res = await fetch(`${BASE_URL}/replay/repeat-initial`, { method: 'POST' });
  return res.json();
}

export async function replayUpdate(): Promise<any> {
  const res = await fetch(`${BASE_URL}/replay/update`, { method: 'POST' });
  return res.json();
}

export async function runAllReplayChecks(): Promise<{ success: boolean; all_checks_passed: boolean; steps: any[] }> {
  const res = await fetch(`${BASE_URL}/replay/run-all-checks`, { method: 'POST' });
  return res.json();
}

// --- EXPORT ACTIONS ---

export async function generateExport(): Promise<any> {
  const res = await fetch(`${BASE_URL}/export/generate`, { method: 'POST' });
  return res.json();
}

export async function fetchManifest(): Promise<ExportManifestEntry[]> {
  const res = await fetch(`${BASE_URL}/export/manifest`);
  return res.json();
}

export function getDownloadZipUrl(): string {
  return `${BASE_URL}/export/download`;
}
