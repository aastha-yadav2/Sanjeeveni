import React, { useState } from 'react';
import { TriageSession } from '../../types/triage';
import { Plus, MessageSquare, Search, Clock, Trash2, Shield, HeartPulse, ChevronLeft } from 'lucide-react';
import { UrgencyBadge } from '../ui/UrgencyBadge';

interface ChatHistorySidebarProps {
  sessions: TriageSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onClearAllHistory: () => void;
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onClearAllHistory,
  isOpen,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.summary.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 glass-sidebar border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-500 flex items-center justify-center text-white shadow-sm">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-800 tracking-tight">Triage History</span>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* New Session Button */}
        <button
          onClick={() => {
            onNewSession();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full gradient-button py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Health Assessment</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search symptoms or sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Recent Consultations ({filteredSessions.length})
        </p>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No previous health assessments found.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all border ${
                  isActive
                    ? 'bg-white border-primary-300 shadow-md shadow-primary-500/10'
                    : 'bg-white/50 border-slate-200/60 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-xs text-slate-800 line-clamp-1">
                    {session.title}
                  </span>
                  <UrgencyBadge level={session.summary.urgency} size="sm" showLabel={false} />
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                  Symptoms: {session.summary.symptoms.join(', ') || 'Evaluating...'}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-primary-500" />
                    {session.messages.length} messages
                  </span>
                  <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-slate-200/80 bg-white/40 space-y-2">
        <button
          onClick={onClearAllHistory}
          className="w-full text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center font-medium">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span>Encrypted Local Storage</span>
        </div>
      </div>
    </aside>
  );
};
