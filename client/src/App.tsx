import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.js';
import { Sidebar, WorkspaceView } from './components/Sidebar.js';
import { ReplayBar } from './components/ReplayBar.js';
import { MetricCards } from './components/MetricCards.js';
import { FilterToolbar } from './components/FilterToolbar.js';
import { TriageInbox } from './components/TriageInbox.js';
import { TeamScorecard } from './components/TeamScorecard.js';
import { DiscrepancyRadar } from './components/DiscrepancyRadar.js';
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

  // Active Workspace Navigation View & Hover/Pin Sidebar Mode
  const [activeView, setActiveView] = useState<WorkspaceView>('inbox');
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

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

  // Global Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // 1. Ctrl + K or / to focus search
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !isInputFocused)) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        return;
      }

      // 2. Ctrl + B to toggle sidebar pin
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarPinned(prev => !prev);
        return;
      }

      // 3. Quick view switching via number keys when not typing
      if (!isInputFocused) {
        if (e.key === '1') {
          setActiveView('inbox');
        } else if (e.key === '2') {
          setActiveView('radar');
        } else if (e.key === '3') {
          setActiveView('team');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Filtered anomaly records for Discrepancy Radar
  const anomalyRecords = useMemo(() => {
    const anomalyRefs = ['C04', 'C06', 'C09', 'C10', 'M07'];
    return records.filter(r => anomalyRefs.includes(r.record_ref) || Boolean(r.analysis?.discrepancy));
  }, [records]);

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex font-sans selection:bg-emerald-500/20 selection:text-emerald-300 antialiased">
      
      {/* Executive Hover-Expandable & Collapsible Sidebar */}
      <Sidebar
        isPinned={isSidebarPinned}
        onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
        }}
        selectedRoute={selectedRoute}
        onSelectRoute={(route) => {
          setSelectedRoute(route);
          setActiveView('inbox');
        }}
        metrics={metrics}
        onOpenBrief={() => setIsBriefOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSyncDrawer={() => setIsSyncOpen(!isSyncOpen)}
        isSyncOpen={isSyncOpen}
        discrepanciesCount={metrics?.discrepancies_detected_count || 0}
      />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Application Header */}
        <Header
          onOpenBrief={() => setIsBriefOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenSyncDrawer={() => setIsSyncOpen(!isSyncOpen)}
          isSyncOpen={isSyncOpen}
          discrepanciesCount={metrics?.discrepancies_detected_count || 0}
          onToggleSidebar={() => setIsSidebarPinned(!isSidebarPinned)}
          isSidebarCollapsed={!isSidebarPinned}
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
          
          {/* Metric Cards Grid - Always accessible across all views with full stacking context */}
          {metrics && (
            <MetricCards
              metrics={metrics}
              onFilterByTranscript={(val) => {
                setSelectedTranscriptFilter(val);
                setActiveView('inbox');
              }}
              onFilterByReview={(val) => {
                setSelectedReviewState(val);
                setActiveView('inbox');
              }}
              onFilterBySource={(val) => {
                setSelectedSourceType(val);
                setActiveView('inbox');
              }}
            />
          )}

          {/* View 1: Team Scorecard */}
          {activeView === 'team' && metrics && (
            <TeamScorecard
              metrics={metrics}
              onSelectPersonFilter={(person) => {
                setSelectedPerson(person);
                setActiveView('inbox');
              }}
            />
          )}

          {/* View 2: Discrepancy Radar */}
          {activeView === 'radar' && (
            <div className="space-y-6">
              <DiscrepancyRadar
                records={records}
                onSelectRecord={(rec) => setSelectedRecord(rec)}
                onReturnToInbox={() => setActiveView('inbox')}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 font-mono">
                    Flagged Interactions ({anomalyRecords.length} records)
                  </h3>
                  <button
                    onClick={() => setActiveView('inbox')}
                    className="text-xs text-dark-400 hover:text-white transition"
                  >
                    View all {records.length} records
                  </button>
                </div>
                <TriageInbox
                  records={anomalyRecords}
                  selectedRecordId={selectedRecord ? selectedRecord.identity : null}
                  onSelectRecord={(rec) => setSelectedRecord(rec)}
                  onUpdateReviewState={(rec, st) => handleUpdateReviewState(rec, st)}
                />
              </div>
            </div>
          )}

          {/* View 3: Triage Inbox (Default) */}
          {activeView === 'inbox' && (
            <>
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

              <TriageInbox
                records={records}
                selectedRecordId={selectedRecord ? selectedRecord.identity : null}
                onSelectRecord={(rec) => setSelectedRecord(rec)}
                onUpdateReviewState={(rec, st) => handleUpdateReviewState(rec, st)}
              />
            </>
          )}

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

    </div>
  );
}

export default App;
