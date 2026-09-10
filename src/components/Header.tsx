import React from 'react';
import { CalendarEntry } from '../types.ts';
import {
  Calendar,
  Sparkles,
  Tv,
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers,
  Flame,
  Radio,
  Share2
} from 'lucide-react';

interface HeaderProps {
  currentEntry: CalendarEntry;
  totalDays: number;
  activeTab: 'studio' | 'meta' | 'calendar' | 'weekly' | 'analytics';
  setActiveTab: (tab: 'studio' | 'meta' | 'calendar' | 'weekly' | 'analytics') => void;
  onSelectDay: (id: number) => void;
  onOpenTeleprompter: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentEntry,
  totalDays,
  activeTab,
  setActiveTab,
  onSelectDay,
  onOpenTeleprompter,
  hasApiKey
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#272727]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Row */}
        <div className="py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-[#272727]">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  Meta Suite Live Architect
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#222222] text-slate-300 border border-[#383838]">
                  SuccessLabs Academy
                </span>
                {hasApiKey ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-600/40">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    Meta Suite Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-pink-300 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-800/40">
                    <Share2 className="w-3 h-3 text-pink-400" />
                    FB • IG • WA • Threads
                  </span>
                )}
              </div>
              <p className="text-xs text-[#aaaaaa]">
                <strong className="text-white font-medium">Architecting experiences for a better world</strong> • Niladri Bihari Nayak • 365-Day Meta Suite Transformation Operating System
              </p>
            </div>
          </div>

          {/* Quick Date Stepper & Utility Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Day Selector Pill */}
            <div className="flex items-center bg-[#181818] border border-[#272727] rounded-lg p-1">
              <button
                onClick={() => onSelectDay(Math.max(1, currentEntry.id - 1))}
                disabled={currentEntry.id <= 1}
                className="p-1.5 text-[#aaaaaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-[#272727] transition"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 text-center">
                <div className="text-xs font-black text-white whitespace-nowrap">
                  DAY #{currentEntry.id} <span className="text-[#717171] font-normal">/ {totalDays}</span>
                </div>
                <div className="text-[10px] text-pink-400 font-semibold whitespace-nowrap">
                  {currentEntry.date} ({currentEntry.dayOfWeek})
                </div>
              </div>
              <button
                onClick={() => onSelectDay(Math.min(totalDays, currentEntry.id + 1))}
                disabled={currentEntry.id >= totalDays}
                className="p-1.5 text-[#aaaaaa] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-[#272727] transition"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Jump to Season Premiere */}
            <button
              onClick={() => onSelectDay(1)}
              className="px-2.5 py-1.5 bg-[#181818] hover:bg-[#272727] border border-[#2e2e2e] text-xs font-bold text-slate-200 rounded-lg flex items-center gap-1.5 transition"
              title="Jump to Day 1"
            >
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              <span>Day 1 (11 Sep)</span>
            </button>

            {/* Teleprompter Button */}
            <button
              onClick={onOpenTeleprompter}
              className="px-2.5 py-1.5 bg-pink-950/80 hover:bg-pink-900 border border-pink-700/60 text-xs font-bold text-pink-200 rounded-lg flex items-center gap-1.5 shadow-sm transition"
              title="Open Presenter Teleprompter"
            >
              <Tv className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Presenter View</span>
            </button>

            {/* Download Calendar */}
            <a
              href="/master_calendar.md"
              download="SuccessLabs_365_Calendar.md"
              className="p-2 bg-[#181818] hover:bg-[#272727] border border-[#2e2e2e] text-[#aaaaaa] hover:text-white rounded-lg transition"
              title="Download Master Calendar .md"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'meta'
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-pink-600/30 font-black'
                : 'text-pink-400 hover:text-white hover:bg-[#272727] border border-pink-900/40 bg-pink-950/20'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Meta Suite Live Architect</span>
            <span className="text-[10px] bg-pink-500/30 text-pink-200 px-1.5 py-0.2 rounded font-mono">FB • IG • WA • Threads</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-[#aaaaaa] hover:text-white hover:bg-[#272727]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Studio & Session Pack</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-[#aaaaaa] hover:text-white hover:bg-[#272727]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>365-Day Master Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'weekly'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-[#aaaaaa] hover:text-white hover:bg-[#272727]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Weekly Rhythm & 2027 Evolution</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-[#aaaaaa] hover:text-white hover:bg-[#272727]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Feedback Loop</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
