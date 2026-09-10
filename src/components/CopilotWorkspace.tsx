import React, { useState, useEffect } from 'react';
import { CalendarEntry } from '../types.ts';
import { ThumbnailPreview } from './ThumbnailPreview.tsx';
import { SpeakerNotesTimeline } from './SpeakerNotesTimeline.tsx';
import { GammaSlideEmbed } from './GammaSlideEmbed.tsx';
import { MetaRemixStudio } from './MetaRemixStudio.tsx';
import {
  Sparkles,
  Tv,
  FileText,
  Copy,
  Check,
  Download,
  RefreshCw,
  Send,
  Layers,
  Cpu,
  Database,
  Share2,
  Presentation,
  Terminal,
  ArrowRight,
  HelpCircle,
  Clock,
  Compass,
  CheckCircle2,
  Mic,
  Video,
  ExternalLink
} from 'lucide-react';
import Markdown from 'react-markdown';

interface CopilotWorkspaceProps {
  currentEntry: CalendarEntry;
  onSelectDay: (id: number) => void;
  onOpenTeleprompter: (script: string) => void;
}

type OutputTab =
  | 'pack'
  | 'meta'
  | 'notes'
  | 'gamma'
  | 'script'
  | 'slides'
  | 'demo'
  | 'thumbnail'
  | 'description'
  | 'repurpose';

export const CopilotWorkspace: React.FC<CopilotWorkspaceProps> = ({
  currentEntry,
  onSelectDay,
  onOpenTeleprompter
}) => {
  const [activeOutputTab, setActiveOutputTab] = useState<OutputTab>('pack');
  const [contentCache, setContentCache] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userCustomPrompt, setUserCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  // Fetch or generate content for current entry and tab
  const fetchContent = async (command: string, tabKey: OutputTab) => {
    if (tabKey === 'meta' || tabKey === 'notes' || tabKey === 'gamma') return; // Handled by dedicated components

    setIsLoading(true);
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          dayId: currentEntry.id
        })
      });
      const data = await res.json();
      setContentCache((prev) => ({
        ...prev,
        [`${currentEntry.id}_${tabKey}`]: data.content
      }));
    } catch (err) {
      console.error('Error fetching copilot content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch Session Pack when currentEntry changes if not cached
  useEffect(() => {
    if (activeOutputTab === 'meta' || activeOutputTab === 'notes' || activeOutputTab === 'gamma') return;

    const cacheKey = `${currentEntry.id}_${activeOutputTab}`;
    if (!contentCache[cacheKey]) {
      const commandMap: Record<string, string> = {
        pack: 'SESSION_PACK',
        script: 'SCRIPT',
        slides: 'SLIDES',
        demo: 'DEMO',
        thumbnail: 'THUMBNAIL',
        description: 'DESCRIPTION',
        repurpose: 'REPURPOSE'
      };
      const cmd = commandMap[activeOutputTab];
      if (cmd) {
        fetchContent(cmd, activeOutputTab);
      }
    }
  }, [currentEntry.id, activeOutputTab]);

  const currentContent = contentCache[`${currentEntry.id}_${activeOutputTab}`] || '';

  const handleCopy = () => {
    if (!currentContent) return;
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!currentContent) return;
    const blob = new Blob([currentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Day_${currentEntry.id}_${currentEntry.domain}_${activeOutputTab}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCustomPromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCustomPrompt.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'CUSTOM',
          dayId: currentEntry.id,
          userPrompt: userCustomPrompt
        })
      });
      const data = await res.json();
      setContentCache((prev) => ({
        ...prev,
        [`${currentEntry.id}_${activeOutputTab}`]: data.content
      }));
      setUserCustomPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 5 Quality Gate Questions
  const operatingQuestions = [
    { label: 'Business Problem', q: 'What real enterprise friction is being solved?' },
    { label: 'Business & Enterprise Architecture', q: 'What capabilities & target architecture enable this?' },
    { label: 'SAP Ecosystem Context', q: 'How do S/4HANA, BTP, and Clean Core anchor this?' },
    { label: 'AI & Agent Acceleration', q: 'Where do autonomous agents execute with human governance?' },
    { label: 'Measurable Next Steps', q: 'What can enterprise architects execute tomorrow morning?' }
  ];

  return (
    <div className="space-y-6">
      {/* Target Day Header Card - YouTube Studio Style */}
      <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-600/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-black text-white bg-red-600 px-2.5 py-1 rounded-md shadow-sm">
                DAY #{currentEntry.id} OF 365
              </span>
              <span className="text-xs font-semibold text-[#aaaaaa] bg-[#272727] px-2.5 py-1 rounded-md border border-[#333333]">
                {currentEntry.date} ({currentEntry.dayOfWeek})
              </span>
              <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-md">
                {currentEntry.domain}
              </span>
              <span className="text-xs text-[#888888] bg-[#121212] px-2.5 py-1 rounded-md border border-[#272727]">
                Phase: {currentEntry.phase}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              {currentEntry.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#aaaaaa] mt-2 flex items-center gap-2 flex-wrap">
              <strong className="text-white font-medium">Strategic Angle:</strong> {currentEntry.angle}
              {currentEntry.gicsSector !== 'As applicable' && (
                <>
                  <span className="text-[#555555]">•</span>
                  <strong className="text-white font-medium">Industry Case:</strong> {currentEntry.gicsSector} Sector
                </>
              )}
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                const script = contentCache[`${currentEntry.id}_script`] || currentContent;
                onOpenTeleprompter(script);
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition whitespace-nowrap"
            >
              <Tv className="w-4 h-4" />
              <span>Launch Live Teleprompter</span>
            </button>
          </div>
        </div>

        {/* Master Commands Toolbar - YouTube Chip Styling */}
        <div className="mt-5 pt-4 border-t border-[#272727] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-wider mr-1 whitespace-nowrap">
            Studio Modes:
          </span>

          {[
            { id: 'pack', label: 'Live Session Pack', icon: Sparkles },
            { id: 'meta', label: 'Meta Suite Live Content Architect', icon: Share2, highlight: true },
            { id: 'notes', label: 'Minute-by-Minute Speaker Notes', icon: Clock, highlight: true },
            { id: 'gamma', label: 'Gamma AI PPT Deck', icon: Presentation, highlight: true },
            { id: 'script', label: 'Presenter Script', icon: Mic },
            { id: 'slides', label: 'Slide Deck Outline', icon: FileText },
            { id: 'demo', label: 'Architecture Demo', icon: Cpu },
            { id: 'thumbnail', label: 'Thumbnail Studio', icon: Video },
            { id: 'description', label: 'YouTube Description', icon: Share2 },
            { id: 'repurpose', label: '6-in-1 Repurpose', icon: Layers }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeOutputTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveOutputTab(item.id as OutputTab);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : item.highlight
                    ? 'bg-[#222222] text-red-400 hover:bg-[#2c2c2c] hover:text-white border border-red-900/40'
                    : 'bg-[#121212] text-[#aaaaaa] hover:bg-[#242424] hover:text-white border border-[#272727]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-red-400' : 'text-[#888888]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Rendering for Dedicated Full-Width Modes */}
      {activeOutputTab === 'meta' ? (
        <MetaRemixStudio
          currentEntry={currentEntry}
          onSelectDay={onSelectDay}
          onOpenTeleprompter={onOpenTeleprompter}
          hasApiKey={true}
        />
      ) : activeOutputTab === 'notes' ? (
        <SpeakerNotesTimeline
          entry={currentEntry}
          onOpenTeleprompter={onOpenTeleprompter}
        />
      ) : activeOutputTab === 'gamma' ? (
        <div className="space-y-6">
          <GammaSlideEmbed entry={currentEntry} />
        </div>
      ) : (
        /* Standard Studio Two-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Visual Assets & Architectural Context (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* YouTube Thumbnail Mockup */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube 16:9 Thumbnail Direction</span>
                </h3>
                <span className="text-[10px] text-red-400 font-semibold bg-red-950/50 px-2 py-0.5 rounded border border-red-800/40">
                  High-CTR Contrast
                </span>
              </div>

              <ThumbnailPreview entry={currentEntry} />

              <div className="text-[11px] text-[#aaaaaa] bg-[#121212] p-2.5 rounded-lg border border-[#272727] leading-relaxed">
                <strong className="text-white font-medium">Design Rule:</strong> 3-5 word high-contrast badge on deep slate. Big emotional authority trigger. No cluttered fonts.
              </div>
            </div>

            {/* Gamma AI Quick Card */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#272727] pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-red-500" />
                  <span>Gamma AI Presentation</span>
                </h3>
                <button
                  onClick={() => setActiveOutputTab('gamma')}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                >
                  <span>Open Full Embed</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-[#aaaaaa]">
                Interactive 10-slide deck tailored for <strong className="text-white">Day #{currentEntry.id}</strong>. Embed your live Gamma presentation or use the generated outline.
              </p>

              <button
                onClick={() => setActiveOutputTab('gamma')}
                className="w-full py-2 bg-[#222222] hover:bg-[#2a2a2a] text-xs font-bold text-white rounded-lg border border-[#333333] transition flex items-center justify-center gap-2"
              >
                <Presentation className="w-3.5 h-3.5 text-red-400" />
                <span>View & Embed Gamma AI Slides</span>
              </button>
            </div>

            {/* 5 Operating Questions (Quality Control Gate) */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#272727] pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5 Final Operating Questions</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Quality Gate
                </span>
              </div>
              <p className="text-xs text-[#aaaaaa]">
                Every SuccessLabs live stream must answer these 5 questions before going live:
              </p>

              <div className="space-y-2 text-xs">
                {operatingQuestions.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#121212] border border-[#272727]">
                    <div className="font-bold text-red-400 text-[11px]">
                      {idx + 1}. {item.label}
                    </div>
                    <div className="text-[#dddddd] text-xs mt-0.5">{item.q}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Run-of-Show Stages Tracker */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#272727] pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-red-500" />
                  <span>12-Stage Run of Show Cadence</span>
                </h3>
                <span className="text-[10px] text-[#aaaaaa] font-mono">60 Min Flow</span>
              </div>

              <div className="space-y-1 text-xs text-[#cccccc] max-h-52 overflow-y-auto pr-1">
                {[
                  '1. Hook (0-60s): High-stakes enterprise problem',
                  '2. Why This Matters Now (2026/2027 context)',
                  '3. Business Architecture: Capabilities & Value Streams',
                  '4. Enterprise Architecture: 5-layer target blueprint',
                  '5. SAP Architecture: Clean Core, S/4HANA & BTP',
                  '6. AI Architecture: Assistants to Autonomous Agents',
                  '7. Human + AI: Decision governance & oversight',
                  `8. Industry Case Study: ${currentEntry.gicsSector} sector`,
                  '9. Architect’s Takeaways (3 actionable items)',
                  '10. Audience Interaction & Live Chat Debate',
                  '11. Natural CTA: SuccessLabs Academy invitation',
                  '12. Next Video Bridge: Tomorrow’s domain transition'
                ].map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-1 border-b border-[#272727] text-[11px]">
                    <span className="w-4 h-4 rounded-full bg-[#272727] text-red-400 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="line-clamp-1">{stage.split(': ')[1] || stage}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveOutputTab('notes')}
                className="w-full py-1.5 bg-[#121212] hover:bg-[#222222] text-xs font-semibold text-red-400 rounded-lg border border-[#272727] transition flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>View Full Minute-by-Minute Notes</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Production Output & Command Terminal (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 flex-1 flex flex-col shadow-xl min-h-[580px]">
              {/* Action Bar */}
              <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {activeOutputTab.toUpperCase().replace('_', ' ')}
                  </h3>
                  {isLoading && (
                    <span className="text-[11px] text-red-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Architecting...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 bg-[#272727] hover:bg-[#333333] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 bg-[#272727] hover:bg-[#333333] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export .md</span>
                  </button>

                  <button
                    onClick={() => {
                      const commandMap: Record<string, string> = {
                        pack: 'SESSION_PACK',
                        script: 'SCRIPT',
                        slides: 'SLIDES',
                        demo: 'DEMO',
                        thumbnail: 'THUMBNAIL',
                        description: 'DESCRIPTION',
                        repurpose: 'REPURPOSE'
                      };
                      const cmd = commandMap[activeOutputTab];
                      if (cmd) {
                        fetchContent(cmd, activeOutputTab);
                      }
                    }}
                    disabled={isLoading}
                    className="p-1.5 bg-[#272727] hover:bg-[#333333] text-[#aaaaaa] hover:text-white rounded-lg text-xs font-bold transition disabled:opacity-40"
                    title="Regenerate"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Rendered Output */}
              <div className="flex-1 overflow-y-auto pr-1 text-[#e0e0e0] prose prose-invert prose-sm max-w-none">
                {currentContent ? (
                  <Markdown>{currentContent}</Markdown>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-[#717171]">
                    <RefreshCw className="w-8 h-8 animate-spin text-red-500 mb-3" />
                    <p className="text-xs">Preparing {activeOutputTab} for Day #{currentEntry.id}...</p>
                  </div>
                )}
              </div>

              {/* Interactive Custom Prompt Input */}
              <form onSubmit={handleCustomPromptSubmit} className="mt-4 pt-3 border-t border-[#272727]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask the SuccessLabs Architect (e.g. 'Add a Clean Core decision tree', 'Refine hook for CFOs')..."
                    value={userCustomPrompt}
                    onChange={(e) => setUserCustomPrompt(e.target.value)}
                    className="flex-1 bg-[#101010] border border-[#333333] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#717171] focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !userCustomPrompt.trim()}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
