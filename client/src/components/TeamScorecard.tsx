import React from 'react';
import { Users, PhoneCall, Calendar, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { DashboardMetrics } from '../types/index.js';

interface TeamScorecardProps {
  metrics: DashboardMetrics;
  onSelectPersonFilter: (person: string) => void;
}

export const TeamScorecard: React.FC<TeamScorecardProps> = ({
  metrics,
  onSelectPersonFilter
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-2xl p-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-sky-400" />
            <span>Team Activity &amp; Coaching Scorecard</span>
          </h2>
          <p className="text-xs text-dark-300 mt-1">
            Performance metrics, conversational dialogue ratios, and targeted coaching focus for August 21, 2026.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-dark-900 border border-white/[0.08] text-dark-300">
            Active Reps: <strong className="text-white">5</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-dark-900 border border-white/[0.08] text-dark-300">
            Meeting Hosts: <strong className="text-white">{metrics.activity_by_person.meeting_organizers.length}</strong>
          </div>
        </div>
      </div>

      {/* Call Reps Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2 font-mono">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Outbound Call Representatives</span>
          </h3>
          <span className="text-xs text-dark-400">30 Total Dials Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.activity_by_person.call_reps.map((rep) => {
            const hasAttributionIssue = rep.name === 'Meera';
            const connectRate = rep.total_calls > 0 ? Math.round((rep.connected_calls / rep.total_calls) * 100) : 0;

            return (
              <div
                key={rep.name}
                className="glass-card rounded-2xl p-5 space-y-4 hover:border-white/[0.14] transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center font-bold text-sky-400 text-sm">
                      {rep.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {rep.name}
                      </h4>
                      <p className="text-xs text-dark-400 font-mono">
                        {rep.email || 'telephony-seat'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectPersonFilter(rep.name)}
                    className="p-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-dark-300 hover:text-white transition flex items-center gap-1 text-xs"
                    title={`View ${rep.name}'s activities`}
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Metric Gauges */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-dark-900 border border-white/[0.06] text-center">
                  <div>
                    <div className="text-base font-bold text-white font-mono">{rep.total_calls}</div>
                    <div className="text-[10px] text-dark-400 uppercase font-semibold">Dials</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-emerald-400 font-mono">{rep.connected_calls}</div>
                    <div className="text-[10px] text-dark-400 uppercase font-semibold">Connects</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-sky-400 font-mono">{rep.usable_transcripts}</div>
                    <div className="text-[10px] text-dark-400 uppercase font-semibold">Speech</div>
                  </div>
                </div>

                {/* Coaching Guidance Note */}
                <div className="text-xs text-dark-300 leading-relaxed pt-1 border-t border-white/[0.04]">
                  {rep.name === 'Arun' && (
                    <p>High call volume (15 dials). Focus coaching on pre-call qualification of prospect automation maturity before outreach (C01), and structured voicemail delivery (C04).</p>
                  )}
                  {rep.name === 'Leela' && (
                    <p>8 dials with automated screening drops (B02, B05, B06, B08, B11, B14, B16, B20). Verify lead list freshness and telephony carrier routing with data ops.</p>
                  )}
                  {rep.name === 'Meera' && (
                    <p className="text-amber-300/90">
                      StoreHarbor competitive presentation follow-up (C05). Referral governance: forbid name-dropping on C09. C10 contact departed Meadowbrick. (Note: C06 voice was Ravi).
                    </p>
                  )}
                  {rep.name === 'Kiran' && (
                    <p>Strong technical API discovery on C03 (Milan webhooks). Follow up on agreed developer documentation schedule.</p>
                  )}
                  {rep.name === 'Dev' && (
                    <p>Strategic channel partner dialogue with Willowbank Advisory (C07) for corporate virtual account referrals.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meeting Organizers Section */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled Meeting Organizers</span>
          </h3>
          <span className="text-xs text-dark-400">14 Total Calendar Invites</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.activity_by_person.meeting_organizers.map((org) => (
            <div
              key={org.email}
              onClick={() => onSelectPersonFilter(org.email)}
              className="glass-card rounded-xl p-4 cursor-pointer hover:border-white/[0.14] transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white truncate max-w-[140px]" title={org.email}>
                  {org.email.replace('@example.com', '')}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {org.total_meetings} mtg
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-dark-400">
                <span>Recorded: <strong className="text-dark-200">{org.recorded_meetings}</strong></span>
                <span>Turns: <strong className="text-emerald-400">{org.usable_transcripts}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
