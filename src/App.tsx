import React, { useState, useEffect } from 'react';
import { MASTER_CALENDAR, getCalendarEntryById } from './data/calendarData.ts';
import { Header } from './components/Header.tsx';
import { CopilotWorkspace } from './components/CopilotWorkspace.tsx';
import { CalendarBrowser } from './components/CalendarBrowser.tsx';
import { WeeklyArchitectureView } from './components/WeeklyArchitectureView.tsx';
import { AnalyticsFeedbackView } from './components/AnalyticsFeedbackView.tsx';
import { PresenterModeModal } from './components/PresenterModeModal.tsx';
import { MetaRemixStudio } from './components/MetaRemixStudio.tsx';

export default function App() {
  const [currentEntryId, setCurrentEntryId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'studio' | 'meta' | 'calendar' | 'weekly' | 'analytics'>('meta');
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState<boolean>(false);
  const [teleprompterScript, setTeleprompterScript] = useState<string>('');

  // Check health & API Key status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch((err) => console.log('Health check note:', err));
  }, []);

  const currentEntry = getCalendarEntryById(currentEntryId) || MASTER_CALENDAR[0];

  const handleSelectDay = (id: number, switchToStudio: boolean = false) => {
    setCurrentEntryId(id);
    if (switchToStudio) {
      setActiveTab('studio');
    }
  };

  const handleOpenTeleprompter = (script?: string) => {
    if (script) {
      setTeleprompterScript(script);
    }
    setIsTeleprompterOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Sticky Top Header Navigation */}
      <Header
        currentEntry={currentEntry}
        totalDays={MASTER_CALENDAR.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectDay={handleSelectDay}
        onOpenTeleprompter={() => handleOpenTeleprompter()}
        hasApiKey={hasApiKey}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'meta' && (
          <MetaRemixStudio
            currentEntry={currentEntry}
            onSelectDay={handleSelectDay}
            onOpenTeleprompter={handleOpenTeleprompter}
            hasApiKey={hasApiKey}
          />
        )}

        {activeTab === 'studio' && (
          <CopilotWorkspace
            currentEntry={currentEntry}
            onSelectDay={handleSelectDay}
            onOpenTeleprompter={handleOpenTeleprompter}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarBrowser
            entries={MASTER_CALENDAR}
            currentEntryId={currentEntryId}
            onSelectDay={handleSelectDay}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyArchitectureView
            currentEntry={currentEntry}
            onSelectDay={handleSelectDay}
            entries={MASTER_CALENDAR}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsFeedbackView
            currentEntry={currentEntry}
            onSelectDay={handleSelectDay}
            entries={MASTER_CALENDAR}
          />
        )}
      </main>

      {/* Footer focused on Meta Suite Theme */}
      <footer className="border-t border-[#272727] bg-[#0f0f0f] py-6 text-xs text-[#888888] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-white">Meta Suite Live Architect</strong> • SuccessLabs Academy • Niladri Bihari Nayak
          </div>
          <div>
            365-Day Meta Suite Live Architect Operating System • Facebook • Instagram • WhatsApp • Threads
          </div>
        </div>
      </footer>

      {/* Presenter Modal */}
      <PresenterModeModal
        isOpen={isTeleprompterOpen}
        onClose={() => setIsTeleprompterOpen(false)}
        entry={currentEntry}
        scriptContent={
          teleprompterScript ||
          `# PRESENTER SCRIPT — DAY #${currentEntry.id}\n**${currentEntry.title}**\n\n*(Ready to broadcast. Load Presenter Script from Studio to see teleprompter cues.)*`
        }
      />
    </div>
  );
}
