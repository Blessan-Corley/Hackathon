import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { ReplayBar } from './components/ReplayBar.js';
import { MetricCards } from './components/MetricCards.js';
import { FilterToolbar } from './components/FilterToolbar.js';
import { TriageInbox } from './components/TriageInbox.js';
import { EvidenceInspector } from './components/EvidenceInspector.js';
import { ManagerBriefModal } from './components/ManagerBriefModal.js';
import { ExportModal } from './components/ExportModal.js';
import { fetchRecords, fetchMetrics, updateRoute, resetRoute, updateReviewState } from './api/client.js';
import { ProcessedRecord, DashboardMetrics, RouteCategory, ReviewState } from './types/index.js';

export function App() {
  const [records, setRecords] = useState<ProcessedRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected Record for Inspector Slide-over
  const [selectedRecord, setSelectedRecord] = useState<ProcessedRecord | null>(null);

  // Active Filter States
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedReviewState, setSelectedReviewState] = useState<string>('all');
  const [selectedTranscriptFilter, setSelectedTranscriptFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Panels
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  // Load Data on mount and filter changes
  useEffect(() => {
    loadData();
  }, [selectedPerson, selectedSourceType, selectedRoute, selectedReviewState, selectedTranscriptFilter, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recordsRes, metricsRes] = await Promise.all([
        fetchRecords({
          person: selectedPerson,
          source_type: selectedSourceType,
          route: selectedRoute,
          review_state: selectedReviewState,
          has_transcript: selectedTranscriptFilter,
          search: searchQuery
        }),
        fetchMetrics()
      ]);

      setRecords(recordsRes.records);
      setMetrics(metricsRes);

      // Keep selected record updated if already open
      if (selectedRecord) {
        const updated = recordsRes.records.find(r => r.identity === selectedRecord.identity);
        if (updated) setSelectedRecord(updated);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedPerson('all');
    setSelectedSourceType('all');
    setSelectedRoute('all');
    setSelectedReviewState('all');
    setSelectedTranscriptFilter('all');
    setSearchQuery('');
  };

  const handleUpdateRoute = async (routes: RouteCategory[], reason?: string) => {
    if (!selectedRecord) return;
    const res = await updateRoute(selectedRecord.source_type, selectedRecord.source_id, routes, reason);
    setSelectedRecord(res.record);
    await loadData();
  };

  const handleResetRoute = async () => {
    if (!selectedRecord) return;
    const res = await resetRoute(selectedRecord.source_type, selectedRecord.source_id);
    setSelectedRecord(res.record);
    await loadData();
  };

  const handleUpdateReviewState = async (record: ProcessedRecord, state: ReviewState) => {
    const res = await updateReviewState(record.source_type, record.source_id, state);
    if (selectedRecord && selectedRecord.identity === record.identity) {
      setSelectedRecord(res.record);
    }
    await loadData();
  };

  const handleInspectRecordRef = (ref: string) => {
    const target = records.find(r => r.record_ref === ref);
    if (target) {
      setSelectedRecord(target);
    }
  };

  const m07Record = records.find(r => r.record_ref === 'M07');

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased">
      
      {/* Top Application Header */}
      <Header
        onOpenBrief={() => setIsBriefOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSyncDrawer={() => setIsSyncOpen(!isSyncOpen)}
        isSyncOpen={isSyncOpen}
        discrepanciesCount={metrics?.discrepancies_detected_count || 0}
      />

      {/* Sync & Replay Verification Bar */}
      <ReplayBar
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onRefreshData={loadData}
        totalRecords={metrics?.total_selected_records || 0}
        usableTranscripts={metrics?.usable_transcript_count || 0}
        manualCorrectionsCount={metrics?.manual_corrections_count || 0}
        m07Record={m07Record}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* Metric Cards Grid */}
        {metrics && (
          <MetricCards
            metrics={metrics}
            onFilterByTranscript={(val) => setSelectedTranscriptFilter(val)}
            onFilterByReview={(val) => setSelectedReviewState(val)}
            onFilterBySource={(val) => setSelectedSourceType(val)}
          />
        )}

        {/* Filter & Search Toolbar */}
        {metrics && (
          <FilterToolbar
            metrics={metrics}
            selectedPerson={selectedPerson}
            onSelectPerson={setSelectedPerson}
            selectedSourceType={selectedSourceType}
            onSelectSourceType={setSelectedSourceType}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            selectedReviewState={selectedReviewState}
            onSelectReviewState={setSelectedReviewState}
            selectedTranscriptFilter={selectedTranscriptFilter}
            onSelectTranscriptFilter={setSelectedTranscriptFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Triage Inbox Table */}
        <TriageInbox
          records={records}
          selectedRecordId={selectedRecord ? selectedRecord.identity : null}
          onSelectRecord={(rec) => setSelectedRecord(rec)}
          onUpdateReviewState={(rec, st) => handleUpdateReviewState(rec, st)}
        />

      </main>

      {/* Slide-over Evidence Inspector */}
      {selectedRecord && (
        <EvidenceInspector
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdateRoute={handleUpdateRoute}
          onResetRoute={handleResetRoute}
          onUpdateReviewState={(st) => handleUpdateReviewState(selectedRecord, st)}
        />
      )}

      {/* Modals */}
      <ManagerBriefModal
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
        onInspectRecordRef={handleInspectRecordRef}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

    </div>
  );
}

export default App;
