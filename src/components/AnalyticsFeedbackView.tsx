import React, { useState, useEffect } from 'react';
import { CalendarEntry, AnalyticsEntry } from '../types.ts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Clock,
  Eye,
  Users,
  Radio
} from 'lucide-react';
import Markdown from 'react-markdown';

interface AnalyticsFeedbackViewProps {
  currentEntry: CalendarEntry;
  onSelectDay: (id: number) => void;
  entries: CalendarEntry[];
}

export const AnalyticsFeedbackView: React.FC<AnalyticsFeedbackViewProps> = ({
  currentEntry,
  onSelectDay,
  entries
}) => {
  const [ctr, setCtr] = useState<number>(6.5);
  const [avgViewDuration, setAvgViewDuration] = useState<string>('12m 30s');
  const [avgPercentageViewed, setAvgPercentageViewed] = useState<number>(48);
  const [peakConcurrent, setPeakConcurrent] = useState<number>(145);
  const [returningViewersPct, setReturningViewersPct] = useState<number>(62);
  const [topQuestions, setTopQuestions] = useState<string>(
    'How do we enforce Clean Core when legacy ABAP code exists?\nCan Joule orchestrate across non-SAP systems?'
  );
  const [notes, setNotes] = useState<string>(
    'High engagement during the 3-tier EA diagram at minute 14. Chat requested more real-world failure patterns.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [savedRecords, setSavedRecords] = useState<any[]>([]);

  // Load saved records from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('successlabs_analytics_log');
      if (stored) {
        setSavedRecords(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'ANALYTICS_REVIEW',
          dayId: currentEntry.id,
          analyticsPayload: {
            ctr,
            avgViewDuration,
            avgPercentageViewed,
            peakConcurrent,
            returningViewersPct,
            topQuestions,
            notes
          }
        })
      });
      const data = await res.json();
      setAnalysisResult(data.content);

      // Save record locally
      const record = {
        dayId: currentEntry.id,
        title: currentEntry.title,
        date: currentEntry.date,
        ctr,
        avgViewDuration,
        avgPercentageViewed,
        timestamp: new Date().toISOString()
      };
      const updated = [record, ...savedRecords.filter((r) => r.dayId !== currentEntry.id)];
      setSavedRecords(updated);
      localStorage.setItem('successlabs_analytics_log', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - YouTube Studio Style */}
      <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black tracking-wider uppercase text-red-400">
                YOUTUBE LIVE RETENTION & FEEDBACK LOOP ENGINE
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Post-Live Analytics & Next-Day Architecture Tuning
            </h2>
            <p className="text-xs text-[#aaaaaa] mt-1">
              Input session metrics to receive algorithmic adjustments, thumbnail CTR suggestions, and content bridging for Niladri Bihari Nayak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#aaaaaa]">Select Episode:</span>
            <select
              value={currentEntry.id}
              onChange={(e) => onSelectDay(Number(e.target.value))}
              className="bg-[#101010] border border-[#333333] text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500"
            >
              {entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  Day #{entry.id} — {entry.title.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span>Session Metrics • Day #{currentEntry.id}</span>
              </h3>
              <span className="text-[11px] text-red-400 font-semibold px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40">
                {currentEntry.domain}
              </span>
            </div>

            {/* CTR & Retention Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] mb-1 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-red-400" /> Click-Through Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ctr}
                  onChange={(e) => setCtr(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Avg View Duration
                </label>
                <input
                  type="text"
                  value={avgViewDuration}
                  onChange={(e) => setAvgViewDuration(e.target.value)}
                  placeholder="e.g. 14m 20s"
                  className="w-full bg-[#101010] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Avg Percentage Viewed (%)
                </label>
                <input
                  type="number"
                  value={avgPercentageViewed}
                  onChange={(e) => setAvgPercentageViewed(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-red-400" /> Peak Concurrent
                </label>
                <input
                  type="number"
                  value={peakConcurrent}
                  onChange={(e) => setPeakConcurrent(Number(e.target.value))}
                  className="w-full bg-[#101010] border border-[#333333] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Audience Questions */}
            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-red-400" /> Top Audience Questions / Chat Signals
              </label>
              <textarea
                rows={3}
                value={topQuestions}
                onChange={(e) => setTopQuestions(e.target.value)}
                placeholder="Paste top questions asked in live chat..."
                className="w-full bg-[#101010] border border-[#333333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Presenter Notes */}
            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] mb-1">
                Session Pacing & Friction Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What felt rushed? Where did chat excitement spike?"
                className="w-full bg-[#101010] border border-[#333333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Architecture Tuning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Optimization & Tuning Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Analysis & Optimization Output (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 min-h-[560px] flex flex-col shadow-xl">
            <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Feedback Loop & Tomorrow's Adjustments
                </h3>
              </div>
              <span className="text-xs text-[#888888]">
                For Niladri Bihari Nayak
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 prose prose-invert prose-sm max-w-none text-[#dddddd]">
              {analysisResult ? (
                <Markdown>{analysisResult}</Markdown>
              ) : (
                <div className="space-y-4 py-8 text-center text-[#aaaaaa]">
                  <BarChart3 className="w-12 h-12 text-[#444444] mx-auto" />
                  <h4 className="text-base font-bold text-white">No Tuning Report Generated Yet</h4>
                  <p className="text-xs max-w-md mx-auto text-[#888888]">
                    Click <strong className="text-white">"Generate Optimization & Tuning Report"</strong> to calculate your Retention Score, Thumbnail CTR recommendation, and specific tomorrow-morning adjustments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
