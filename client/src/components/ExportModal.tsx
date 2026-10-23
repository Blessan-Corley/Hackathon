import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FolderTree, 
  FileSpreadsheet, 
  RefreshCw, 
  FileText,
  CheckCircle2,
  Layers,
  ArrowDownToLine
} from 'lucide-react';
import { fetchManifest, generateExport, getDownloadZipUrl } from '../api/client.js';
import { ExportManifestEntry } from '../types/index.js';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [manifest, setManifest] = useState<ExportManifestEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadManifest();
    }
  }, [isOpen]);

  const loadManifest = async () => {
    setLoading(true);
    try {
      const data = await fetchManifest();
      setManifest(data);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setStatusMsg('Regenerating physical folder tree and manifests...');
    try {
      await generateExport();
      await loadManifest();
      setStatusMsg('Export regenerated successfully on disk.');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-dark-900 border border-white/[0.10] rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-dark-850/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Export Hub &amp; Manifest
              </h3>
              <p className="text-xs text-dark-400 mt-0.5">
                Organized multi-destination dossiers with machine-readable manifests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 border border-white/[0.08] text-xs font-medium text-dark-200 hover:text-white flex items-center gap-1.5 transition disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>

            <a
              href={getDownloadZipUrl()}
              download
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-sm"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Download ZIP</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Msg */}
        {statusMsg && (
          <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-dark-300 custom-scrollbar">
          
          {/* Architecture Overview */}
          <div className="p-4 rounded-xl bg-dark-850 border border-white/[0.08] flex items-start gap-3.5">
            <Layers className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-white text-xs tracking-tight">
                Multi-Destination Physical Separation
              </h4>
              <p className="text-xs text-dark-400 leading-relaxed">
                When a conversation serves multiple departments (e.g. M03 has both Deal Next Steps and Sales Coaching), individual markdown dossiers are emitted to both target directories. All paths in <code className="text-dark-200">manifest.json</code> and <code className="text-dark-200">manifest.csv</code> are relative to the export bundle root.
              </p>
            </div>
          </div>

          {/* Manifest Table */}
          <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-dark-850">
            <div className="p-3.5 bg-dark-800/60 border-b border-white/[0.08] flex items-center justify-between text-xs">
              <span className="font-semibold text-white tracking-tight">
                Manifest Records ({manifest.length})
              </span>
              <a
                href="/api/export/manifest.csv"
                download="manifest.csv"
                className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export manifest.csv</span>
              </a>
            </div>

            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-dark-900/50 text-[11px] font-semibold text-dark-400">
                    <th className="py-2.5 px-4">Ref</th>
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Revision</th>
                    <th className="py-2.5 px-4">Destination Routes</th>
                    <th className="py-2.5 px-4">Output File</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {manifest.map((entry) => (
                    <tr key={`${entry.source_type}:${entry.source_id}`} className="hover:bg-dark-800/40 transition">
                      <td className="py-2.5 px-4 font-mono font-semibold text-white">
                        {entry.record_ref}
                      </td>
                      <td className="py-2.5 px-4 text-dark-400 capitalize">
                        {entry.source_type}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-purple-300">
                        v{entry.applied_revision}
                      </td>
                      <td className="py-2.5 px-4 text-dark-300">
                        {entry.active_routes.map(r => r.replace('_', ' ')).join(', ')}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-dark-400 max-w-[240px] truncate" title={entry.output_paths.join('\n')}>
                        {entry.output_paths[0] || '—'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                          entry.review_state === 'reviewed' 
                            ? 'bg-emerald-500/15 text-emerald-400' 
                            : 'bg-dark-800 text-dark-400'
                        }`}>
                          {entry.review_state === 'reviewed' ? 'Reviewed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        {entry.is_manually_corrected ? (
                          <span className="text-amber-400 font-semibold text-xs">Yes</span>
                        ) : (
                          <span className="text-dark-500 text-xs">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-dark-850/60 flex items-center justify-between">
          <span className="text-xs text-dark-400">
            Physical directory: <code className="text-dark-300 font-mono">/exports</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-xs font-semibold text-white transition shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
