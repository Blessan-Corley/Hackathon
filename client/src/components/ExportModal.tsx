import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FolderTree, 
  FileSpreadsheet, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  ExternalLink,
  Layers
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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-obsidian-900 border border-obsidian-750 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-obsidian-800 bg-obsidian-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Exported Dossiers &amp; Manifest Hub
              </h3>
              <p className="text-xs text-obsidian-400 font-mono">
                Relative physical folder tree with machine-readable JSON &amp; CSV manifests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={loading}
              className="px-3 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs font-mono text-obsidian-200 flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Regenerate Files
            </button>

            <a
              href={getDownloadZipUrl()}
              download
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              Download ZIP Archive
            </a>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Msg */}
        {statusMsg && (
          <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-300 text-xs font-mono">
            {statusMsg}
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Architecture Explanation */}
          <div className="p-3.5 rounded-lg bg-obsidian-850 border border-obsidian-800 flex items-start gap-3">
            <FolderTree className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-[11px] uppercase tracking-wider font-mono">
                Multi-Destination Folder Architecture
              </h4>
              <p className="text-obsidian-300 leading-relaxed">
                When a conversation serves multiple purposes (e.g. <code>M03</code> has both Deal Next Steps and Sales Coaching), 
                independent dossiers are placed in both destination directories without losing contextual history. 
                All file paths in <code>manifest.json</code> and <code>manifest.csv</code> are relative to the export directory.
              </p>
            </div>
          </div>

          {/* Manifest Table */}
          <div className="border border-obsidian-800 rounded-lg overflow-hidden bg-obsidian-850">
            <div className="p-3 bg-obsidian-800/80 border-b border-obsidian-750 flex items-center justify-between font-mono text-[11px]">
              <span className="font-bold text-white uppercase tracking-wider">
                Active Manifest Records ({manifest.length})
              </span>
              <a
                href="/api/export/manifest.csv"
                download="manifest.csv"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download manifest.csv
              </a>
            </div>

            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-obsidian-750 bg-obsidian-900 text-[10px] font-mono uppercase tracking-wider text-obsidian-400">
                    <th className="py-2 px-3">Ref</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Rev</th>
                    <th className="py-2 px-3">Active Route(s)</th>
                    <th className="py-2 px-3">Relative Output Path(s)</th>
                    <th className="py-2 px-3">Review</th>
                    <th className="py-2 px-3">Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800 font-mono text-[11px]">
                  {manifest.map((entry) => (
                    <tr key={`${entry.source_type}:${entry.source_id}`} className="hover:bg-obsidian-800/40">
                      <td className="py-2 px-3 font-bold text-white">
                        {entry.record_ref}
                      </td>
                      <td className="py-2 px-3 text-obsidian-400">
                        {entry.source_type}
                      </td>
                      <td className="py-2 px-3 text-purple-300">
                        Rev {entry.applied_revision}
                      </td>
                      <td className="py-2 px-3 text-obsidian-200">
                        {entry.active_routes.join(', ')}
                      </td>
                      <td className="py-2 px-3 text-cyan-300 max-w-[280px] truncate" title={entry.output_paths.join('\n')}>
                        {entry.output_paths.join('; ')}
                      </td>
                      <td className="py-2 px-3">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          entry.review_state === 'reviewed' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                        }`}>
                          {entry.review_state}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        {entry.is_manually_corrected ? (
                          <span className="text-cyan-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-obsidian-500">No</span>
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
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-850 flex items-center justify-between">
          <span className="text-xs text-obsidian-400 font-mono">
            Exports generated in <code>/exports</code> folder
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-obsidian-800 hover:bg-obsidian-750 text-xs font-medium text-white transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
