import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AssessmentSession } from '../types/triage';
import { SAMPLE_TRIAGE_SESSIONS, INITIAL_SAMPLE_CHIPS } from '../data/mockData';
import { api } from '../services/api';
import { speechService } from '../services/speechService';
import { Navbar } from '../components/layout/Navbar';
import { ChatBubble } from '../components/chat/ChatBubble';
import { ChatHistorySidebar } from '../components/chat/ChatHistorySidebar';
import { HealthSummarySidebar } from '../components/chat/HealthSummarySidebar';
import { VoiceButton } from '../components/ui/VoiceButton';
import { TypingIndicator } from '../components/ui/TypingIndicator';
import { Toast, ToastMessage } from '../components/ui/Toast';
import { Send, Sparkles, AlertOctagon, History, PanelRight, RotateCcw, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/languages';

export const AssessmentPage: React.FC = () => {
  const [sessions, setSessions] = useState<AssessmentSession[]>(SAMPLE_TRIAGE_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(SAMPLE_TRIAGE_SESSIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Mobile Drawer Toggles
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Active Session Reference
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, isTyping]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: `t-${Date.now()}`, message, type });
  };

  // 1. Start New Session via API Service
  const handleNewSession = async () => {
    setIsTyping(true);
    try {
      const initResponse = await api.startAssessment(currentLang);
      const newSession: AssessmentSession = {
        id: `session-${Date.now()}`,
        title: "New Health Assessment",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        languageCode: currentLang,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'gemma',
            text: initResponse.assistantMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            thoughtProcess: initResponse.thoughtProcess
          }
        ],
        summary: initResponse.healthSummary
      };

      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      showToast("Started new health assessment session.", "success");
    } catch (err) {
      showToast("Failed to initialize assessment session", "error");
    } finally {
      setIsTyping(false);
    }
  };

  // 2. Send Message via API Service
  const handleSendMessage = async (textToSend?: string, isVoice: boolean = false) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: userTimestamp,
      isVoiceInput: isVoice
    };

    const updatedMessages = [...activeSession.messages, userMessage];
    const newTitle = activeSession.messages.length <= 1 
      ? (text.length > 25 ? text.substring(0, 25) + '...' : text)
      : activeSession.title;

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: updatedMessages
        };
      }
      return s;
    }));

    setInputText('');
    setIsTyping(true);

    try {
      // Call Centralized API Service (Decoupled Backend Call)
      const apiResponse = await api.sendMessage(
        activeSession.id,
        text,
        currentLang,
        activeSession.summary
      );

      const gemmaMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'gemma',
        text: apiResponse.assistantMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        urgencyLevel: apiResponse.healthSummary.urgency,
        thoughtProcess: apiResponse.thoughtProcess
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            messages: [...updatedMessages, gemmaMessage],
            summary: apiResponse.healthSummary
          };
        }
        return s;
      }));

      if (apiResponse.healthSummary.emergency) {
        showToast("⚠️ Emergency symptoms detected! Call emergency services immediately.", "error");
      }
    } catch (err) {
      showToast("Error communicating with triage API", "error");
    } finally {
      setIsTyping(false);
    }
  };

  // 3. Web Speech API Integration (Populates text input box)
  const handleToggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      showToast("Voice input stopped.");
    } else {
      const success = speechService.startListening(
        currentLang,
        (result) => {
          setInputText(result.transcript);
          if (result.isFinal) {
            setIsListening(false);
            handleSendMessage(result.transcript, true);
          }
        },
        (error) => {
          setIsListening(false);
          const sample = currentLang === 'hi'
            ? "मुझे 2 दिनों से तेज़ बुखार है"
            : "I have had a high fever for two days.";
          setInputText(sample);
          showToast(`Voice simulated: "${sample}"`, "info");
        },
        () => setIsListening(false)
      );

      if (success) {
        setIsListening(true);
        showToast("Listening... Speak your symptoms into your microphone.", "info");
      }
    }
  };

  const handleClearCurrentSession = async () => {
    await api.clearSession(activeSession.id);
    handleNewSession();
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Navbar currentLang={currentLang} onSelectLang={setCurrentLang} />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT COLUMN: History Sidebar */}
        <ChatHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
          onClearAllHistory={() => setSessions([])}
          isOpen={leftSidebarOpen}
          onCloseMobile={() => setLeftSidebarOpen(false)}
        />

        {/* CENTER COLUMN: Chat Interface */}
        <main className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
          
          {/* Top Bar for Chat Mobile & Controls */}
          <div className="px-4 py-3 bg-white/80 border-b border-slate-200/80 flex items-center justify-between shadow-sm z-10 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Toggle History"
              >
                <History className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xs text-slate-800 line-clamp-1">
                    {activeSession.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium">FastAPI + Gemma Backend Stream</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <Globe className="w-3.5 h-3.5 text-primary-600 ml-1.5" />
                <select
                  value={currentLang}
                  onChange={(e) => setCurrentLang(e.target.value)}
                  className="bg-transparent text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer pr-2"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleClearCurrentSession}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                title="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Toggle Summary"
              >
                <PanelRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Emergency Alert Banner Overlay */}
          {activeSession.summary.emergency && (
            <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-between shadow-md text-xs font-bold animate-pulse">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 shrink-0 text-white" />
                <span>EMERGENCY PROTOCOL: High-risk medical markers detected. Contact emergency services (911 / 108) immediately.</span>
              </div>
            </div>
          )}

          {/* Chat Messages Container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto"
          >
            {activeSession.messages.map((message) => (
              <ChatBubble key={message.id} message={message} languageCode={currentLang} />
            ))}

            {isTyping && <TypingIndicator statusText="FastAPI Backend calling Google Gemma LLM..." />}
          </div>

          {/* Smart Suggestion Chips */}
          <div className="px-4 py-2 max-w-4xl w-full mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Symptoms:</span>
              {INITIAL_SAMPLE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white text-slate-700 hover:bg-primary-50 hover:text-primary-600 border border-slate-200 shadow-sm shrink-0 transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar Section */}
          <div className="p-4 bg-white/90 border-t border-slate-200 shadow-lg backdrop-blur-lg">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              
              <VoiceButton
                isListening={isListening}
                onToggle={handleToggleVoice}
                size="md"
              />

              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={
                    isListening
                      ? "Listening to voice input..."
                      : currentLang === 'hi' 
                        ? "अपने लक्षण लिखें (उदा: मुझे 2 दिनों से तेज़ बुखार है)..."
                        : "Describe your symptoms (e.g., I have had a high fever for two days)..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="gradient-button p-3.5 rounded-2xl shadow-md shadow-primary-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium mt-2">
              Sanjeevani AI provides triage assessment guidance only. Not a medical diagnosis.
            </p>
          </div>

        </main>

        {/* RIGHT COLUMN: Live Health Summary Sidebar */}
        <aside
          className={`fixed inset-y-0 right-0 z-40 w-80 lg:w-88 bg-slate-50/90 backdrop-blur-xl border-l border-slate-200 p-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <HealthSummarySidebar
            summary={activeSession.summary}
            onClearSession={handleClearCurrentSession}
          />
        </aside>

      </div>
    </div>
  );
};
