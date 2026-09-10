import React, { useState, useMemo } from 'react';
import { CalendarEntry, MetaDayPack } from '../types.ts';
import { generateMetaDayPack } from '../data/metaRemixEngine.ts';
import {
  Sparkles,
  Instagram,
  Facebook,
  MessageCircle,
  AtSign,
  Copy,
  Check,
  Download,
  Share2,
  Tv,
  Smartphone,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  Repeat,
  Send,
  Bookmark,
  Volume2,
  HelpCircle,
  BarChart2,
  Layers,
  Flame,
  CheckCircle2,
  ArrowRight,
  Clock,
  Radio,
  FileText,
  Palette,
  Layout,
  Type,
  Grid,
  Sliders,
  Wand2,
  ExternalLink,
  Code
} from 'lucide-react';
import Markdown from 'react-markdown';

interface MetaRemixStudioProps {
  currentEntry: CalendarEntry;
  onSelectDay: (id: number) => void;
  onOpenTeleprompter: (script: string) => void;
  hasApiKey: boolean;
}

type MetaPlatform = 'facebook' | 'instagram' | 'whatsapp' | 'threads' | 'moodboard' | 'overview';
type InstagramSubTab = 'reel' | 'carousel' | 'stories' | 'feed';
type FacebookSubTab = 'post' | 'reel' | 'group' | 'story' | 'event';
type WhatsAppSubTab = 'broadcast' | 'voice_note' | 'poll' | 'cheatsheet';
type ThreadsSubTab = 'cascade' | 'contrarian' | 'debate';

export const MetaRemixStudio: React.FC<MetaRemixStudioProps> = ({
  currentEntry,
  onSelectDay,
  onOpenTeleprompter,
  hasApiKey
}) => {
  const [activePlatform, setActivePlatform] = useState<MetaPlatform>('facebook');
  const [igTab, setIgTab] = useState<InstagramSubTab>('reel');
  const [fbTab, setFbTab] = useState<FacebookSubTab>('post');
  const [waTab, setWaTab] = useState<WhatsAppSubTab>('broadcast');
  const [threadsTab, setThreadsTab] = useState<ThreadsSubTab>('cascade');

  // Active theme index for Mood Board Studio
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  // Interactive Carousel slide index (0 to 9)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Interactive Story frame index (0 to 3)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Interactive Story Quiz selected answer
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // WhatsApp Poll selected option
  const [pollVoted, setPollVoted] = useState<number | null>(null);

  // Voice note audio simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI custom prompt state
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiCustomOutput, setAiCustomOutput] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // AI Mood Board Generator state
  const [customMoodPrompt, setCustomMoodPrompt] = useState('');
  const [isGeneratingMoodBoard, setIsGeneratingMoodBoard] = useState(false);
  const [aiMoodBoardResult, setAiMoodBoardResult] = useState<string | null>(null);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate complete curated day pack for this day
  const metaPack = useMemo<MetaDayPack>(() => {
    return generateMetaDayPack(currentEntry);
  }, [currentEntry]);

  // Reset slide and story indices when day changes
  React.useEffect(() => {
    setCurrentSlideIndex(0);
    setCurrentStoryIndex(0);
    setQuizSelected(null);
    setPollVoted(null);
    setSelectedThemeIndex(0);
    setIsPlayingAudio(false);
    setAiCustomOutput(null);
    setAiMoodBoardResult(null);
  }, [currentEntry.id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateAiMoodBoard = async (promptOverride?: string) => {
    const promptToSend = promptOverride || customMoodPrompt;
    setIsGeneratingMoodBoard(true);
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayId: currentEntry.id,
          command: 'MOODBOARD',
          userPrompt: promptToSend
        })
      });
      const data = await res.json();
      if (data && data.content) {
        setAiMoodBoardResult(data.content);
      }
    } catch (err) {
      console.error('Mood board generation error:', err);
    } finally {
      setIsGeneratingMoodBoard(false);
    }
  };

  const handleDownloadFullPack = () => {
    const markdownContent = `# SUCCESSLABS ACADEMY — META SUITE LIVE CONTENT ARCHITECT
# DAY #${currentEntry.id}: ${currentEntry.title}
Date: ${currentEntry.date} (${currentEntry.dayOfWeek})
Domain: ${currentEntry.domain} | Sector: ${currentEntry.gicsSector}

==================================================
1. INSTAGRAM SUITE
==================================================
## REEL (9:16)
Duration: ${metaPack.instagram.reel.duration}
Audio Vibe: ${metaPack.instagram.reel.audioVibe}
3s Hook: ${metaPack.instagram.reel.hook3s}
Voiceover Script:
${metaPack.instagram.reel.voiceoverScript}

Caption:
${metaPack.instagram.reel.caption}

## 10-SLIDE CAROUSEL
${metaPack.instagram.carousel.slides.map(s => `Slide ${s.slideNum} [${s.tag}]: ${s.header}\n${s.bulletPoints.map(p => `  • ${p}`).join('\n')}\n(Visual: ${s.visualDiagramDescription})`).join('\n\n')}

==================================================
2. FACEBOOK SUITE
==================================================
## LONG-FORM AUTHORITY POST
${metaPack.facebook.longFormPost.hook}

${metaPack.facebook.longFormPost.body}

Takeaways:
${metaPack.facebook.longFormPost.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Discussion Question:
${metaPack.facebook.longFormPost.discussionQuestion}

## COMMUNITY GROUP PROMPT
${metaPack.facebook.groupDiscussion.promptTitle}
${metaPack.facebook.groupDiscussion.coreDebate}

==================================================
3. WHATSAPP BROADCAST SUITE
==================================================
## DAILY BRIEF (WHATSAPP FORMATTED)
${metaPack.whatsapp.broadcastBrief.formattedBody}

## 60-SECOND VOICE NOTE SCRIPT
${metaPack.whatsapp.voiceNoteScript.script}

## INTERACTIVE POLL
${metaPack.whatsapp.interactivePoll.question}
${metaPack.whatsapp.interactivePoll.options.join('\n')}

==================================================
4. THREADS SUITE
==================================================
## 7-POST VIRAL CASCADE
${metaPack.threads.viralThread.map(p => `Post ${p.postNumber}/7:\n${p.text}`).join('\n\n')}

## CONTRARIAN TAKE
${metaPack.threads.contrarianTake.text}

==================================================
5. AI VISUAL DESIGN THEMES & MOOD BOARD CONCEPTS
==================================================
${metaPack.visualThemes.map((vt, i) => `### Theme ${i + 1}: ${vt.themeName} (${vt.archetype})
Metaphor: ${vt.visualMetaphor}
Colors:
  • Background: ${vt.colorPalette.background}
  • Surface: ${vt.colorPalette.surface}
  • Primary Accent: ${vt.colorPalette.primaryAccent}
  • Secondary Accent: ${vt.colorPalette.secondaryAccent}
  • Text: ${vt.colorPalette.textPrimary}
  • Border: ${vt.colorPalette.border}
Typography: ${vt.typography.displayFont} / ${vt.typography.bodyFont} / ${vt.typography.codeFont}
Geometry: ${vt.geometryAndGrid.cardRadius} | ${vt.geometryAndGrid.gridPattern}
AI Prompt: ${vt.aiImagePrompt}
`).join('\n\n')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SuccessLabs_Day_${currentEntry.id}_Meta_Suite.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAskGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/copilot/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'CUSTOM',
          dayId: currentEntry.id,
          userPrompt: `For Day #${currentEntry.id} ("${currentEntry.title}", domain: ${currentEntry.domain}), tailor the Meta Suite social remix according to this instruction: "${customPrompt}". Output platform-ready copy with emojis and hashtags.`
        })
      });
      const data = await res.json();
      setAiCustomOutput(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Day Master Meta Header Card */}
      <div className="bg-gradient-to-r from-[#181818] via-[#1a1824] to-[#181818] border border-[#2e2e2e] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-2.5 py-1 rounded-md shadow-sm">
                DAY #{currentEntry.id} OF 365
              </span>
              <span className="text-xs font-semibold text-[#aaaaaa] bg-[#272727] px-2.5 py-1 rounded-md border border-[#333333]">
                {currentEntry.date} ({currentEntry.dayOfWeek})
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-md">
                {currentEntry.domain}
              </span>
              <span className="text-xs text-[#888888] bg-[#121212] px-2.5 py-1 rounded-md border border-[#272727]">
                Sector: {currentEntry.gicsSector}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-pink-400 bg-pink-950/70 border border-pink-800/50 px-2.5 py-0.5 rounded inline-flex items-center gap-1.5">
                  <Share2 className="w-3 h-3 text-pink-400" />
                  Meta Suite Live Architect
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-[#222222] px-2 py-0.5 rounded border border-[#333333]">
                  FB • IG • WA • Threads
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                Meta Suite Live Architect
              </h1>
              <p className="text-sm font-semibold text-slate-300 mt-1">
                Day #{currentEntry.id}: {currentEntry.title}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#aaaaaa] flex items-center gap-2 flex-wrap">
              <strong className="text-white font-medium">Distribution Superpower:</strong>
              <span>Curated across 4 distinct Meta channels (Facebook, Instagram, WhatsApp, Threads) with domain-specific AI Visual Design Themes.</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => onOpenTeleprompter(metaPack.instagram.reel.voiceoverScript)}
              className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-600/30 transition whitespace-nowrap"
              title="Launch vertical teleprompter for filming Reels"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Reel Teleprompter</span>
            </button>

            <button
              onClick={() => setActivePlatform('moodboard')}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition whitespace-nowrap"
              title="Open AI Visual Design Themes & Mood Boards"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>AI Mood Boards</span>
            </button>

            <button
              onClick={handleDownloadFullPack}
              className="px-3.5 py-2 bg-[#222222] hover:bg-[#2c2c2c] border border-[#383838] text-xs font-bold text-slate-200 rounded-xl flex items-center gap-2 transition whitespace-nowrap"
              title="Download entire day's Meta Suite pack as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Day Pack</span>
            </button>
          </div>
        </div>

        {/* Primary Platform Selector Pills (FB, IG, WA, Threads in 4 distinct tabs + AI Themes + 24h Matrix) */}
        <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-[#aaaaaa] uppercase tracking-wider mr-1 whitespace-nowrap">
            Channels:
          </span>

          <button
            onClick={() => setActivePlatform('facebook')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'facebook'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#141414] text-blue-400 hover:bg-[#222] hover:text-blue-300 border border-blue-900/40'
            }`}
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook (FB)</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono">Post • Reel • Group</span>
          </button>

          <button
            onClick={() => setActivePlatform('instagram')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'instagram'
                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-md shadow-pink-500/25'
                : 'bg-[#141414] text-pink-400 hover:bg-[#222] hover:text-pink-300 border border-pink-900/40'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram (IG)</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono">Reel • Carousel • Story</span>
          </button>

          <button
            onClick={() => setActivePlatform('whatsapp')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[#141414] text-emerald-400 hover:bg-[#222] hover:text-emerald-300 border border-emerald-900/40'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp (WA)</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono">Brief • Voice Note • Poll</span>
          </button>

          <button
            onClick={() => setActivePlatform('threads')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'threads'
                ? 'bg-[#222] text-white border border-white/40 shadow-md'
                : 'bg-[#141414] text-[#cccccc] hover:bg-[#222] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            <AtSign className="w-4 h-4 text-slate-300" />
            <span>Threads</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono">7-Post Thread • Take</span>
          </button>

          <button
            onClick={() => setActivePlatform('moodboard')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'moodboard'
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white shadow-md shadow-amber-500/25'
                : 'bg-[#141414] text-amber-400 hover:bg-[#222] hover:text-amber-300 border border-amber-900/40'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>AI Visual Themes & Mood Boards</span>
            <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-mono">AI Visual Design</span>
          </button>

          <button
            onClick={() => setActivePlatform('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activePlatform === 'overview'
                ? 'bg-white text-black shadow-md shadow-white/20'
                : 'bg-[#141414] text-[#aaaaaa] hover:bg-[#222] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>24-Hour Rollout Matrix</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PLATFORM VIEW 1: MASTER OVERVIEW & 24-HOUR ROLLOUT SCHEDULE
      ========================================================================= */}
      {activePlatform === 'overview' && (
        <div className="space-y-6">
          {/* Daily Schedule Banner */}
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-[#272727] pb-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Daily Cross-Platform Publishing Matrix (Day #{currentEntry.id})</span>
                </h2>
                <p className="text-xs text-[#aaaaaa] mt-0.5">
                  Synchronized omnichannel distribution across WhatsApp, Instagram, Threads, and Facebook for 100% reach.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-lg">
                4-Tool Synergy Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {metaPack.dailyRolloutSchedule.map((slot, index) => {
                const isWA = slot.platform === 'WhatsApp';
                const isIG = slot.platform === 'Instagram';
                const isTH = slot.platform === 'Threads';
                const isFB = slot.platform === 'Facebook';

                const badgeBg = isWA
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                  : isIG
                  ? 'bg-pink-950 text-pink-300 border-pink-800/50'
                  : isTH
                  ? 'bg-purple-950 text-purple-300 border-purple-800/50'
                  : 'bg-blue-950 text-blue-300 border-blue-800/50';

                return (
                  <div
                    key={index}
                    className="bg-[#121212] border border-[#272727] rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-[#383838] transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono font-bold text-amber-400">{slot.time}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badgeBg}`}>
                          {slot.platform}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white leading-snug">{slot.format}</div>
                      <div className="text-[11px] text-[#888888] mt-1.5 leading-relaxed">{slot.objective}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (isWA) setActivePlatform('whatsapp');
                        else if (isIG) setActivePlatform('instagram');
                        else if (isTH) setActivePlatform('threads');
                        else setActivePlatform('facebook');
                      }}
                      className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-1 pt-2 border-t border-[#222222]"
                    >
                      <span>Open {slot.platform} Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 Tool Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instagram Card */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Instagram Suite</h3>
                      <p className="text-xs text-[#888888]">Reel (9:16) • 10-Slide Carousel • 4 Stories</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePlatform('instagram')}
                    className="px-2.5 py-1 text-xs font-bold text-pink-400 hover:text-white bg-pink-950/60 border border-pink-800/40 rounded-lg transition"
                  >
                    View Studio ➔
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-pink-400 block mb-1">Reel Hook (3s):</span>
                    <p className="text-slate-200 font-medium italic">{metaPack.instagram.reel.hook3s}</p>
                  </div>
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-pink-400 block mb-1">Carousel Concept:</span>
                    <p className="text-slate-300">10 slides mapping {metaPack.instagram.carousel.slides[1]?.header} to target architecture.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(metaPack.instagram.reel.voiceoverScript, 'ig_quick')}
                className="w-full py-2 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copiedKey === 'ig_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Reel Voiceover</span>
              </button>
            </div>

            {/* Facebook Card */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Facebook Suite</h3>
                      <p className="text-xs text-[#888888]">Executive Long-Form • Group Debate • Live</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePlatform('facebook')}
                    className="px-2.5 py-1 text-xs font-bold text-blue-400 hover:text-white bg-blue-950/60 border border-blue-800/40 rounded-lg transition"
                  >
                    View Studio ➔
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-blue-400 block mb-1">Long-Form Opening:</span>
                    <p className="text-slate-200 line-clamp-2">{metaPack.facebook.longFormPost.hook}</p>
                  </div>
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-blue-400 block mb-1">Group Debate Starter:</span>
                    <p className="text-slate-300 line-clamp-2">{metaPack.facebook.groupDiscussion.promptTitle}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(metaPack.facebook.longFormPost.body, 'fb_quick')}
                className="w-full py-2 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copiedKey === 'fb_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Facebook Post</span>
              </button>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">WhatsApp Broadcast Suite</h3>
                      <p className="text-xs text-[#888888]">Channel Brief • 60s Voice Memo • Native Poll</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePlatform('whatsapp')}
                    className="px-2.5 py-1 text-xs font-bold text-emerald-400 hover:text-white bg-emerald-950/60 border border-emerald-800/40 rounded-lg transition"
                  >
                    View Studio ➔
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Morning Broadcast Brief:</span>
                    <p className="text-slate-200 font-mono text-[11px] line-clamp-3 whitespace-pre-line">
                      {metaPack.whatsapp.broadcastBrief.formattedBody.slice(0, 160)}...
                    </p>
                  </div>
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Voice Memo Script:</span>
                    <p className="text-slate-300 italic">{metaPack.whatsapp.voiceNoteScript.duration} • "{metaPack.whatsapp.voiceNoteScript.toneGuide}"</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(metaPack.whatsapp.broadcastBrief.formattedBody, 'wa_quick')}
                className="w-full py-2 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copiedKey === 'wa_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy WhatsApp Markdown</span>
              </button>
            </div>

            {/* Threads Card */}
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-[#272727] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white/10 text-white border border-white/20">
                      <AtSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Threads Viral Suite</h3>
                      <p className="text-xs text-[#888888]">7-Post Viral Cascade • Contrarian Take</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActivePlatform('threads')}
                    className="px-2.5 py-1 text-xs font-bold text-white hover:text-white bg-[#282828] border border-[#3e3e3e] rounded-lg transition"
                  >
                    View Studio ➔
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Post 1 Hook (🧵 1/7):</span>
                    <p className="text-slate-200 font-medium">{metaPack.threads.viralThread[0]?.text}</p>
                  </div>
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#222222]">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Contrarian Hot Take:</span>
                    <p className="text-slate-300 italic">"{metaPack.threads.contrarianTake.text}"</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(metaPack.threads.viralThread.map(p => p.text).join('\n\n---\n\n'), 'th_quick')}
                className="w-full py-2 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copiedKey === 'th_quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Full 7-Post Thread</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PLATFORM VIEW 2: INSTAGRAM SUITE (Reel, Carousel, Stories, Feed)
      ========================================================================= */}
      {activePlatform === 'instagram' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-[#272727] pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'reel', label: 'Reel Blueprint (9:16 Video)' },
              { id: 'carousel', label: '10-Slide Interactive Carousel' },
              { id: 'stories', label: '4-Frame Interactive Stories' },
              { id: 'feed', label: 'Feed Post & Caption' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setIgTab(tab.id as InstagramSubTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  igTab === tab.id
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                    : 'bg-[#181818] text-[#888888] hover:text-white hover:bg-[#242424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* IG Tab 1: REEL (9:16) */}
          {igTab === 'reel' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Authentic 9:16 Phone Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[340px] bg-black border-4 border-[#282828] rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col h-[620px]">
                  {/* Phone Notch & Top Status */}
                  <div className="bg-black text-white px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-mono z-10">
                    <span>09:41</span>
                    <div className="w-16 h-3.5 bg-[#181818] rounded-full mx-auto" />
                    <span>5G 100%</span>
                  </div>

                  {/* Reel Video Area */}
                  <div className="flex-1 bg-gradient-to-b from-[#151525] via-[#0f0f18] to-black relative p-4 flex flex-col justify-between overflow-hidden">
                    {/* Visual Overlay Badge */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="bg-pink-600/90 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                        REELS 9:16
                      </span>
                      <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                        Day #{currentEntry.id}
                      </span>
                    </div>

                    {/* Kinetic Hook On-Screen */}
                    <div className="my-auto text-center space-y-3 px-2">
                      <div className="inline-block bg-black/80 border border-pink-500/40 px-3 py-1 rounded-lg text-pink-400 font-black text-xs uppercase tracking-wider animate-pulse">
                        {metaPack.instagram.reel.visualShots[0]?.onScreenText}
                      </div>
                      <h3 className="text-lg font-black text-white leading-tight drop-shadow-md">
                        {metaPack.instagram.reel.hook3s}
                      </h3>
                      <div className="text-[11px] text-amber-300 font-semibold bg-amber-950/60 border border-amber-600/30 px-2 py-1 rounded-md">
                        Audio: {metaPack.instagram.reel.audioVibe}
                      </div>
                    </div>

                    {/* Right-Side Instagram Action Icons */}
                    <div className="absolute right-3 bottom-24 flex flex-col items-center space-y-4 text-white">
                      <button className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm hover:text-pink-500 transition">
                          <Heart className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold">1.4k</span>
                      </button>
                      <button className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold">286</span>
                      </button>
                      <button className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                          <Send className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold">512</span>
                      </button>
                      <button className="flex flex-col items-center gap-1">
                        <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm">
                          <Bookmark className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-bold">890</span>
                      </button>
                    </div>

                    {/* Bottom Author & Audio Info */}
                    <div className="space-y-2 pr-12 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-[10px] font-black text-white">
                          SL
                        </div>
                        <span className="text-xs font-bold text-white">successlabs.academy</span>
                        <span className="text-[10px] text-pink-400 font-semibold">• Follow</span>
                      </div>
                      <p className="text-[10px] text-slate-200 line-clamp-2">
                        {currentEntry.title} — Comment "{metaPack.instagram.reel.manyChatKeyword}" to get the full architecture blueprint!
                      </p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                        <Volume2 className="w-3 h-3 text-pink-400" />
                        <span>Original Audio • SuccessLabs Masterclass</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Shot-by-Shot Production Blueprint */}
              <div className="lg:col-span-7 space-y-4">
                {/* Visual Shot List */}
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#272727] pb-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-pink-500" />
                      <span>4-Part Reel Production Shot List</span>
                    </h3>
                    <span className="text-[10px] font-bold text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800/40">
                      Duration: {metaPack.instagram.reel.duration}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {metaPack.instagram.reel.visualShots.map((shot, idx) => (
                      <div key={idx} className="bg-[#121212] border border-[#222222] rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-pink-400">{shot.time}</span>
                          <span className="text-[10px] font-bold bg-[#1e1e1e] text-slate-300 px-2 py-0.5 rounded">
                            On Screen: {shot.onScreenText}
                          </span>
                        </div>
                        <div className="text-xs text-white font-medium">
                          <strong className="text-slate-400">Visual:</strong> {shot.visual}
                        </div>
                        <div className="text-xs text-amber-300 italic">
                          <strong className="text-slate-400 not-italic">Spoken:</strong> {shot.spokenWord}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teleprompter Script */}
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Tv className="w-4 h-4 text-pink-500" />
                      <span>Full Voiceover Script (Word-for-Word)</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenTeleprompter(metaPack.instagram.reel.voiceoverScript)}
                        className="px-2.5 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Tv className="w-3 h-3" />
                        <span>Open Teleprompter</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(metaPack.instagram.reel.voiceoverScript, 'ig_script')}
                        className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                      >
                        {copiedKey === 'ig_script' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                    {metaPack.instagram.reel.voiceoverScript}
                  </div>
                </div>

                {/* Caption with ManyChat Trigger */}
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Instagram Caption (With ManyChat Keyword Trigger)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(metaPack.instagram.reel.caption, 'ig_caption')}
                      className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'ig_caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Caption</span>
                    </button>
                  </div>
                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-3.5 text-xs text-slate-300 whitespace-pre-line">
                    {metaPack.instagram.reel.caption}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IG Tab 2: 10-SLIDE CAROUSEL */}
          {igTab === 'carousel' && (
            <div className="space-y-6">
              {/* Carousel Flipper Card */}
              <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#272727] pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-pink-500" />
                      <span>10-Slide Instagram Carousel Blueprint (4:5 / 1:1 Format)</span>
                    </h3>
                    <p className="text-xs text-[#888888]">
                      Slide {currentSlideIndex + 1} of 10 • Designed for high bookmark and save rate.
                    </p>
                  </div>

                  {/* Slide Stepper Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                      disabled={currentSlideIndex === 0}
                      className="p-2 bg-[#222222] hover:bg-[#2e2e2e] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-3 py-1 bg-[#121212] rounded-lg border border-[#2e2e2e]">
                      {currentSlideIndex + 1} / 10
                    </span>
                    <button
                      onClick={() => setCurrentSlideIndex(Math.min(9, currentSlideIndex + 1))}
                      disabled={currentSlideIndex === 9}
                      className="p-2 bg-[#222222] hover:bg-[#2e2e2e] disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Visual Slide Card Preview */}
                {(() => {
                  const slide = metaPack.instagram.carousel.slides[currentSlideIndex];
                  return (
                    <div className="max-w-xl mx-auto aspect-[4/5] bg-gradient-to-br from-[#0c0f1d] via-[#111827] to-[#0a0d18] border-2 border-indigo-900/50 rounded-2xl p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />

                      {/* Slide Top Header */}
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-400 bg-pink-950/70 border border-pink-700/50 px-2.5 py-1 rounded-md">
                          {slide.tag} • SLIDE {slide.slideNum}/10
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          SuccessLabs Academy
                        </span>
                      </div>

                      {/* Slide Content */}
                      <div className="space-y-4 my-auto z-10">
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                          {slide.header}
                        </h2>

                        <div className="space-y-2.5 pt-2">
                          {slide.bulletPoints.map((pt, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                              <span className="text-pink-400 font-black">•</span>
                              <span className="leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>

                        {/* Graphic Blueprint Callout */}
                        <div className="mt-4 p-3 bg-black/50 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
                          <strong className="text-white block text-[10px] uppercase font-bold tracking-wider mb-1">
                            Diagram Blueprint on Slide:
                          </strong>
                          {slide.visualDiagramDescription}
                        </div>
                      </div>

                      {/* Slide Bottom Footer */}
                      <div className="flex items-center justify-between text-[11px] text-[#777777] border-t border-slate-800/80 pt-3 z-10">
                        <span>Day #{currentEntry.id} • {currentEntry.domain}</span>
                        <span className="text-pink-400 font-bold">Swipe ➡️</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Slide Dots Indicator */}
                <div className="flex justify-center gap-1.5 pt-2">
                  {metaPack.instagram.carousel.slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlideIndex === idx ? 'w-8 bg-pink-500' : 'w-2 bg-[#333333] hover:bg-[#555]'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* All 10 Slides List View */}
              <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Full 10-Slide Text & Graphic Specification
                  </h4>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        metaPack.instagram.carousel.slides
                          .map(
                            (s) =>
                              `SLIDE ${s.slideNum} [${s.tag}]: ${s.header}\n${s.bulletPoints.map((p) => `• ${p}`).join('\n')}\nDiagram: ${s.visualDiagramDescription}`
                          )
                          .join('\n\n---\n\n'),
                        'ig_all_slides'
                      )
                    }
                    className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'ig_all_slides' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy All 10 Slides</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {metaPack.instagram.carousel.slides.map((s) => (
                    <div
                      key={s.slideNum}
                      onClick={() => setCurrentSlideIndex(s.slideNum - 1)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        currentSlideIndex === s.slideNum - 1
                          ? 'bg-pink-950/30 border-pink-600/60'
                          : 'bg-[#121212] border-[#222222] hover:border-[#383838]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-pink-400">Slide {s.slideNum} ({s.tag})</span>
                        <span className="text-[#666666]">Click to view</span>
                      </div>
                      <div className="text-white font-bold text-xs">{s.header}</div>
                      <div className="text-[#888888] text-[11px] mt-1 line-clamp-2">{s.visualDiagramDescription}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IG Tab 3: 4-FRAME INTERACTIVE STORIES */}
          {igTab === 'stories' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Story Frame Mockup */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[340px] bg-black border-4 border-[#282828] rounded-[36px] overflow-hidden shadow-2xl relative flex flex-col h-[620px]">
                  {/* Top Story Progress Bars */}
                  <div className="px-3 pt-3 flex gap-1 z-20">
                    {[0, 1, 2, 3].map((frameIdx) => (
                      <button
                        key={frameIdx}
                        onClick={() => setCurrentStoryIndex(frameIdx)}
                        className="flex-1 h-1 rounded-full overflow-hidden bg-white/20"
                      >
                        <div
                          className={`h-full transition-all ${
                            frameIdx < currentStoryIndex
                              ? 'w-full bg-white'
                              : frameIdx === currentStoryIndex
                              ? 'w-full bg-pink-500'
                              : 'w-0'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Story Header */}
                  <div className="px-4 py-2 flex items-center justify-between z-20 text-white text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-[10px] font-black">
                        SL
                      </div>
                      <span className="font-bold">successlabs.academy</span>
                      <span className="text-[#888888] text-[10px]">2h</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-300">
                      Frame {currentStoryIndex + 1}/4
                    </span>
                  </div>

                  {/* Interactive Story Body */}
                  {(() => {
                    const story = metaPack.instagram.stories[currentStoryIndex];
                    return (
                      <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-b from-[#181528] via-[#0f0e1a] to-black text-white relative">
                        {/* Sticker Type Badge */}
                        <div className="text-center">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white shadow">
                            STICKER: {story.stickerType}
                          </span>
                        </div>

                        {/* Middle Interactive Widget */}
                        <div className="space-y-4 my-auto">
                          <h3 className="text-base font-black text-center text-white leading-tight">
                            {story.questionOrTitle}
                          </h3>

                          {/* Poll Sticker */}
                          {story.stickerType === 'poll' && story.options && (
                            <div className="space-y-2 bg-black/60 p-4 rounded-2xl border border-pink-500/30 backdrop-blur-md">
                              {story.options.map((opt, i) => (
                                <button
                                  key={i}
                                  onClick={() => setPollVoted(i)}
                                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center border transition ${
                                    pollVoted === i
                                      ? 'bg-pink-600 text-white border-pink-400'
                                      : 'bg-[#222222] text-slate-200 border-[#333333] hover:border-pink-500'
                                  }`}
                                >
                                  {opt} {pollVoted !== null && (i === 0 ? ' (68%)' : ' (32%)')}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Quiz Sticker */}
                          {story.stickerType === 'quiz' && story.options && (
                            <div className="space-y-2 bg-black/70 p-4 rounded-2xl border border-purple-500/40 backdrop-blur-md">
                              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block text-center">
                                Architecture IQ Quiz
                              </span>
                              {story.options.map((opt, i) => {
                                const isCorrect = i === story.correctAnswerIndex;
                                const isChosen = quizSelected === i;
                                let btnStyle = 'bg-[#1e1e24] text-slate-200 border-[#333333]';

                                if (quizSelected !== null) {
                                  if (isCorrect) btnStyle = 'bg-emerald-600 text-white border-emerald-400';
                                  else if (isChosen) btnStyle = 'bg-red-600 text-white border-red-400';
                                }

                                return (
                                  <button
                                    key={i}
                                    onClick={() => setQuizSelected(i)}
                                    className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold text-left border transition ${btnStyle}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}

                              {quizSelected !== null && story.explanation && (
                                <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/50 rounded-lg text-[10px] text-emerald-200 leading-relaxed">
                                  <strong>Why:</strong> {story.explanation}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Question / Link Sticker */}
                          {(story.stickerType === 'question' || story.stickerType === 'link') && (
                            <div className="p-4 bg-black/60 border border-amber-500/30 rounded-2xl text-center space-y-2">
                              <div className="text-xs font-bold text-amber-300">
                                {story.ctaText}
                              </div>
                              <div className="py-2 bg-white/10 rounded-xl text-[11px] text-slate-300 border border-white/20">
                                Send a message...
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Story Navigation */}
                        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/10">
                          <button
                            onClick={() => setCurrentStoryIndex(Math.max(0, currentStoryIndex - 1))}
                            disabled={currentStoryIndex === 0}
                            className="disabled:opacity-20"
                          >
                            ◀ Prev
                          </button>
                          <span className="text-[10px] font-semibold">{story.ctaText}</span>
                          <button
                            onClick={() => setCurrentStoryIndex(Math.min(3, currentStoryIndex + 1))}
                            disabled={currentStoryIndex === 3}
                            className="disabled:opacity-20"
                          >
                            Next ▶
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: 4-Frame Strategy Breakdown */}
              <div className="lg:col-span-7 space-y-3">
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    4-Frame Story Funnel Strategy
                  </h3>
                  <p className="text-xs text-[#aaaaaa]">
                    Stories build 24-hour hyper-engagement leading to direct message (DM) conversation and blueprint downloads.
                  </p>

                  <div className="space-y-3 pt-2">
                    {metaPack.instagram.stories.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentStoryIndex(idx)}
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          currentStoryIndex === idx
                            ? 'bg-pink-950/30 border-pink-600/60'
                            : 'bg-[#121212] border-[#222222] hover:border-[#383838]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-pink-400">Frame #{s.frameNum}: Sticker [{s.stickerType.toUpperCase()}]</span>
                          <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-slate-300">Click to preview</span>
                        </div>
                        <div className="text-xs font-semibold text-white">{s.questionOrTitle}</div>
                        <div className="text-[11px] text-[#888888] mt-1">CTA: {s.ctaText}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* IG Tab 4: FEED POST & QUOTE CARD */}
          {igTab === 'feed' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white">Instagram Single Feed Post & Quote Card</h3>
                <button
                  onClick={() => copyToClipboard(metaPack.instagram.feedPost.caption, 'ig_feed')}
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'ig_feed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Feed Post</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quote Card Mock */}
                <div className="aspect-square bg-gradient-to-br from-[#121829] to-[#0a0c16] border border-pink-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-pink-400">DAY #{currentEntry.id}</span>
                    <span className="text-xs text-slate-400">SuccessLabs Academy</span>
                  </div>

                  <blockquote className="text-base sm:text-lg font-black text-white italic leading-snug">
                    {metaPack.instagram.feedPost.quoteCardText}
                  </blockquote>

                  <div className="text-xs text-slate-400">
                    Niladri Bihari Nayak • Enterprise Architecture Strategist
                  </div>
                </div>

                {/* Caption Text */}
                <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[360px]">
                  {metaPack.instagram.feedPost.caption}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PLATFORM VIEW 3: FACEBOOK SUITE (Post, Reel, Group Debate, Live Event)
      ========================================================================= */}
      {activePlatform === 'facebook' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-[#272727] pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'post', label: 'Long-Form Authority Post' },
              { id: 'group', label: 'Community Group Debate' },
              { id: 'event', label: 'Facebook Live Event' },
              { id: 'reel', label: 'Facebook Reel Video' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFbTab(tab.id as FacebookSubTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  fbTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#181818] text-[#888888] hover:text-white hover:bg-[#242424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FB Tab 1: LONG-FORM POST */}
          {fbTab === 'post' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Authentic Facebook Feed Post Card */}
              <div className="lg:col-span-8 bg-[#181818] border border-[#272727] rounded-2xl p-6 shadow-xl space-y-4">
                {/* Author Bar */}
                <div className="flex items-center justify-between border-b border-[#272727] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow">
                      NN
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">Niladri Bihari Nayak</span>
                        <span className="text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded font-bold border border-blue-800/40">
                          Verified Architect
                        </span>
                      </div>
                      <div className="text-[11px] text-[#888888] flex items-center gap-1">
                        <span>SuccessLabs Academy</span>
                        <span>•</span>
                        <span>Published for {currentEntry.date}</span>
                        <span>•</span>
                        <span>🌐 Public</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(metaPack.facebook.longFormPost.hook + '\n\n' + metaPack.facebook.longFormPost.body, 'fb_post')}
                    className="px-3 py-1.5 bg-[#242424] hover:bg-[#303030] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'fb_post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Post</span>
                  </button>
                </div>

                {/* Post Content */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  <p className="font-bold text-white text-sm sm:text-base border-l-2 border-blue-500 pl-3">
                    {metaPack.facebook.longFormPost.hook}
                  </p>

                  <div className="whitespace-pre-line text-slate-300">
                    {metaPack.facebook.longFormPost.body}
                  </div>

                  {/* Strategic Takeaways Box */}
                  <div className="bg-[#121212] border border-[#272727] rounded-xl p-4 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
                      Key Takeaways for Enterprise Leaders:
                    </span>
                    {metaPack.facebook.longFormPost.keyTakeaways.map((t, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-blue-400 font-bold">{idx + 1}.</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 font-medium">
                    💬 <strong>Discussion:</strong> {metaPack.facebook.longFormPost.discussionQuestion}
                  </div>
                </div>

                {/* Facebook Reactions Bar */}
                <div className="border-t border-[#272727] pt-3 flex items-center justify-between text-xs text-[#888888]">
                  <div className="flex items-center gap-1.5">
                    <span className="flex -space-x-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">👍</span>
                      <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white">❤️</span>
                      <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">💡</span>
                    </span>
                    <span className="font-medium text-slate-400">412 reactions</span>
                  </div>
                  <div className="flex items-center gap-3 font-medium">
                    <span>94 comments</span>
                    <span>58 shares</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Facebook Audience Strategy */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    <span>Facebook Algorithm Optimization</span>
                  </h4>
                  <p className="text-xs text-[#aaaaaa] leading-relaxed">
                    Facebook favors long-form thought leadership posts that spark meaningful back-and-forth comments in the first 60 minutes.
                  </p>
                  <div className="bg-[#121212] p-3 rounded-xl border border-[#222222] text-xs text-slate-300 space-y-2">
                    <div>
                      <strong className="text-white block text-[11px]">Best Posting Window:</strong>
                      <span>03:30 PM - 05:00 PM local executive time</span>
                    </div>
                    <div>
                      <strong className="text-white block text-[11px]">Comment Strategy:</strong>
                      <span>Reply to the first 5 architect comments with an open follow-up question.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FB Tab 2: COMMUNITY GROUP DEBATE */}
          {fbTab === 'group' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4 max-w-3xl">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Facebook Group & Community Debate Starter</span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${metaPack.facebook.groupDiscussion.promptTitle}\n\n${metaPack.facebook.groupDiscussion.coreDebate}\n\nStarter Questions:\n${metaPack.facebook.groupDiscussion.starterQuestions.join('\n')}`,
                      'fb_group'
                    )
                  }
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'fb_group' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Group Prompt</span>
                </button>
              </div>

              <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 space-y-3">
                <h4 className="text-base font-bold text-white">{metaPack.facebook.groupDiscussion.promptTitle}</h4>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {metaPack.facebook.groupDiscussion.coreDebate}
                </div>

                <div className="pt-3 border-t border-[#222222] space-y-1.5">
                  <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                    Debate Seed Questions:
                  </span>
                  {metaPack.facebook.groupDiscussion.starterQuestions.map((q, idx) => (
                    <div key={idx} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FB Tab 3: LIVE EVENT */}
          {fbTab === 'event' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4 max-w-3xl">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-500" />
                  <span>Facebook Live Event Description & Agenda</span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${metaPack.facebook.eventAnnouncement.eventTitle}\nTime: ${metaPack.facebook.eventAnnouncement.liveTime}\n\nAgenda:\n${metaPack.facebook.eventAnnouncement.agenda.join('\n')}`,
                      'fb_event'
                    )
                  }
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'fb_event' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Event Copy</span>
                </button>
              </div>

              <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 space-y-3">
                <h4 className="text-base font-bold text-white">{metaPack.facebook.eventAnnouncement.eventTitle}</h4>
                <div className="text-xs text-amber-400 font-mono font-bold">
                  Schedule: {metaPack.facebook.eventAnnouncement.liveTime}
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Session Run of Show Agenda:
                  </span>
                  {metaPack.facebook.eventAnnouncement.agenda.map((ag, idx) => (
                    <div key={idx} className="text-xs text-slate-300 font-mono">
                      {ag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FB Tab 4: REEL VIDEO */}
          {fbTab === 'reel' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4 max-w-3xl">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white">Facebook Reels Script & Caption</h3>
                <button
                  onClick={() => copyToClipboard(metaPack.facebook.reel.script, 'fb_reel')}
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'fb_reel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Reel</span>
                </button>
              </div>

              <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                {metaPack.facebook.reel.script}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PLATFORM VIEW 4: WHATSAPP SUITE (Brief, Voice Note, Poll, Cheat-Sheet)
      ========================================================================= */}
      {activePlatform === 'whatsapp' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-[#272727] pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'broadcast', label: 'Broadcast Channel Daily Brief' },
              { id: 'voice_note', label: '60s Voice Memo Script' },
              { id: 'poll', label: 'Interactive Channel Poll' },
              { id: 'cheatsheet', label: 'Forwardable Cheat-Sheet Card' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWaTab(tab.id as WhatsAppSubTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  waTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-[#181818] text-[#888888] hover:text-white hover:bg-[#242424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Authentic WhatsApp Chat / Channel Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[380px] bg-[#0b141a] border-4 border-[#1f2c34] rounded-[36px] overflow-hidden shadow-2xl flex flex-col h-[620px]">
                {/* WhatsApp Channel Header */}
                <div className="bg-[#202c33] text-white px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white">
                      SL
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">SuccessLabs Academy</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      </div>
                      <span className="text-[10px] text-[#8696a0]">Verified Channel • 14.8k followers</span>
                    </div>
                  </div>
                  <Share2 className="w-4 h-4 text-[#8696a0]" />
                </div>

                {/* WhatsApp Chat Area */}
                <div className="flex-1 p-4 bg-[#0b141a] bg-opacity-95 overflow-y-auto space-y-4 text-xs">
                  {/* WhatsApp Broadcast Message Bubble */}
                  <div className="bg-[#005c4b] text-white p-4 rounded-2xl rounded-tl-none shadow-md space-y-2 border border-emerald-800/40">
                    <div className="font-bold text-[13px] border-b border-emerald-600/40 pb-1.5 flex items-center justify-between">
                      <span>{metaPack.whatsapp.broadcastBrief.headline}</span>
                    </div>

                    <div className="whitespace-pre-line text-[11px] leading-relaxed text-slate-100 font-sans">
                      {metaPack.whatsapp.broadcastBrief.formattedBody}
                    </div>

                    <div className="flex justify-end items-center gap-1 text-[9px] text-emerald-200/80 pt-1">
                      <span>08:00 AM</span>
                      <span>✓✓</span>
                    </div>
                  </div>

                  {/* Audio Voice Note Bubble Mockup */}
                  <div className="bg-[#202c33] text-white p-3.5 rounded-2xl rounded-tl-none shadow border border-[#2a3942] space-y-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition shadow"
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      {/* Fake Audio Waveform */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-0.5 h-6">
                          {[3, 6, 10, 14, 8, 12, 18, 9, 5, 12, 16, 14, 8, 10, 15, 6, 4, 11, 14, 7, 5].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h * 1.3}px` }}
                              className={`w-1 rounded-full transition-all ${
                                isPlayingAudio ? 'bg-emerald-400 animate-pulse' : 'bg-[#8696a0]'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-[#8696a0]">
                          <span>{isPlayingAudio ? '00:24' : '00:00'}</span>
                          <span>01:14</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#8696a0] italic">
                      Voice memo from Niladri Bihari Nayak (SuccessLabs)
                    </div>
                  </div>

                  {/* WhatsApp Interactive Poll Mockup */}
                  <div className="bg-[#202c33] text-white p-3.5 rounded-2xl rounded-tl-none shadow border border-[#2a3942] space-y-2.5">
                    <div className="text-xs font-bold text-slate-100 whitespace-pre-line">
                      {metaPack.whatsapp.interactivePoll.question}
                    </div>

                    <div className="space-y-1.5">
                      {metaPack.whatsapp.interactivePoll.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPollVoted(idx)}
                          className={`w-full text-left p-2 rounded-lg text-[11px] font-medium border flex items-center justify-between transition ${
                            pollVoted === idx
                              ? 'bg-emerald-950/80 border-emerald-500 text-white font-bold'
                              : 'bg-[#111b21] border-[#2a3942] text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="line-clamp-1">{opt}</span>
                          {pollVoted !== null && (
                            <span className="text-[10px] font-mono text-emerald-400 ml-2">
                              {idx === 0 ? '48%' : idx === 1 ? '26%' : idx === 2 ? '18%' : '8%'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="text-[9px] text-[#8696a0]">Tap to vote • Results shared tomorrow</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Copyable WhatsApp Artifacts */}
            <div className="lg:col-span-6 space-y-4">
              {/* WA Tab 1: Broadcast Brief */}
              {waTab === 'broadcast' && (
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      <span>WhatsApp Formatted Broadcast Markdown</span>
                    </h3>
                    <button
                      onClick={() => copyToClipboard(metaPack.whatsapp.broadcastBrief.formattedBody, 'wa_brief')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition shadow"
                    >
                      {copiedKey === 'wa_brief' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy for WhatsApp</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#888888]">
                    Formatted using native WhatsApp markdown: <code className="text-emerald-400">*bold*</code>, <code className="text-emerald-400">_italics_</code>, and clean emoji bullet points.
                  </p>

                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed overflow-y-auto max-h-[380px]">
                    {metaPack.whatsapp.broadcastBrief.formattedBody}
                  </div>
                </div>
              )}

              {/* WA Tab 2: Voice Note Script */}
              {waTab === 'voice_note' && (
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                        60-Second Voice Memo Teleprompter Script
                      </h3>
                      <p className="text-[11px] text-[#888888]">
                        Duration: {metaPack.whatsapp.voiceNoteScript.duration} • Tone: {metaPack.whatsapp.voiceNoteScript.toneGuide}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(metaPack.whatsapp.voiceNoteScript.script, 'wa_voice')}
                      className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'wa_voice' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Script</span>
                    </button>
                  </div>

                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                    {metaPack.whatsapp.voiceNoteScript.script}
                  </div>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
                    💡 <strong>Pro Tip:</strong> Record this voice note directly in your WhatsApp broadcast channel while holding the microphone button for higher engagement than text-only updates.
                  </div>
                </div>
              )}

              {/* WA Tab 3: Interactive Poll */}
              {waTab === 'poll' && (
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      WhatsApp Native Poll Setup
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${metaPack.whatsapp.interactivePoll.question}\n\nOptions:\n${metaPack.whatsapp.interactivePoll.options.join('\n')}`,
                          'wa_poll'
                        )
                      }
                      className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'wa_poll' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Poll</span>
                    </button>
                  </div>

                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 space-y-3">
                    <div className="text-xs font-bold text-white">
                      {metaPack.whatsapp.interactivePoll.question}
                    </div>
                    <div className="space-y-1.5">
                      {metaPack.whatsapp.interactivePoll.options.map((opt, i) => (
                        <div key={i} className="text-xs text-slate-300 bg-[#1a1a1a] p-2 rounded-lg border border-[#2a2a2a]">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-[#888888] italic">
                      {metaPack.whatsapp.interactivePoll.contextNote}
                    </div>
                  </div>
                </div>
              )}

              {/* WA Tab 4: Forwardable Cheat-Sheet */}
              {waTab === 'cheatsheet' && (
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      1-Page Executive Forwardable ASCII Card
                    </h3>
                    <button
                      onClick={() => copyToClipboard(metaPack.whatsapp.forwardableCheatSheet.formattedCard, 'wa_card')}
                      className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'wa_card' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Card</span>
                    </button>
                  </div>

                  <pre className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {metaPack.whatsapp.forwardableCheatSheet.formattedCard}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PLATFORM VIEW 5: THREADS SUITE (7-Post Cascade, Contrarian Take, Debate)
      ========================================================================= */}
      {activePlatform === 'threads' && (
        <div className="space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-[#272727] pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'cascade', label: '7-Post Viral Architecture Thread' },
              { id: 'contrarian', label: 'Contrarian One-Liner / Quote Take' },
              { id: 'debate', label: 'Architecture Debate Prompt' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setThreadsTab(tab.id as ThreadsSubTab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  threadsTab === tab.id
                    ? 'bg-white text-black shadow-md shadow-white/20'
                    : 'bg-[#181818] text-[#888888] hover:text-white hover:bg-[#242424]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Threads Tab 1: 7-POST VIRAL CASCADE */}
          {threadsTab === 'cascade' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Authentic Connected Threads Feed Mockup */}
              <div className="lg:col-span-7 bg-[#141414] border border-[#272727] rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                  <div className="flex items-center gap-2">
                    <AtSign className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold text-white">Threads Viral Unfurled Cascade</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        metaPack.threads.viralThread.map((p) => p.text).join('\n\n---\n\n'),
                        'th_all'
                      )
                    }
                    className="px-3 py-1.5 bg-[#222222] hover:bg-[#2e2e2e] text-xs font-bold text-white rounded-lg flex items-center gap-1.5 transition border border-[#383838]"
                  >
                    {copiedKey === 'th_all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Entire Thread</span>
                  </button>
                </div>

                {/* Chained Threads Posts */}
                <div className="space-y-6">
                  {metaPack.threads.viralThread.map((post, index) => {
                    const isLast = index === metaPack.threads.viralThread.length - 1;
                    return (
                      <div key={post.postNumber} className="relative flex gap-3">
                        {/* Thread Connecting Line */}
                        {!isLast && (
                          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-[#2a2a2a]" />
                        )}

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shrink-0 z-10">
                          NN
                        </div>

                        {/* Post Body */}
                        <div className="flex-1 bg-[#181818] border border-[#272727] rounded-xl p-4 space-y-2 hover:border-[#383838] transition">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">niladri.nayak.ea</span>
                              <span className="text-[11px] text-[#666666]">2h</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-[#888888]">
                                {post.characterCount}/500 chars
                              </span>
                              <button
                                onClick={() => copyToClipboard(post.text, `th_post_${post.postNumber}`)}
                                className="p-1 text-[#888888] hover:text-white rounded hover:bg-[#222]"
                                title="Copy single post"
                              >
                                {copiedKey === `th_post_${post.postNumber}` ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed">
                            {post.text}
                          </div>

                          {post.visualCue && (
                            <div className="text-[10px] text-amber-400/80 italic pt-1">
                              💡 {post.visualCue}
                            </div>
                          )}

                          {/* Threads Interaction Icons */}
                          <div className="flex items-center gap-4 text-[#888888] text-xs pt-2">
                            <button className="flex items-center gap-1 hover:text-white">
                              <Heart className="w-3.5 h-3.5" />
                              <span className="text-[10px]">124</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="text-[10px]">38</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white">
                              <Repeat className="w-3.5 h-3.5" />
                              <span className="text-[10px]">42</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-white">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Single Takes & Strategy */}
              <div className="lg:col-span-5 space-y-4">
                {/* Contrarian One-Liner */}
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Contrarian Hot Take (Sub-240 Chars)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(metaPack.threads.contrarianTake.text, 'th_take')}
                      className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'th_take' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <blockquote className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs sm:text-sm text-slate-100 font-semibold italic">
                    "{metaPack.threads.contrarianTake.text}"
                  </blockquote>
                  <div className="text-[11px] text-[#888888]">
                    Designed for quote-threads and viral algorithmic amplification in the tech architect community.
                  </div>
                </div>

                {/* Threads Debate */}
                <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      High-Reply Debate Prompt
                    </h4>
                    <button
                      onClick={() => copyToClipboard(metaPack.threads.communityDebate.question, 'th_debate')}
                      className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    >
                      {copiedKey === 'th_debate' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                    {metaPack.threads.communityDebate.question}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Threads Tab 2: CONTRARIAN TAKE */}
          {threadsTab === 'contrarian' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white">Contrarian Architect Hot Take</h3>
                <button
                  onClick={() => copyToClipboard(metaPack.threads.contrarianTake.text, 'th_take_2')}
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'th_take_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Take</span>
                </button>
              </div>
              <p className="text-base sm:text-lg font-bold text-white bg-[#121212] p-5 rounded-xl border border-[#222222]">
                "{metaPack.threads.contrarianTake.text}"
              </p>
            </div>
          )}

          {/* Threads Tab 3: DEBATE */}
          {threadsTab === 'debate' && (
            <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4 max-w-2xl">
              <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                <h3 className="text-sm font-bold text-white">Community Debate Starter</h3>
                <button
                  onClick={() => copyToClipboard(metaPack.threads.communityDebate.question, 'th_deb_2')}
                  className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'th_deb_2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Debate</span>
                </button>
              </div>
              <div className="text-sm text-slate-200 bg-[#121212] p-5 rounded-xl border border-[#222222] whitespace-pre-line leading-relaxed">
                {metaPack.threads.communityDebate.question}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          PLATFORM VIEW 5: AI VISUAL DESIGN THEMES & MOOD BOARDS
      ========================================================================= */}
      {activePlatform === 'moodboard' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#181818] via-[#201c2c] to-[#181818] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    AI Visual Design Themes & Mood Boards
                  </span>
                  <span className="text-xs text-[#aaaaaa] bg-[#121212] px-2.5 py-0.5 rounded-md border border-[#272727]">
                    Content Focus: {currentEntry.domain} • {currentEntry.gicsSector}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Domain-Aware Visual Systems & Mood Boards
                </h2>

                <p className="text-xs sm:text-sm text-[#aaaaaa] max-w-3xl">
                  AI-suggested design archetypes, harmonious color palettes, typography pairings, grid geometry, and ready-to-copy AI image generation prompts tailored specifically for <strong className="text-white">Day #{currentEntry.id}: {currentEntry.title}</strong>.
                </p>
              </div>

              <button
                onClick={() => {
                  const activeTheme = metaPack.visualThemes[selectedThemeIndex] || metaPack.visualThemes[0];
                  copyToClipboard(
                    `/* SuccessLabs Theme: ${activeTheme.themeName} (${activeTheme.archetype}) */
:root {
  --bg-color: ${activeTheme.colorPalette.background};
  --surface-color: ${activeTheme.colorPalette.surface};
  --primary-accent: ${activeTheme.colorPalette.primaryAccent};
  --secondary-accent: ${activeTheme.colorPalette.secondaryAccent};
  --text-primary: ${activeTheme.colorPalette.textPrimary};
  --text-secondary: ${activeTheme.colorPalette.textSecondary};
  --border-color: ${activeTheme.colorPalette.border};
  --font-display: "${activeTheme.typography.displayFont}", sans-serif;
  --font-body: "${activeTheme.typography.bodyFont}", sans-serif;
  --font-code: "${activeTheme.typography.codeFont}", monospace;
  --radius-card: ${activeTheme.geometryAndGrid.cardRadius};
}`,
                    'css_tokens_copy'
                  );
                }}
                className="px-4 py-2.5 bg-[#222] hover:bg-[#333] border border-[#3e3e3e] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap self-start lg:self-center"
              >
                {copiedKey === 'css_tokens_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5" />}
                <span>Export CSS Tokens</span>
              </button>
            </div>

            {/* Concept Selector Tabs */}
            <div className="mt-5 pt-4 border-t border-[#2e2e2e] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mr-1 whitespace-nowrap">
                Concepts:
              </span>

              {metaPack.visualThemes.map((theme, idx) => (
                <button
                  key={theme.id || idx}
                  onClick={() => setSelectedThemeIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${
                    selectedThemeIndex === idx
                      ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-md shadow-amber-500/25'
                      : 'bg-[#141414] text-[#aaaaaa] hover:bg-[#222] hover:text-white border border-[#2a2a2a]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colorPalette.primaryAccent }} />
                  <span>Concept #{idx + 1}: {theme.themeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Concept Showcase */}
          {(() => {
            const activeTheme = metaPack.visualThemes[selectedThemeIndex] || metaPack.visualThemes[0];
            return (
              <div className="space-y-6">
                {/* 1. Concept Header & Visual Metaphor Card */}
                <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#272727] pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/40 text-amber-300">
                          {activeTheme.archetype}
                        </span>
                        <span className="text-[10px] text-[#888] font-mono">
                          {activeTheme.colorPalette.name}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight">
                        {activeTheme.themeName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeTheme.recommendedForFormats.map((fmt, i) => (
                        <span key={i} className="text-[10px] bg-[#222] text-slate-300 px-2 py-1 rounded-md border border-[#333]">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Visual Metaphor explanation */}
                  <div className="bg-[#121212] border border-[#242424] rounded-xl p-4 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why This Fits Today's Content Focus ({currentEntry.domain})</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {activeTheme.visualMetaphor}
                    </p>
                  </div>
                </div>

                {/* 2. Color Palette & Typography Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Color Palette Swatches */}
                  <div className="lg:col-span-6 bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">Harmonious Color Palette</h4>
                      </div>
                      <button
                        onClick={() => {
                          const paletteText = `Background: ${activeTheme.colorPalette.background}\nSurface: ${activeTheme.colorPalette.surface}\nPrimary: ${activeTheme.colorPalette.primaryAccent}\nSecondary: ${activeTheme.colorPalette.secondaryAccent}\nText: ${activeTheme.colorPalette.textPrimary}\nBorder: ${activeTheme.colorPalette.border}`;
                          copyToClipboard(paletteText, 'palette_all_copy');
                        }}
                        className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
                      >
                        {copiedKey === 'palette_all_copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy All Hex</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Primary Accent', hex: activeTheme.colorPalette.primaryAccent, role: 'Focal headlines, CTA badges' },
                        { label: 'Secondary Accent', hex: activeTheme.colorPalette.secondaryAccent, role: 'Metrics, sub-badges' },
                        { label: 'Surface', hex: activeTheme.colorPalette.surface, role: 'Card background' },
                        { label: 'Background', hex: activeTheme.colorPalette.background, role: 'Canvas canvas' },
                        { label: 'Text Primary', hex: activeTheme.colorPalette.textPrimary, role: 'Headlines, titles' },
                        { label: 'Border / Line', hex: activeTheme.colorPalette.border, role: 'Dividers & grids' }
                      ].map((swatch, idx) => (
                        <div
                          key={idx}
                          onClick={() => copyToClipboard(swatch.hex, `hex_${idx}`)}
                          className="group cursor-pointer bg-[#121212] border border-[#262626] hover:border-amber-500/50 p-3 rounded-xl transition space-y-2 relative"
                        >
                          <div
                            className="w-full h-12 rounded-lg border border-white/10 shadow-inner flex items-end justify-end p-1.5"
                            style={{ backgroundColor: swatch.hex }}
                          >
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
                              {copiedKey === `hex_${idx}` ? 'COPIED!' : swatch.hex}
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                              {swatch.label}
                            </div>
                            <div className="text-[10px] text-[#888888] truncate">
                              {swatch.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Typography System Specimen */}
                  <div className="lg:col-span-6 bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#272727] pb-3">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-purple-400" />
                        <h4 className="text-sm font-bold text-white">Typography Pairing Specimen</h4>
                      </div>
                      <span className="text-[10px] text-[#888888] bg-[#222] px-2 py-0.5 rounded">
                        {activeTheme.typography.hierarchyRule}
                      </span>
                    </div>

                    {/* Specimen Box */}
                    <div className="bg-[#121212] border border-[#272727] rounded-xl p-5 space-y-4">
                      {/* Display Specimen */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
                          Display Font: {activeTheme.typography.displayFont} (Titles & Hero)
                        </div>
                        <div className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                          {currentEntry.title}
                        </div>
                      </div>

                      {/* Body Specimen */}
                      <div className="space-y-1 pt-2 border-t border-[#222]">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          Body Font: {activeTheme.typography.bodyFont} (Executive Takeaways)
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Enterprise transformation requires decoupled domain architectures and clean governance. Every modernization initiative must safeguard business continuity while enabling high-velocity agentic workflows.
                        </p>
                      </div>

                      {/* Code / Metric Specimen */}
                      <div className="space-y-1 pt-2 border-t border-[#222]">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                          Code & Telemetry Font: {activeTheme.typography.codeFont}
                        </div>
                        <div className="font-mono text-xs text-amber-300/90 bg-[#0a0a0a] p-2.5 rounded-lg border border-[#222]">
                          $ SUCCESSLABS_SYS_INIT --domain "{currentEntry.domain}" --arch "CLEAN_CORE" --status OK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Geometry, Grids & Iconography Blueprint */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Geometry & Grid */}
                  <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#272727] pb-3">
                      <Grid className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">Geometry & Grid Architecture</h4>
                    </div>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div>
                        <strong className="text-white">Container Radius:</strong> {activeTheme.geometryAndGrid.cardRadius}
                      </div>
                      <div>
                        <strong className="text-white">Grid Texture:</strong> {activeTheme.geometryAndGrid.gridPattern}
                      </div>
                      <div>
                        <strong className="text-white">Composition Flow:</strong> {activeTheme.geometryAndGrid.composition}
                      </div>
                    </div>

                    {/* Interactive Grid Pattern Simulation */}
                    <div className="h-20 rounded-xl border border-[#2e2e2e] bg-[#0f0f0f] relative overflow-hidden flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                          backgroundSize: '16px 16px'
                        }}
                      />
                      <span className="relative z-10 text-[11px] font-mono text-slate-400 bg-black/60 px-3 py-1 rounded border border-white/10">
                        Isometric Dot Matrix Grid Simulation ({activeTheme.geometryAndGrid.cardRadius})
                      </span>
                    </div>
                  </div>

                  {/* Iconography & Schematic Style */}
                  <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#272727] pb-3">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white">Iconography & Diagram Rules</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeTheme.iconographyStyle}
                    </p>
                    <div className="p-3.5 bg-[#121212] border border-[#222] rounded-xl text-xs text-[#aaaaaa] space-y-1">
                      <div className="text-[11px] font-bold text-white">Anti-Slop Design Rule:</div>
                      <div>• No glowing neon dropshadows or blurred purple gradients</div>
                      <div>• Zero generic floating 3D spheres or vague brain icons</div>
                      <div>• Crisp 1.5px monoline vectors with exact orthogonal vertices</div>
                    </div>
                  </div>
                </div>

                {/* 4. Ready-to-Copy AI Image Generator Prompt */}
                <div className="bg-gradient-to-r from-[#181818] via-[#1c1824] to-[#181818] border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#2e2e2e] pb-3">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">Generative AI Image Prompt (Midjourney / Imagen / Nano Banana)</h4>
                    </div>
                    <button
                      onClick={() => copyToClipboard(activeTheme.aiImagePrompt, 'ai_img_prompt_copy')}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
                    >
                      {copiedKey === 'ai_img_prompt_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy AI Prompt</span>
                    </button>
                  </div>

                  <div className="bg-[#101010] p-4 rounded-xl border border-[#252525] font-mono text-xs text-amber-200/90 leading-relaxed whitespace-pre-line select-all">
                    {activeTheme.aiImagePrompt}
                  </div>
                  <p className="text-[11px] text-[#888888]">
                    💡 Paste this prompt into Google Imagen, Midjourney, or Nano Banana to generate high-CTR carousel covers, LinkedIn banners, or slide backgrounds.
                  </p>
                </div>
              </div>
            );
          })()}

          {/* 5. Interactive Custom Gemini Mood Board Generator */}
          <div className="bg-[#181818] border border-[#272727] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <h3 className="text-sm font-bold text-white">
                  Generate Bespoke AI Mood Board with Gemini
                </h3>
              </div>
              <span className="text-[10px] text-[#aaaaaa] bg-[#222] px-2 py-0.5 rounded border border-[#333]">
                Gemini 3.8 Flash Engine
              </span>
            </div>

            <p className="text-xs text-[#aaaaaa]">
              Need a specialized aesthetic for a specific industry keynote, boardroom presentation, or technical publication? Provide custom creative direction below:
            </p>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Presets:</span>
              {[
                'SAP S/4HANA Clean Core Blueprint',
                'German Industrial Manufacturing Dark Mode',
                'European Banking Minimalist Monochrome',
                'Agentic AI Cyber Mesh Architecture',
                'Swiss High-Contrast Technical Grid'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomMoodPrompt(preset);
                    handleGenerateAiMoodBoard(preset);
                  }}
                  className="px-2.5 py-1 bg-[#222] hover:bg-[#2e2e2e] text-[11px] text-slate-300 hover:text-white rounded-lg border border-[#333] transition"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Prompt Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateAiMoodBoard();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customMoodPrompt}
                onChange={(e) => setCustomMoodPrompt(e.target.value)}
                placeholder="Describe your desired aesthetic (e.g. 'Stark Bauhaus grid with deep slate and electric cobalt for SAP enterprise architects')..."
                className="flex-1 bg-[#121212] border border-[#2e2e2e] focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#666666] outline-none transition"
              />
              <button
                type="submit"
                disabled={isGeneratingMoodBoard || !customMoodPrompt.trim()}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap shadow"
              >
                {isGeneratingMoodBoard ? (
                  <span>Synthesizing...</span>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Mood Board</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Result Card */}
            {aiMoodBoardResult && (
              <div className="bg-[#121212] border border-amber-500/40 rounded-xl p-5 space-y-3 mt-4">
                <div className="flex items-center justify-between border-b border-[#222222] pb-2 text-[11px] font-bold text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Custom Gemini AI Mood Board Specification
                  </span>
                  <button
                    onClick={() => copyToClipboard(aiMoodBoardResult, 'gemini_mb_copy')}
                    className="text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    {copiedKey === 'gemini_mb_copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <div className="markdown-body text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                  <Markdown>{aiMoodBoardResult}</Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          GEMINI AI REMIX COPILOT BAR (Bottom Interactive Tuning)
      ========================================================================= */}
      <div className="bg-[#181818] border border-[#272727] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              AI Remix Copilot for Day #{currentEntry.id}
            </h3>
          </div>
          {hasApiKey ? (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Gemini AI Engine Active
            </span>
          ) : (
            <span className="text-[10px] text-[#aaaaaa] bg-[#222222] px-2 py-0.5 rounded border border-[#333333]">
              Meta Architect Engine Ready
            </span>
          )}
        </div>

        <form onSubmit={handleAskGemini} className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask AI to remix or refine (e.g. 'Make the Instagram hook more controversial', 'Adapt for Energy Sector CFO', 'Generate 3 alternative Reels hooks')..."
            className="flex-1 bg-[#121212] border border-[#2e2e2e] focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#666666] outline-none transition"
          />
          <button
            type="submit"
            disabled={isAiLoading || !customPrompt.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap shadow"
          >
            {isAiLoading ? (
              <span>Thinking...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Remix</span>
              </>
            )}
          </button>
        </form>

        {aiCustomOutput && (
          <div className="bg-[#121212] border border-pink-500/30 rounded-xl p-4 text-xs text-slate-200 space-y-2">
            <div className="flex items-center justify-between border-b border-[#222222] pb-2 text-[11px] font-bold text-pink-400">
              <span>Gemini AI Custom Remix Output</span>
              <button
                onClick={() => copyToClipboard(aiCustomOutput, 'ai_out')}
                className="text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copiedKey === 'ai_out' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {aiCustomOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
