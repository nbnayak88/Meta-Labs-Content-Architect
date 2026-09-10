import React, { useState, useMemo } from 'react';
import { CalendarEntry } from '../types.ts';
import {
  Search,
  Filter,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  Flame,
  Radio
} from 'lucide-react';

interface CalendarBrowserProps {
  entries: CalendarEntry[];
  currentEntryId: number;
  onSelectDay: (id: number, switchToStudio?: boolean) => void;
}

export const CalendarBrowser: React.FC<CalendarBrowserProps> = ({
  entries,
  currentEntryId,
  onSelectDay
}) => {
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [intentFilter, setIntentFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Domains
  const domains = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.domain)));
  }, [entries]);

  // Phases
  const phases = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.phase)));
  }, [entries]);

  // Sectors
  const sectors = useMemo(() => {
    return Array.from(new Set(entries.map((e) => e.gicsSector))).filter((s) => s !== 'As applicable');
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch =
        !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.domain.toLowerCase().includes(search.toLowerCase()) ||
        e.gicsSector.toLowerCase().includes(search.toLowerCase()) ||
        e.angle.toLowerCase().includes(search.toLowerCase()) ||
        String(e.id) === search.trim() ||
        e.date.toLowerCase().includes(search.toLowerCase());

      const matchDomain = domainFilter === 'ALL' || e.domain === domainFilter;
      const matchPhase = phaseFilter === 'ALL' || e.phase === phaseFilter;
      const matchSector = sectorFilter === 'ALL' || e.gicsSector === sectorFilter;
      const matchIntent = intentFilter === 'ALL' || e.intent === intentFilter;

      return matchSearch && matchDomain && matchPhase && matchSector && matchIntent;
    });
  }, [entries, search, domainFilter, phaseFilter, sectorFilter, intentFilter]);

  const getDomainBadgeColor = (domain: string) => {
    switch (domain) {
      case 'HR':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'CRM / Customer Experience':
        return 'bg-purple-950 text-purple-300 border-purple-700/60';
      case 'Finance':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'Procurement':
        return 'bg-cyan-950 text-cyan-300 border-cyan-700/60';
      case 'Supply Chain':
        return 'bg-blue-950 text-blue-300 border-blue-700/60';
      case 'Enterprise Business':
        return 'bg-red-950 text-red-300 border-red-700/60';
      default:
        return 'bg-rose-950 text-rose-300 border-rose-700/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards - YouTube Studio Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#181818] border border-[#272727] p-3.5 rounded-xl">
          <div className="text-xs text-[#aaaaaa] font-medium flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-500" />
            <span>Consecutive Lives</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">365 Days</div>
          <div className="text-[11px] text-red-400 mt-0.5 font-medium">11 Sep 2026 → 10 Sep 2027</div>
        </div>

        <div className="bg-[#181818] border border-[#272727] p-3.5 rounded-xl">
          <div className="text-xs text-[#aaaaaa] font-medium">Weekly Rhythm</div>
          <div className="text-2xl font-black text-amber-400 mt-1">7 Domains</div>
          <div className="text-[11px] text-[#717171] mt-0.5">HR → CRM → FIN → PROC → SCM → BIZ → LDR</div>
        </div>

        <div className="bg-[#181818] border border-[#272727] p-3.5 rounded-xl">
          <div className="text-xs text-[#aaaaaa] font-medium">Enterprise Scope</div>
          <div className="text-2xl font-black text-red-400 mt-1">11 GICS Sectors</div>
          <div className="text-[11px] text-[#717171] mt-0.5">Cross-industry enterprise case studies</div>
        </div>

        <div className="bg-[#181818] border border-[#272727] p-3.5 rounded-xl">
          <div className="text-xs text-[#aaaaaa] font-medium">2027 Trend Lens</div>
          <div className="text-2xl font-black text-white mt-1">4 Phases</div>
          <div className="text-[11px] text-[#717171] mt-0.5">Foundation → Agentic → Autonomous → 2028</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181818] border border-[#272727] p-4 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#717171]" />
            <input
              type="text"
              placeholder="Search by topic, day #, SAP, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#101010] border border-[#333333] rounded-lg text-sm text-white placeholder-[#717171] focus:outline-none focus:border-red-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-xs text-[#aaaaaa] font-medium">
              Showing <span className="text-white font-bold">{filteredEntries.length}</span> of 365 Days
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#101010] border border-[#272727] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs font-bold transition ${
                  viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-[#aaaaaa] hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs font-bold transition ${
                  viewMode === 'table' ? 'bg-red-600 text-white' : 'text-[#aaaaaa] hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#272727]">
          {/* Domain Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] mb-1">Domain</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full bg-[#101010] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Domains (7)</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Phase Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] mb-1">Evolution Phase</label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full bg-[#101010] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All 4 Phases</option>
              {phases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] mb-1">GICS Sector</label>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full bg-[#101010] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All GICS Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Intent Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#aaaaaa] mb-1">Content Intent</label>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="w-full bg-[#101010] border border-[#333333] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="ALL">All Intents</option>
              <option value="authority">Authority (Thought Leadership)</option>
              <option value="help">Help (Architecture Problem Solving)</option>
              <option value="search">Search (High Intent SEO)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => {
            const isSelected = entry.id === currentEntryId;
            return (
              <div
                key={entry.id}
                onClick={() => onSelectDay(entry.id, false)}
                className={`cursor-pointer rounded-xl border p-4 transition duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#221010] border-red-600 shadow-lg shadow-red-950/40 ring-1 ring-red-600'
                    : 'bg-[#181818] border-[#272727] hover:border-[#383838] hover:bg-[#1f1f1f]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-white bg-red-600 px-2 py-0.5 rounded shadow-sm">
                        DAY #{entry.id}
                      </span>
                      <span className="text-[11px] text-[#aaaaaa]">
                        {entry.date} ({entry.dayOfWeek.slice(0, 3)})
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDomainBadgeColor(entry.domain)}`}>
                      {entry.domain}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2 mb-2">
                    {entry.title}
                  </h4>

                  <p className="text-xs text-[#aaaaaa] line-clamp-2 mb-3">
                    <strong className="text-white font-medium">Angle:</strong> {entry.angle}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#272727] flex items-center justify-between text-[11px]">
                  <div className="text-[#888888] truncate max-w-[170px]">
                    {entry.gicsSector !== 'As applicable' ? entry.gicsSector : entry.phase.split(' - ')[0]}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDay(entry.id, true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition"
                  >
                    <span>Open Live Pack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#181818] border border-[#272727] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101010] text-[#aaaaaa] border-b border-[#272727] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Day #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-4">Episode Title</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3">Phase</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272727] text-slate-200">
                {filteredEntries.map((entry) => {
                  const isSelected = entry.id === currentEntryId;
                  return (
                    <tr
                      key={entry.id}
                      onClick={() => onSelectDay(entry.id, false)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-red-950/30 font-semibold' : 'hover:bg-[#202020]'
                      }`}
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-red-400">
                        #{entry.id}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[#aaaaaa]">
                        {entry.date} <span className="text-[10px]">({entry.dayOfWeek.slice(0, 3)})</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDomainBadgeColor(entry.domain)}`}>
                          {entry.domain}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-white max-w-xs truncate">
                        {entry.title}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[#aaaaaa]">
                        {entry.gicsSector}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-[#717171]">
                        {entry.phase.split(' - ')[0]}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDay(entry.id, true);
                          }}
                          className="px-2 py-1 bg-[#272727] hover:bg-red-600 hover:text-white text-xs text-[#dddddd] rounded transition"
                        >
                          Studio →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
